import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // User Roles
  type UserType = {
    #individual;
    #company;
    #recycler;
  };

  module UserType {
    public func compare(a : UserType, b : UserType) : Order.Order {
      switch (a, b) {
        case (#individual, #recycler) { #less };
        case (#individual, #company) { #less };
        case (#company, #recycler) { #less };
        case (#company, #individual) { #greater };
        case (#recycler, #company) { #greater };
        case (#recycler, #individual) { #greater };
        case (_) { #equal };
      };
    };
  };

  // User Profile
  public type UserProfile = {
    id : Principal;
    name : Text;
    email : Text;
    userType : UserType;
    isVerified : Bool;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      switch (Text.compare(a.name, b.name)) {
        case (#equal) { Text.compare(a.email, b.email) };
        case (order) { order };
      };
    };
  };

  // E-Waste Listing
  public type EProduct = {
    id : Text;
    owner : Principal;
    title : Text;
    description : Text;
    category : Text;
    condition : Text;
    quantity : Nat;
    price : Nat;
    photos : [Storage.ExternalBlob];
    status : { #available; #pending; #sold };
  };

  // Recycler Price Entry
  public type RecyclerPrice = {
    recycler : Principal;
    category : Text;
    pricePerUnit : Nat;
  };

  // Transaction Record
  public type Transaction = {
    id : Text;
    seller : Principal;
    recycler : Principal;
    productId : Text;
    quantity : Nat;
    totalPrice : Nat;
    status : { #pending; #confirmed; #completed };
    timestamp : Int;
  };

  // Maps and State
  let accessControlState = AccessControl.initState();

  let userProfiles = Map.empty<Principal, UserProfile>();
  let eProducts = Map.empty<Text, EProduct>();
  let baskets = Map.empty<Principal, Map.Map<Text, Nat>>();
  let recyclerPrices = Map.empty<Text, RecyclerPrice>(); // key: recycler#category
  let transactions = Map.empty<Text, Transaction>();
  var nextProductId = 0;
  var nextTransactionId = 0;

  // Authorization Mixin
  include MixinAuthorization(accessControlState);

  // Helper function to check if user is authenticated
  func isAuthenticated(caller : Principal) : Bool {
    AccessControl.hasPermission(accessControlState, caller, #user)
  };

  // Helper function to check if user is a recycler
  func isRecycler(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.userType == #recycler };
      case (null) { false };
    };
  };

  // Helper function to check if user is a company
  func isCompany(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.userType == #company };
      case (null) { false };
    };
  };

  // Helper function to check if recycler is verified
  func isVerifiedRecycler(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (?profile) { profile.userType == #recycler and profile.isVerified };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller = _ }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Anyone can view public profile information
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };

    // Ensure the profile ID matches the caller
    if (profile.id != caller) {
      Runtime.trap("Unauthorized: Cannot save profile for another user");
    };

    userProfiles.add(caller, profile);
  };

  // Admin function to verify recyclers
  public shared ({ caller }) func verifyRecycler(recyclerPrincipal : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify recyclers");
    };

    let profile = switch (userProfiles.get(recyclerPrincipal)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    if (profile.userType != #recycler) {
      Runtime.trap("User is not a recycler");
    };

    let updatedProfile : UserProfile = {
      profile with isVerified = true;
    };

    userProfiles.add(recyclerPrincipal, updatedProfile);
  };

  // Admin function to revoke recycler verification
  public shared ({ caller }) func revokeRecyclerVerification(recyclerPrincipal : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can revoke recycler verification");
    };

    let profile = switch (userProfiles.get(recyclerPrincipal)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found") };
    };

    let updatedProfile : UserProfile = {
      profile with isVerified = false;
    };

    userProfiles.add(recyclerPrincipal, updatedProfile);
  };

  // E-Waste Management
  type EProductInput = {
    title : Text;
    description : Text;
    category : Text;
    condition : Text;
    quantity : Nat;
    price : Nat;
  };

  public type EProductUpdate = {
    id : Text;
    title : Text;
    description : Text;
    category : Text;
    condition : Text;
    quantity : Nat;
    price : Nat;
    photos : [Storage.ExternalBlob];
  };

  public shared ({ caller }) func addProduct(product : EProductInput) : async Text {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can add products");
    };

    // Only individuals and companies can list products
    let profile = switch (userProfiles.get(caller)) {
      case (?p) { p };
      case (null) { Runtime.trap("User profile not found. Please create a profile first.") };
    };

    if (profile.userType == #recycler) {
      Runtime.trap("Unauthorized: Recyclers cannot list products for sale");
    };

    let productId = nextProductId.toText();
    let newProduct : EProduct = {
      id = productId;
      owner = caller;
      title = product.title;
      description = product.description;
      category = product.category;
      condition = product.condition;
      quantity = product.quantity;
      price = product.price;
      photos = [];
      status = #available;
    };

    eProducts.add(productId, newProduct);
    nextProductId += 1;
    productId;
  };

  public query ({ caller = _ }) func getProduct(productId : Text) : async EProduct {
    // Anyone can view products (including guests for browsing)
    switch (eProducts.get(productId)) {
      case (?product) { product };
      case (null) { Runtime.trap("Product not found") };
    };
  };

  public query ({ caller = _ }) func getAllProducts() : async [EProduct] {
    // Anyone can view all products (including guests for browsing)
    eProducts.values().toArray();
  };

  public query ({ caller = _ }) func getProductsByStatus(status : { #available; #pending; #sold }) : async [EProduct] {
    // Anyone can view products by status
    let filteredProducts = eProducts.values().toArray().filter(
      func(product) { product.status == status }
    );
    filteredProducts;
  };

  public shared ({ caller }) func updateProduct(product : EProductUpdate) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can update products");
    };

    let existingProduct = switch (eProducts.get(product.id)) {
      case (?prod) { prod };
      case (null) { Runtime.trap("Product not found") };
    };

    if (existingProduct.owner != caller) {
      Runtime.trap("Unauthorized: Only the product owner can update this product");
    };

    let updatedProduct : EProduct = {
      existingProduct with
      title = product.title;
      description = product.description;
      category = product.category;
      condition = product.condition;
      quantity = product.quantity;
      price = product.price;
      photos = product.photos;
    };

    eProducts.add(product.id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can delete products");
    };

    let existingProduct = switch (eProducts.get(productId)) {
      case (?prod) { prod };
      case (null) { Runtime.trap("Product not found") };
    };

    if (existingProduct.owner != caller) {
      Runtime.trap("Unauthorized: Only the product owner can delete this product");
    };

    eProducts.remove(productId);
  };

  // Recycler Price Management
  public shared ({ caller }) func setRecyclerPrice(category : Text, pricePerUnit : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can set prices");
    };

    if (not isVerifiedRecycler(caller)) {
      Runtime.trap("Unauthorized: Only verified recyclers can set prices");
    };

    let key = caller.toText() # "#" # category;
    let priceEntry : RecyclerPrice = {
      recycler = caller;
      category = category;
      pricePerUnit = pricePerUnit;
    };

    recyclerPrices.add(key, priceEntry);
  };

  public query ({ caller = _ }) func getRecyclerPrices(category : Text) : async [RecyclerPrice] {
    // Anyone can view recycler prices for comparison
    let allPrices = recyclerPrices.values().toArray();
    allPrices.filter(func(price) { price.category == category });
  };

  public query ({ caller = _ }) func getAllRecyclerPrices() : async [RecyclerPrice] {
    // Anyone can view all recycler prices
    recyclerPrices.values().toArray();
  };

  // Basket Management
  public shared ({ caller }) func addToBasket(productId : Text, quantity : Nat) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can add to basket");
    };

    // Only recyclers can add to basket (they are the buyers)
    if (not isRecycler(caller)) {
      Runtime.trap("Unauthorized: Only recyclers can add products to basket");
    };

    let product = switch (eProducts.get(productId)) {
      case (?p) { p };
      case (null) { Runtime.trap("Product not found") };
    };

    // Recyclers cannot buy their own products (if they somehow listed any)
    if (product.owner == caller) {
      Runtime.trap("Cannot add your own product to basket");
    };

    if (quantity > product.quantity) {
      Runtime.trap(
        "Requested quantity: " # Nat.toText(quantity) # " exceeds available: " # Nat.toText(product.quantity)
      );
    };

    switch (callersBasketQuantityInternal(caller, productId)) {
      case (?basketQty) {
        let totalRequested = basketQty + quantity;
        if (totalRequested > product.quantity) {
          Runtime.trap(
            "Total requested quantity exceeds available: " # Nat.toText(product.quantity - basketQty)
          );
        };
      };
      case (null) {};
    };

    let basket = switch (baskets.get(caller)) {
      case (?b) { b };
      case (null) {
        let newBasket = Map.empty<Text, Nat>();
        baskets.add(caller, newBasket);
        newBasket;
      };
    };

    basket.add(productId, quantity);
  };

  public shared ({ caller }) func removeFromBasket(productId : Text) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can remove from basket");
    };

    let basket = switch (baskets.get(caller)) {
      case (?b) { b };
      case (null) { Runtime.trap("Basket is empty") };
    };
    basket.remove(productId);
  };

  public query ({ caller }) func viewBasket() : async [(Text, (EProduct, Nat))] {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view basket");
    };

    let basket = switch (baskets.get(caller)) {
      case (?b) { b };
      case (null) { return [] };
    };

    let basketEntries = basket.toArray();
    basketEntries.map(
      func((productId, quantity)) {
        let product = switch (eProducts.get(productId)) {
          case (?p) { p };
          case (null) { Runtime.trap("Product not found in basket") };
        };
        (productId, (product, quantity));
      }
    );
  };

  func callersBasketQuantityInternal(caller : Principal, productId : Text) : ?Nat {
    let basket = switch (baskets.get(caller)) {
      case (?b) { b };
      case (null) { return null };
    };
    basket.get(productId);
  };

  public query ({ caller }) func callersBasketQuantity(caller : Principal, productId : Text) : async ?Nat {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can check basket quantity");
    };
    callersBasketQuantityInternal(caller, productId);
  };

  // Transaction Management
  public shared ({ caller }) func createTransaction(productId : Text, quantity : Nat) : async Text {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can create transactions");
    };

    // Only verified recyclers can create transactions (purchase)
    if (not isVerifiedRecycler(caller)) {
      Runtime.trap("Unauthorized: Only verified recyclers can create transactions");
    };

    let product = switch (eProducts.get(productId)) {
      case (?p) { p };
      case (null) { Runtime.trap("Product not found") };
    };

    if (product.owner == caller) {
      Runtime.trap("Cannot purchase your own product");
    };

    if (quantity > product.quantity) {
      Runtime.trap("Requested quantity exceeds available quantity");
    };

    let transactionId = nextTransactionId.toText();
    let transaction : Transaction = {
      id = transactionId;
      seller = product.owner;
      recycler = caller;
      productId = productId;
      quantity = quantity;
      totalPrice = product.price * quantity;
      status = #pending;
      timestamp = 0; // In production, use Time.now()
    };

    transactions.add(transactionId, transaction);
    nextTransactionId += 1;

    // Update product quantity
    let updatedProduct : EProduct = {
      product with
      quantity = product.quantity - quantity;
      status = if (product.quantity - quantity == 0) { #sold } else { product.status };
    };
    eProducts.add(productId, updatedProduct);

    transactionId;
  };

  public shared ({ caller }) func updateTransactionStatus(
    transactionId : Text,
    newStatus : { #pending; #confirmed; #completed }
  ) : async () {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can update transactions");
    };

    let transaction = switch (transactions.get(transactionId)) {
      case (?t) { t };
      case (null) { Runtime.trap("Transaction not found") };
    };

    // Only seller or recycler involved in the transaction can update it
    if (transaction.seller != caller and transaction.recycler != caller) {
      Runtime.trap("Unauthorized: Only parties involved in the transaction can update it");
    };

    let updatedTransaction : Transaction = {
      transaction with status = newStatus;
    };

    transactions.add(transactionId, updatedTransaction);
  };

  public query ({ caller }) func getTransaction(transactionId : Text) : async Transaction {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view transactions");
    };

    let transaction = switch (transactions.get(transactionId)) {
      case (?t) { t };
      case (null) { Runtime.trap("Transaction not found") };
    };

    // Only parties involved or admin can view transaction details
    if (transaction.seller != caller and transaction.recycler != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own transactions");
    };

    transaction;
  };

  public query ({ caller }) func getMyTransactions() : async [Transaction] {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view transactions");
    };

    let allTransactions = transactions.values().toArray();
    allTransactions.filter(
      func(t) { t.seller == caller or t.recycler == caller }
    );
  };

  public query ({ caller }) func getMySellerTransactions() : async [Transaction] {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view transactions");
    };

    let allTransactions = transactions.values().toArray();
    allTransactions.filter(func(t) { t.seller == caller });
  };

  public query ({ caller }) func getMyRecyclerTransactions() : async [Transaction] {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view transactions");
    };

    if (not isRecycler(caller)) {
      Runtime.trap("Unauthorized: Only recyclers can view recycler transactions");
    };

    let allTransactions = transactions.values().toArray();
    allTransactions.filter(func(t) { t.recycler == caller });
  };

  // CSR Tracking (Company-specific)
  public type CSRMetrics = {
    totalItemsSold : Nat;
    totalRevenue : Nat;
    co2Saved : Nat; // in kg
    materialsRecycled : Nat; // in kg
  };

  public query ({ caller }) func getCSRMetrics() : async CSRMetrics {
    if (not isAuthenticated(caller)) {
      Runtime.trap("Unauthorized: Only authenticated users can view CSR metrics");
    };

    if (not isCompany(caller)) {
      Runtime.trap("Unauthorized: Only companies can view CSR metrics");
    };

    let myTransactions = transactions.values().toArray().filter(
      func(t) { t.seller == caller and t.status == #completed }
    );

    var totalItems : Nat = 0;
    var totalRevenue : Nat = 0;

    for (transaction in myTransactions.vals()) {
      totalItems += transaction.quantity;
      totalRevenue += transaction.totalPrice;
    };

    // Simplified calculation: 10kg CO2 saved per item, 5kg materials per item
    let co2Saved = totalItems * 10;
    let materialsRecycled = totalItems * 5;

    {
      totalItemsSold = totalItems;
      totalRevenue = totalRevenue;
      co2Saved = co2Saved;
      materialsRecycled = materialsRecycled;
    };
  };

  // Admin function to view all transactions
  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all transactions");
    };

    transactions.values().toArray();
  };

  // Admin function to view all users
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.values().toArray();
  };
};
