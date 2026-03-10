import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, Package, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  type UserProfile,
  Variant_pending_completed_confirmed,
} from "../../backend";
import {
  useGetAllProducts,
  useGetAllUsers,
  useGetMyTransactions,
  useUpdateTransactionStatus,
} from "../../hooks/useQueries";
import PickupMapTracker from "./PickupMapTracker";

interface TransactionsTabProps {
  userProfile: UserProfile;
}

const STEPS = [
  {
    id: "pending",
    label: "Pending",
    icon: Clock,
    description: "Awaiting confirmation",
  },
  {
    id: "confirmed",
    label: "Confirmed",
    icon: CheckCircle,
    description: "Accepted by recycler",
  },
  {
    id: "pickup",
    label: "Pickup",
    icon: Truck,
    description: "Collection in progress",
  },
  {
    id: "completed",
    label: "Completed",
    icon: Star,
    description: "Transaction done",
  },
] as const;

function getStepIndex(status: string): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "completed":
      return 3;
    default:
      return 0;
  }
}

interface StepTrackerProps {
  status: string;
}

function StepTracker({ status }: StepTrackerProps) {
  const currentStep = getStepIndex(status);

  return (
    <div className="w-full py-2">
      <div className="flex items-start justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          // Handle simulated "pickup" step for confirmed status
          const isPickupSimulated =
            step.id === "pickup" && status === "confirmed";

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center gap-1.5 flex-1"
            >
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : isCurrent
                      ? "bg-primary/10 border-primary text-primary shadow-sm scale-110"
                      : isPickupSimulated
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-background border-border text-muted-foreground"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isCurrent ? "animate-pulse" : ""}`}
                />
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-muted-foreground hidden sm:block leading-tight mt-0.5">
                  {step.description}
                </p>
              </div>
              {isPending && !isPickupSimulated && (
                <div className="absolute -inset-0.5 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TransactionsTab({ userProfile }: TransactionsTabProps) {
  const { data: transactions = [] } = useGetMyTransactions();
  const { data: allProducts = [] } = useGetAllProducts();
  const { data: allUsers = [] } = useGetAllUsers();
  const updateStatus = useUpdateTransactionStatus();

  const getProductTitle = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    return product?.title || "Unknown Product";
  };

  const getProductCategory = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    return product?.category || "";
  };

  const getUserName = (principal: any) => {
    const user = allUsers.find((u) => u.id.toString() === principal.toString());
    return user?.name || "Unknown User";
  };

  const handleUpdateStatus = async (
    transactionId: string,
    newStatus: Variant_pending_completed_confirmed,
  ) => {
    try {
      await updateStatus.mutateAsync({ transactionId, newStatus });
      toast.success("Transaction status updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/20"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="default" className="gap-1 bg-blue-600">
            <CheckCircle className="h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="gap-1 bg-primary/10 text-primary border-primary/20"
          >
            <Star className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatTimestamp = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-display">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage your transaction history
        </p>
      </div>

      {transactions.length === 0 ? (
        <Card data-ocid="transactions.empty_state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
            <p className="text-muted-foreground text-center text-sm">
              Your transaction history will appear here once you start buying or
              selling e-waste
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
            </p>
          </div>

          {transactions.map((transaction, index) => (
            <Card
              key={transaction.id}
              data-ocid={`transactions.item.${index + 1}`}
              className="overflow-hidden border-2 hover:border-primary/30 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate font-display">
                      {getProductTitle(transaction.productId)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono">
                        #{transaction.id.substring(0, 8)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getProductCategory(transaction.productId)}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Transaction details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {userProfile.userType === "recycler"
                        ? "Seller"
                        : "Recycler"}
                    </p>
                    <p className="font-medium truncate">
                      {userProfile.userType === "recycler"
                        ? getUserName(transaction.seller)
                        : getUserName(transaction.recycler)}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Quantity
                    </p>
                    <p className="font-medium">
                      {transaction.quantity.toString()} units
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Total Price
                    </p>
                    <p className="font-semibold text-primary">
                      ${transaction.totalPrice.toString()}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2.5">
                    <p className="text-xs text-muted-foreground mb-0.5">Date</p>
                    <p className="font-medium">
                      {formatTimestamp(transaction.timestamp)}
                    </p>
                  </div>
                </div>

                {/* Visual step tracker */}
                <div className="border rounded-xl p-3 bg-muted/20">
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                    Order Progress
                  </p>
                  <StepTracker status={transaction.status} />
                </div>

                {/* Pickup map tracker for confirmed/completed */}
                {(transaction.status === "confirmed" ||
                  transaction.status === "completed") && (
                  <PickupMapTracker status={transaction.status} />
                )}

                {/* Action buttons */}
                <div className="flex gap-2 justify-end pt-1">
                  {transaction.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`transactions.confirm_button.${index + 1}`}
                      onClick={() =>
                        handleUpdateStatus(
                          transaction.id,
                          Variant_pending_completed_confirmed.confirmed,
                        )
                      }
                      disabled={updateStatus.isPending}
                      className="gap-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Confirm Transaction
                    </Button>
                  )}
                  {transaction.status === "confirmed" && (
                    <Button
                      size="sm"
                      data-ocid={`transactions.primary_button.${index + 1}`}
                      onClick={() =>
                        handleUpdateStatus(
                          transaction.id,
                          Variant_pending_completed_confirmed.completed,
                        )
                      }
                      disabled={updateStatus.isPending}
                      className="gap-1.5"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Mark Completed
                    </Button>
                  )}
                  {transaction.status === "completed" && (
                    <span className="text-sm text-primary font-medium flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Transaction Complete
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
