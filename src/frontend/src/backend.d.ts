import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface EProduct {
    id: string;
    status: Variant_pending_sold_available;
    title: string;
    owner: Principal;
    description: string;
    quantity: bigint;
    category: string;
    price: bigint;
    photos: Array<ExternalBlob>;
    condition: string;
}
export interface EProductUpdate {
    id: string;
    title: string;
    description: string;
    quantity: bigint;
    category: string;
    price: bigint;
    photos: Array<ExternalBlob>;
    condition: string;
}
export interface EProductInput {
    title: string;
    description: string;
    quantity: bigint;
    category: string;
    price: bigint;
    condition: string;
}
export interface RecyclerPrice {
    recycler: Principal;
    pricePerUnit: bigint;
    category: string;
}
export interface CSRMetrics {
    co2Saved: bigint;
    materialsRecycled: bigint;
    totalItemsSold: bigint;
    totalRevenue: bigint;
}
export interface UserProfile {
    id: Principal;
    userType: UserType;
    name: string;
    email: string;
    isVerified: boolean;
}
export interface Transaction {
    id: string;
    status: Variant_pending_completed_confirmed;
    recycler: Principal;
    productId: string;
    seller: Principal;
    timestamp: bigint;
    quantity: bigint;
    totalPrice: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UserType {
    recycler = "recycler",
    company = "company",
    individual = "individual"
}
export enum Variant_pending_completed_confirmed {
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum Variant_pending_sold_available {
    pending = "pending",
    sold = "sold",
    available = "available"
}
export interface backendInterface {
    addProduct(product: EProductInput): Promise<string>;
    addToBasket(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    callersBasketQuantity(caller: Principal, productId: string): Promise<bigint | null>;
    createTransaction(productId: string, quantity: bigint): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(): Promise<Array<EProduct>>;
    getAllRecyclerPrices(): Promise<Array<RecyclerPrice>>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    getCSRMetrics(): Promise<CSRMetrics>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyRecyclerTransactions(): Promise<Array<Transaction>>;
    getMySellerTransactions(): Promise<Array<Transaction>>;
    getMyTransactions(): Promise<Array<Transaction>>;
    getProduct(productId: string): Promise<EProduct>;
    getProductsByStatus(status: Variant_pending_sold_available): Promise<Array<EProduct>>;
    getRecyclerPrices(category: string): Promise<Array<RecyclerPrice>>;
    getTransaction(transactionId: string): Promise<Transaction>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromBasket(productId: string): Promise<void>;
    revokeRecyclerVerification(recyclerPrincipal: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setRecyclerPrice(category: string, pricePerUnit: bigint): Promise<void>;
    updateProduct(product: EProductUpdate): Promise<void>;
    updateTransactionStatus(transactionId: string, newStatus: Variant_pending_completed_confirmed): Promise<void>;
    verifyRecycler(recyclerPrincipal: Principal): Promise<void>;
    viewBasket(): Promise<Array<[string, [EProduct, bigint]]>>;
}
