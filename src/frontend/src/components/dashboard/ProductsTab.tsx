import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Package, Plus, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type EProductInput,
  ExternalBlob,
  type UserProfile,
} from "../../backend";
import {
  useAddProduct,
  useDeleteProduct,
  useGetAllProducts,
  useUpdateProduct,
} from "../../hooks/useQueries";

interface ProductsTabProps {
  userProfile: UserProfile;
}

const CATEGORIES = [
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

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor", "Not Working"];

export default function ProductsTab({ userProfile }: ProductsTabProps) {
  const { data: allProducts = [] } = useGetAllProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    quantity: "1",
    price: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});

  const myProducts = allProducts.filter(
    (p) => p.owner.toString() === userProfile.id.toString(),
  );

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      condition: "",
      quantity: "1",
      price: "",
    });
    setImageFiles([]);
    setUploadProgress({});
    setEditingProduct(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.condition ||
      !formData.price
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const productInput: EProductInput = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        quantity: BigInt(formData.quantity),
        price: BigInt(formData.price),
      };

      if (editingProduct) {
        const photoBlobs: ExternalBlob[] = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const arrayBuffer = await file.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
            (percentage) => {
              setUploadProgress((prev) => ({ ...prev, [i]: percentage }));
            },
          );
          photoBlobs.push(blob);
        }

        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...productInput,
          photos: photoBlobs.length > 0 ? photoBlobs : editingProduct.photos,
        });
        toast.success("Product updated successfully!");
      } else {
        const productId = await addProduct.mutateAsync(productInput);

        if (imageFiles.length > 0) {
          const photoBlobs: ExternalBlob[] = [];
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
              (percentage) => {
                setUploadProgress((prev) => ({ ...prev, [i]: percentage }));
              },
            );
            photoBlobs.push(blob);
          }

          await updateProduct.mutateAsync({
            id: productId,
            ...productInput,
            photos: photoBlobs,
          });
        }

        toast.success("Product added successfully!");
      }

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      category: product.category,
      condition: product.condition,
      quantity: product.quantity.toString(),
      price: product.price.toString(),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-primary/10 text-primary border-primary/20";
      case "sold":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">My Listings</h2>
          <p className="text-muted-foreground">Manage your e-waste products</p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button data-ocid="products.open_modal_button">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl max-h-[90vh] overflow-y-auto"
            data-ocid="products.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update your product details"
                  : "List a new e-waste item for sale"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  data-ocid="products.input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., iPhone 12 Pro"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger data-ocid="products.select">
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
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData({ ...formData, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITIONS.map((cond) => (
                        <SelectItem key={cond} value={cond}>
                          {cond}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    data-ocid="products.input"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-ocid="products.textarea"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the item condition, specifications, etc."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  data-ocid="products.upload_button"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  Upload up to 5 images (optional)
                </p>
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="space-y-1">
                    {Object.entries(uploadProgress).map(([index, progress]) => (
                      <div
                        key={index}
                        className="text-xs text-muted-foreground"
                      >
                        Image {Number(index) + 1}: {progress}%
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="products.cancel_button"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="products.submit_button"
                  disabled={addProduct.isPending || updateProduct.isPending}
                >
                  {addProduct.isPending || updateProduct.isPending
                    ? "Saving..."
                    : editingProduct
                      ? "Update"
                      : "Add Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {myProducts.length === 0 ? (
        <Card data-ocid="products.empty_state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground text-center mb-4 text-sm">
              Start by adding your first e-waste item
            </p>
            <Button
              data-ocid="products.primary_button"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((product, index) => (
            <Card
              key={product.id}
              data-ocid={`products.item.${index + 1}`}
              className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <CardTitle className="text-base font-display leading-snug">
                      {product.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {product.category}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs shrink-0 ${getStatusColor(product.status)}`}
                  >
                    {product.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.photos.length > 0 && (
                  <img
                    src={product.photos[0].getDirectURL()}
                    alt={product.title}
                    className="w-full h-36 object-cover rounded-lg"
                  />
                )}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="font-medium">{product.condition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-medium">
                      {product.quantity.toString()} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed Price:</span>
                    <span className="font-semibold text-primary">
                      ${product.price.toString()}
                    </span>
                  </div>
                </div>
                {product.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Pickup info card */}
                {product.status === "available" && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2">
                    <Truck className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-primary">
                        Pickup Available
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Schedule collection from your location
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`products.edit_button.${index + 1}`}
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    data-ocid={`products.delete_button.${index + 1}`}
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteProduct.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
