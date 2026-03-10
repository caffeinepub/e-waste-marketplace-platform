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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  CreditCard,
  Lock,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { SiMastercard, SiVisa } from "react-icons/si";
import { toast } from "sonner";
import {
  useCreateTransaction,
  useRemoveFromBasket,
  useViewBasket,
} from "../../hooks/useQueries";

interface StripeFormData {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface StripeCheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  amount: number;
  productId: string;
  quantity: bigint;
  onSuccess: () => void;
}

function StripeCheckoutDialog({
  open,
  onClose,
  productTitle,
  amount,
  productId,
  quantity,
  onSuccess,
}: StripeCheckoutDialogProps) {
  const createTransaction = useCreateTransaction();
  const [formData, setFormData] = useState<StripeFormData>({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .slice(0, 5);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.cardNumber ||
      !formData.expiry ||
      !formData.cvv
    ) {
      toast.error("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    // Simulate Stripe processing
    await new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      await createTransaction.mutateAsync({ productId, quantity });
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        toast.success(
          "Payment initiated — you'll receive a confirmation shortly",
          {
            duration: 5000,
          },
        );
        setSuccess(false);
        setFormData({ name: "", cardNumber: "", expiry: "", cvv: "" });
        onSuccess();
        onClose();
      }, 1500);
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || "Payment failed. Please try again.");
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setFormData({ name: "", cardNumber: "", expiry: "", cvv: "" });
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-ocid="basket.dialog">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Stripe Payment
          </DialogTitle>
          <DialogDescription>
            Secure checkout for your e-waste transaction
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center" data-ocid="basket.success_state">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="font-display text-lg font-bold text-primary mb-1">
              Payment Successful!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your transaction has been initiated. You'll receive confirmation
              shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Summary */}
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Paying for</span>
                <span className="font-medium truncate max-w-[180px]">
                  {productTitle}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">Amount</span>
                <span className="font-bold text-primary text-lg">
                  ${amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Card brand icons */}
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Secured by Stripe
              </span>
              <div className="ml-auto flex gap-1.5">
                <SiVisa className="h-6 w-8 text-blue-700" />
                <SiMastercard className="h-6 w-8 text-red-600" />
              </div>
            </div>

            <Separator />

            {/* Cardholder Name */}
            <div className="space-y-1.5">
              <Label htmlFor="card-name">Cardholder Name</Label>
              <Input
                id="card-name"
                data-ocid="basket.input"
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isProcessing}
                required
              />
            </div>

            {/* Card Number */}
            <div className="space-y-1.5">
              <Label htmlFor="card-number">Card Number</Label>
              <div className="relative">
                <Input
                  id="card-number"
                  data-ocid="basket.input"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  disabled={isProcessing}
                  maxLength={19}
                  required
                  className="pr-10"
                />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiry: formatExpiry(e.target.value),
                    })
                  }
                  disabled={isProcessing}
                  maxLength={5}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  disabled={isProcessing}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                data-ocid="basket.cancel_button"
                onClick={handleClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-ocid="basket.confirm_button"
                disabled={isProcessing}
                className="flex-1 gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Pay ${amount.toLocaleString()}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function BasketTab() {
  const { data: basket = [] } = useViewBasket();
  const removeFromBasket = useRemoveFromBasket();

  const [checkoutItem, setCheckoutItem] = useState<{
    productId: string;
    productTitle: string;
    amount: number;
    quantity: bigint;
  } | null>(null);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromBasket.mutateAsync(productId);
      toast.success("Item removed from basket");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove item");
    }
  };

  const handleOpenCheckout = (
    productId: string,
    productTitle: string,
    amount: number,
    quantity: bigint,
  ) => {
    setCheckoutItem({ productId, productTitle, amount, quantity });
  };

  const totalValue = basket.reduce((sum, [_, [product, quantity]]) => {
    return sum + Number(product.price) * Number(quantity);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Shopping Basket</h2>
          <p className="text-muted-foreground">
            Items you're interested in purchasing
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold font-display text-primary">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {basket.length === 0 ? (
        <Card data-ocid="basket.empty_state">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Your basket is empty</h3>
            <p className="text-muted-foreground text-center text-sm">
              Browse available products and add items to your basket
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-display">Basket Items</CardTitle>
            <CardDescription>
              {basket.length} item(s) in your basket
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mobile-friendly cards view */}
            <div className="block md:hidden space-y-3">
              {basket.map(([productId, [product, quantity]], index) => {
                const total = Number(product.price) * Number(quantity);
                return (
                  <div
                    key={productId}
                    data-ocid={`basket.item.${index + 1}`}
                    className="rounded-xl border p-3 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">{product.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {product.condition}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        data-ocid={`basket.delete_button.${index + 1}`}
                        onClick={() => handleRemove(productId)}
                        disabled={removeFromBasket.isPending}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center bg-muted/50 rounded p-1.5">
                        <p className="text-xs text-muted-foreground">Qty</p>
                        <p className="font-medium">{quantity.toString()}</p>
                      </div>
                      <div className="text-center bg-muted/50 rounded p-1.5">
                        <p className="text-xs text-muted-foreground">
                          Unit Price
                        </p>
                        <p className="font-medium">
                          ${product.price.toString()}
                        </p>
                      </div>
                      <div className="text-center bg-primary/10 rounded p-1.5">
                        <p className="text-xs text-primary">Total</p>
                        <p className="font-bold text-primary">
                          ${total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full gap-2"
                      data-ocid={`basket.primary_button.${index + 1}`}
                      onClick={() =>
                        handleOpenCheckout(
                          productId,
                          product.title,
                          total,
                          quantity,
                        )
                      }
                    >
                      <CreditCard className="h-4 w-4" />
                      Checkout with Stripe
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {basket.map(([productId, [product, quantity]], index) => {
                    const total = Number(product.price) * Number(quantity);
                    return (
                      <TableRow
                        key={productId}
                        data-ocid={`basket.item.${index + 1}`}
                      >
                        <TableCell className="font-medium">
                          {product.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{product.condition}</TableCell>
                        <TableCell className="text-right">
                          {quantity.toString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${product.price.toString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ${total.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              data-ocid={`basket.primary_button.${index + 1}`}
                              onClick={() =>
                                handleOpenCheckout(
                                  productId,
                                  product.title,
                                  total,
                                  quantity,
                                )
                              }
                              className="gap-1.5"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              Checkout
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              data-ocid={`basket.delete_button.${index + 1}`}
                              onClick={() => handleRemove(productId)}
                              disabled={removeFromBasket.isPending}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Order summary footer */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {basket.length} item{basket.length !== 1 ? "s" : ""} in
                    basket
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Lock className="h-3 w-3" />
                    Secure checkout powered by Stripe
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Basket Total</p>
                  <p className="text-2xl font-bold font-display text-primary">
                    ${totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stripe Checkout Dialog */}
      {checkoutItem && (
        <StripeCheckoutDialog
          open={!!checkoutItem}
          onClose={() => setCheckoutItem(null)}
          productTitle={checkoutItem.productTitle}
          amount={checkoutItem.amount}
          productId={checkoutItem.productId}
          quantity={checkoutItem.quantity}
          onSuccess={() => setCheckoutItem(null)}
        />
      )}
    </div>
  );
}
