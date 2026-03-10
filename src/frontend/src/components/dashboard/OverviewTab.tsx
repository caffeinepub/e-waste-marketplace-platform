import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Package, Recycle, TrendingUp } from "lucide-react";
import type { UserProfile } from "../../backend";
import {
  useGetAllProducts,
  useGetCSRMetrics,
  useGetMyTransactions,
} from "../../hooks/useQueries";

interface OverviewTabProps {
  userProfile: UserProfile;
}

export default function OverviewTab({ userProfile }: OverviewTabProps) {
  const { data: allProducts = [] } = useGetAllProducts();
  const { data: transactions = [] } = useGetMyTransactions();
  const { data: csrMetrics } = useGetCSRMetrics();

  const isRecycler = userProfile.userType === "recycler";
  const isCompany = userProfile.userType === "company";

  const myListings = allProducts.filter(
    (p) => p.owner.toString() === userProfile.id.toString(),
  );
  const completedTransactions = transactions.filter(
    (t) => t.status === "completed",
  );

  const totalRevenue = completedTransactions.reduce(
    (sum, t) => sum + Number(t.totalPrice),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {!isRecycler && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Listings
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myListings.length}</div>
              <p className="text-xs text-muted-foreground">
                E-waste items listed
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTransactions.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed sales
            </p>
          </CardContent>
        </Card>

        {isCompany && csrMetrics && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number(csrMetrics.co2Saved)} kg
              </div>
              <p className="text-xs text-muted-foreground">
                Environmental impact
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your marketplace activity summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Pending Transactions
              </span>
              <span className="font-medium">
                {transactions.filter((t) => t.status === "pending").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Confirmed Transactions
              </span>
              <span className="font-medium">
                {transactions.filter((t) => t.status === "confirmed").length}
              </span>
            </div>
            {!isRecycler && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Available Products
                </span>
                <span className="font-medium">
                  {myListings.filter((p) => p.status === "available").length}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Make the most of the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isRecycler && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">List your e-waste</p>
                  <p className="text-xs text-muted-foreground">
                    Add items to start selling
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Compare prices</p>
                <p className="text-xs text-muted-foreground">
                  Find the best recycler rates
                </p>
              </div>
            </div>
            {isRecycler && (
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Set your prices</p>
                  <p className="text-xs text-muted-foreground">
                    Update pricing for categories
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
