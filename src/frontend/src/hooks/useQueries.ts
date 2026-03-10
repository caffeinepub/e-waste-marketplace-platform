import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CSRMetrics,
  EProduct,
  EProductInput,
  EProductUpdate,
  RecyclerPrice,
  Transaction,
  UserProfile,
  UserType,
  Variant_pending_completed_confirmed,
  Variant_pending_sold_available,
} from "../backend";
import { useActor } from "./useActor";

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userPrincipal: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      return actor.getUserProfile(userPrincipal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProductsByStatus(status: Variant_pending_sold_available) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EProduct[]>({
    queryKey: ["products", status],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByStatus(status);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(productId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<EProduct | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor || !productId) return null;
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: EProductInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: EProductUpdate) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// Recycler Price Queries
export function useGetAllRecyclerPrices() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecyclerPrice[]>({
    queryKey: ["recyclerPrices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecyclerPrices();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRecyclerPrices(category: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<RecyclerPrice[]>({
    queryKey: ["recyclerPrices", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecyclerPrices(category);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetRecyclerPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      category,
      pricePerUnit,
    }: { category: string; pricePerUnit: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setRecyclerPrice(category, pricePerUnit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recyclerPrices"] });
    },
  });
}

// Basket Queries
export function useViewBasket() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, [EProduct, bigint]]>>({
    queryKey: ["basket"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.viewBasket();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddToBasket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToBasket(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basket"] });
    },
  });
}

export function useRemoveFromBasket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeFromBasket(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basket"] });
    },
  });
}

// Transaction Queries
export function useGetMyTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ["myTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTransactions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMySellerTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ["mySellerTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMySellerTransactions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyRecyclerTransactions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ["myRecyclerTransactions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecyclerTransactions();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createTransaction(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecyclerTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["basket"] });
    },
  });
}

export function useUpdateTransactionStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      newStatus,
    }: {
      transactionId: string;
      newStatus: Variant_pending_completed_confirmed;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateTransactionStatus(transactionId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["mySellerTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["myRecyclerTransactions"] });
    },
  });
}

// CSR Metrics
export function useGetCSRMetrics() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CSRMetrics>({
    queryKey: ["csrMetrics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCSRMetrics();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Admin Queries
export function useGetAllUsers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useVerifyRecycler() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recyclerPrincipal: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.verifyRecycler(recyclerPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useRevokeRecyclerVerification() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recyclerPrincipal: Principal) => {
      if (!actor) throw new Error("Actor not available");
      return actor.revokeRecyclerVerification(recyclerPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}
