import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { UserProfile } from "../backend";
import AdminTab from "../components/dashboard/AdminTab";
import BasketTab from "../components/dashboard/BasketTab";
import CSRTab from "../components/dashboard/CSRTab";
import OverviewTab from "../components/dashboard/OverviewTab";
import PriceComparisonTab from "../components/dashboard/PriceComparisonTab";
import ProductsTab from "../components/dashboard/ProductsTab";
import RecyclerPricingTab from "../components/dashboard/RecyclerPricingTab";
import TransactionsTab from "../components/dashboard/TransactionsTab";
import { useIsCallerAdmin } from "../hooks/useQueries";

interface DashboardProps {
  userProfile: UserProfile;
}

export default function Dashboard({ userProfile }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: isAdmin } = useIsCallerAdmin();

  const isRecycler = userProfile.userType === "recycler";
  const isCompany = userProfile.userType === "company";
  const _isIndividual = userProfile.userType === "individual";

  return (
    <main className="flex-1 py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userProfile.name}
            {userProfile.isVerified && " ✓"}
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>

            {!isRecycler && (
              <TabsTrigger value="products" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">My Listings</span>
              </TabsTrigger>
            )}

            <TabsTrigger value="prices" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Prices</span>
            </TabsTrigger>

            {isRecycler && (
              <>
                <TabsTrigger value="basket" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Basket</span>
                </TabsTrigger>
                <TabsTrigger value="pricing" className="gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">My Pricing</span>
                </TabsTrigger>
              </>
            )}

            <TabsTrigger value="transactions" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>

            {isCompany && (
              <TabsTrigger value="csr" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">CSR Impact</span>
              </TabsTrigger>
            )}

            {isAdmin && (
              <TabsTrigger value="admin" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab userProfile={userProfile} />
          </TabsContent>

          {!isRecycler && (
            <TabsContent value="products">
              <ProductsTab userProfile={userProfile} />
            </TabsContent>
          )}

          <TabsContent value="prices">
            <PriceComparisonTab />
          </TabsContent>

          {isRecycler && (
            <>
              <TabsContent value="basket">
                <BasketTab />
              </TabsContent>
              <TabsContent value="pricing">
                <RecyclerPricingTab />
              </TabsContent>
            </>
          )}

          <TabsContent value="transactions">
            <TransactionsTab userProfile={userProfile} />
          </TabsContent>

          {isCompany && (
            <TabsContent value="csr">
              <CSRTab />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="admin">
              <AdminTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
}
