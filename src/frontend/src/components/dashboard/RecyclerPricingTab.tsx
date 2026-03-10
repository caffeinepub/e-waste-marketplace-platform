import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useGetAllRecyclerPrices,
  useSetRecyclerPrice,
} from "../../hooks/useQueries";

const CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Desktop Computers",
  "Monitors",
  "Printers",
  "Keyboards & Mice",
  "Cables & Accessories",
  "Other Electronics",
];

export default function RecyclerPricingTab() {
  const { identity } = useInternetIdentity();
  const { data: allPrices = [] } = useGetAllRecyclerPrices();
  const setPrice = useSetRecyclerPrice();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceValue, setPriceValue] = useState("");

  const myPrices = allPrices.filter(
    (p) =>
      identity && p.recycler.toString() === identity.getPrincipal().toString(),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !priceValue) {
      toast.error("Please select a category and enter a price");
      return;
    }

    try {
      await setPrice.mutateAsync({
        category: selectedCategory,
        pricePerUnit: BigInt(priceValue),
      });
      toast.success("Price updated successfully!");
      setSelectedCategory("");
      setPriceValue("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update price");
    }
  };

  const handleEditPrice = (category: string, currentPrice: string) => {
    setSelectedCategory(category);
    setPriceValue(currentPrice);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Pricing</h2>
        <p className="text-muted-foreground">
          Set your buying prices for different e-waste categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Price</CardTitle>
          <CardDescription>
            Set or update your price for a category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price per Unit ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={setPrice.isPending}>
              {setPrice.isPending ? "Updating..." : "Update Price"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Prices</CardTitle>
          <CardDescription>
            Your active pricing for all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myPrices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No prices set yet. Add your first price above.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price per Unit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPrices.map((price) => (
                  <TableRow key={`${price.recycler}-${price.category}`}>
                    <TableCell className="font-medium">
                      {price.category}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${price.pricePerUnit.toString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleEditPrice(
                            price.category,
                            price.pricePerUnit.toString(),
                          )
                        }
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
