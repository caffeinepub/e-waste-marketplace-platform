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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Recycle, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserType } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetup() {
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<
    "individual" | "company" | "recycler"
  >("individual");

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!identity) {
      toast.error("Not authenticated");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        id: identity.getPrincipal(),
        name: name.trim(),
        email: email.trim(),
        userType: UserType[userType],
        isVerified: false,
      });
      toast.success("Profile created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12">
      <div className="container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome to EcoWaste Marketplace
            </CardTitle>
            <CardDescription>
              Please complete your profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Account Type</Label>
                <RadioGroup
                  value={userType}
                  onValueChange={(value: any) => setUserType(value)}
                >
                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label
                      htmlFor="individual"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Individual</div>
                          <div className="text-sm text-muted-foreground">
                            Sell personal e-waste items
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="company" id="company" />
                    <Label htmlFor="company" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Company</div>
                          <div className="text-sm text-muted-foreground">
                            Bulk e-waste sales with CSR tracking
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value="recycler" id="recycler" />
                    <Label htmlFor="recycler" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Recycle className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Licensed Recycler</div>
                          <div className="text-sm text-muted-foreground">
                            Purchase e-waste and set prices
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={saveProfile.isPending}
              >
                {saveProfile.isPending
                  ? "Creating Profile..."
                  : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
