import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Award, MapPin, Navigation, Star, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  useGetAllRecyclerPrices,
  useGetAllUsers,
} from "../../hooks/useQueries";

const CATEGORIES = [
  "All Categories",
  "📱 Smartphones & Tablets",
  "💻 Laptops & Computers",
  "📺 TVs & Monitors",
  "🔋 Batteries",
  "🏠 Home Appliances",
  "🖨️ Printers & Scanners",
  "📷 Cameras & Photography",
  "🎮 Gaming Consoles",
  "🎵 Audio Equipment",
  "🔌 Cables & Accessories",
  "⚙️ Other Electronics",
];

interface NearbyCentre {
  name: string;
  distance: string;
  rating: number;
  reviews: number;
  categories: string[];
  address: string;
  certified: boolean;
}

const NEARBY_CENTRES: NearbyCentre[] = [
  {
    name: "GreenCycle Solutions",
    distance: "2.3 km",
    rating: 4.8,
    reviews: 342,
    categories: ["Smartphones", "Laptops", "Tablets"],
    address: "Sector 18, Noida",
    certified: true,
  },
  {
    name: "EcoTech Recyclers",
    distance: "3.7 km",
    rating: 4.6,
    reviews: 219,
    categories: ["TVs & Monitors", "Home Appliances", "Batteries"],
    address: "Connaught Place, New Delhi",
    certified: true,
  },
  {
    name: "Renu E-Waste Hub",
    distance: "4.1 km",
    rating: 4.4,
    reviews: 156,
    categories: ["Cables & Accessories", "Printers", "Gaming Consoles"],
    address: "Lajpat Nagar, New Delhi",
    certified: true,
  },
  {
    name: "TerraRecycle India",
    distance: "5.5 km",
    rating: 4.9,
    reviews: 511,
    categories: ["All Categories"],
    address: "Saket, New Delhi",
    certified: true,
  },
  {
    name: "CleanTech Disposal",
    distance: "6.8 km",
    rating: 4.3,
    reviews: 88,
    categories: ["Batteries", "Audio Equipment", "Cameras"],
    address: "Dwarka, New Delhi",
    certified: false,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {(["1", "2", "3", "4", "5"] as const).map((starKey, i) => (
        <Star
          key={starKey}
          className={`h-3 w-3 ${
            i < Math.floor(rating)
              ? "text-amber-400 fill-amber-400"
              : i < rating
                ? "text-amber-400 fill-amber-200"
                : "text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

export default function PriceComparisonTab() {
  const { data: allPrices = [] } = useGetAllRecyclerPrices();
  const { data: allUsers = [] } = useGetAllUsers();
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredPrices =
    selectedCategory === "All Categories"
      ? allPrices
      : allPrices.filter((p) => {
          // Strip emoji prefix for comparison
          const cleanCategory = selectedCategory.replace(/^[^\s]+ /, "");
          return (
            p.category === cleanCategory || p.category === selectedCategory
          );
        });

  const getRecyclerName = (recyclerPrincipal: any) => {
    const user = allUsers.find(
      (u) => u.id.toString() === recyclerPrincipal.toString(),
    );
    return user?.name || "Unknown Recycler";
  };

  const getRecyclerVerified = (recyclerPrincipal: any) => {
    const user = allUsers.find(
      (u) => u.id.toString() === recyclerPrincipal.toString(),
    );
    return user?.isVerified || false;
  };

  // Group prices by category
  const pricesByCategory = filteredPrices.reduce(
    (acc, price) => {
      if (!acc[price.category]) {
        acc[price.category] = [];
      }
      acc[price.category].push(price);
      return acc;
    },
    {} as Record<string, typeof allPrices>,
  );

  return (
    <div className="space-y-6">
      {/* Nearby Centres Card */}
      <Card className="border-2 border-primary/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">
                Nearby Recycling Centres
              </CardTitle>
              <CardDescription>
                Licensed centres near your location
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NEARBY_CENTRES.map((centre, index) => (
              <div
                key={centre.name}
                data-ocid={`centres.item.${index + 1}`}
                className="rounded-xl border border-border bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {centre.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {centre.address}
                    </p>
                  </div>
                  {centre.certified && (
                    <Badge
                      variant="default"
                      className="text-[10px] px-1.5 py-0.5 gap-0.5 shrink-0"
                    >
                      <Award className="h-2.5 w-2.5" />
                      Licensed
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <StarRating rating={centre.rating} />
                  <span className="text-xs text-muted-foreground">
                    ({centre.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span className="font-medium text-foreground">
                      {centre.distance}
                    </span>
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {centre.categories.slice(0, 2).map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {cat}
                      </Badge>
                    ))}
                    {centre.categories.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        +{centre.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Comparison Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Price Comparison</h2>
          <p className="text-muted-foreground">
            Compare recycler prices across categories
          </p>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[220px]" data-ocid="price.select">
            <SelectValue />
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

      {filteredPrices.length === 0 ? (
        <Card data-ocid="price.empty_state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <TrendingUp className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No prices available</h3>
            <p className="text-muted-foreground text-center text-sm">
              No recyclers have set prices for this category yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(pricesByCategory).map(([category, prices]) => {
            const sortedPrices = [...prices].sort(
              (a, b) => Number(b.pricePerUnit) - Number(a.pricePerUnit),
            );

            return (
              <Card key={category} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display">{category}</CardTitle>
                  <CardDescription>
                    {prices.length} recycler{prices.length !== 1 ? "s" : ""}{" "}
                    offering prices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recycler</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">
                          Price per Unit
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPrices.map((price, index) => (
                        <TableRow
                          key={`${price.recycler.toString()}-${price.category}`}
                          className={index === 0 ? "bg-primary/3" : ""}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getRecyclerName(price.recycler)}
                              {index === 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 text-primary border-primary/30"
                                >
                                  Best Price
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRecyclerVerified(price.recycler) ? (
                              <Badge variant="default" className="gap-1">
                                <Award className="h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Unverified</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`font-semibold ${index === 0 ? "text-primary text-base" : ""}`}
                            >
                              ${price.pricePerUnit.toString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
