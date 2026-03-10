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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  CheckCircle,
  Download,
  Leaf,
  Package,
  Recycle,
  Share2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { SiLinkedin } from "react-icons/si";
import { toast } from "sonner";
import { useGetCSRMetrics } from "../../hooks/useQueries";

interface MetricGoal {
  label: string;
  value: number;
  goal: number;
  unit: string;
  icon: React.ReactNode;
  description: string;
}

export default function CSRTab() {
  const { data: metrics, isLoading } = useGetCSRMetrics();
  const [certDialogOpen, setCertDialogOpen] = useState(false);

  const today = new Date();
  const certDate = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handleLinkedInShare = () => {
    const co2Saved = metrics ? Number(metrics.co2Saved) : 0;
    const itemsSold = metrics ? Number(metrics.totalItemsSold) : 0;
    const text = encodeURIComponent(
      `🌱 Proud to share our e-waste sustainability milestones!\n\n✅ ${itemsSold} electronics responsibly recycled\n🌿 ${co2Saved} kg CO₂ emissions prevented\n\nAll through VEXO — India's licensed e-waste marketplace. Together we're building a greener future. #CSR #Sustainability #EWaste #VEXO`,
    );
    const url = encodeURIComponent("https://vexo.app");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      "_blank",
    );
  };

  const handleDownloadCert = () => {
    toast.success("Certificate downloaded successfully!");
    setCertDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-12"
        data-ocid="csr.loading_state"
      >
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading CSR metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card data-ocid="csr.empty_state">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <TrendingUp className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No CSR data available</h3>
          <p className="text-muted-foreground text-center text-sm">
            Complete transactions to see your environmental impact
          </p>
        </CardContent>
      </Card>
    );
  }

  const metricGoals: MetricGoal[] = [
    {
      label: "Items Recycled",
      value: Number(metrics.totalItemsSold),
      goal: 1000,
      unit: "items",
      icon: <Package className="h-4 w-4" />,
      description: "Contributing to circular economy",
    },
    {
      label: "Revenue Generated",
      value: Number(metrics.totalRevenue),
      goal: 100000,
      unit: "$",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Value unlocked from e-waste",
    },
    {
      label: "CO₂ Saved",
      value: Number(metrics.co2Saved),
      goal: 5000,
      unit: "kg",
      icon: <Leaf className="h-4 w-4" />,
      description: "Carbon emissions prevented",
    },
    {
      label: "Materials Recovered",
      value: Number(metrics.materialsRecycled),
      goal: 2000,
      unit: "kg",
      icon: <Recycle className="h-4 w-4" />,
      description: "Valuable resources recovered",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold font-display">
            CSR Impact Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your company's environmental contribution
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            data-ocid="csr.secondary_button"
            onClick={handleLinkedInShare}
            className="gap-2"
          >
            <SiLinkedin className="h-4 w-4 text-[#0A66C2]" />
            Share on LinkedIn
          </Button>
          <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                data-ocid="csr.open_modal_button"
                className="gap-2"
              >
                <Award className="h-4 w-4" />
                Get Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" data-ocid="csr.dialog">
              <DialogHeader>
                <DialogTitle className="font-display">
                  CSR Certificate
                </DialogTitle>
              </DialogHeader>
              {/* Certificate design */}
              <div className="relative border-4 border-primary/30 rounded-2xl p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 text-center overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-lg" />

                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-primary/10 p-3 border-2 border-primary/20">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="mb-3 border-primary/30 text-primary px-3"
                >
                  Official Certificate of Recognition
                </Badge>

                <div className="mb-2">
                  <img
                    src="/assets/IMG-20251230-WA0012.jpg"
                    alt="VEXO"
                    className="h-10 w-10 mx-auto rounded-lg object-contain"
                  />
                  <p className="font-display font-bold text-primary text-lg">
                    VEXO
                  </p>
                </div>

                <h3 className="font-display text-xl font-bold mb-1">
                  Certificate of Sustainability
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  This certifies that the organization has demonstrated
                  outstanding commitment to responsible e-waste management and
                  environmental sustainability.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4 text-left">
                  {[
                    {
                      label: "Items Recycled",
                      value: `${Number(metrics.totalItemsSold).toLocaleString()} units`,
                    },
                    {
                      label: "CO₂ Prevented",
                      value: `${Number(metrics.co2Saved).toLocaleString()} kg`,
                    },
                    {
                      label: "Materials Recovered",
                      value: `${Number(metrics.materialsRecycled).toLocaleString()} kg`,
                    },
                    {
                      label: "Revenue Unlocked",
                      value: `$${Number(metrics.totalRevenue).toLocaleString()}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-primary/5 rounded-lg p-2"
                    >
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="font-semibold text-sm font-display">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  Issued by VEXO on {certDate}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  data-ocid="csr.cancel_button"
                  onClick={() => setCertDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 gap-2"
                  data-ocid="csr.confirm_button"
                  onClick={handleDownloadCert}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Items Recycled
            </CardTitle>
            <div className="rounded-full bg-primary/10 p-1.5">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              {Number(metrics.totalItemsSold).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total e-waste items</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="rounded-full bg-primary/10 p-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              ${Number(metrics.totalRevenue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From completed sales
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
            <div className="rounded-full bg-primary/10 p-1.5">
              <Leaf className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              {Number(metrics.co2Saved).toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Carbon emissions prevented
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Materials Recycled
            </CardTitle>
            <div className="rounded-full bg-primary/10 p-1.5">
              <Recycle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">
              {Number(metrics.materialsRecycled).toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Total materials recovered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sustainability Progress */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="font-display">
            Sustainability Progress
          </CardTitle>
          <CardDescription>
            Track your contribution toward annual sustainability goals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {metricGoals.map((metric) => {
            const percentage = Math.min(
              (metric.value / metric.goal) * 100,
              100,
            );
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1 text-primary">
                      {metric.icon}
                    </div>
                    <div>
                      <span className="font-medium">{metric.label}</span>
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-primary">
                      {metric.unit === "$" ? "$" : ""}
                      {metric.value.toLocaleString()}
                      {metric.unit !== "$" ? ` ${metric.unit}` : ""}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      of {metric.unit === "$" ? "$" : ""}
                      {metric.goal.toLocaleString()}
                      {metric.unit !== "$" ? ` ${metric.unit}` : ""} goal
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={percentage} className="h-2.5" />
                  <span className="absolute right-0 -top-5 text-xs text-muted-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display">Environmental Impact</CardTitle>
            <CardDescription>
              Your contribution to sustainability per item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">CO₂ per item</span>
                <span className="font-semibold">
                  {Number(metrics.totalItemsSold) > 0
                    ? (
                        Number(metrics.co2Saved) /
                        Number(metrics.totalItemsSold)
                      ).toFixed(2)
                    : 0}{" "}
                  kg
                </span>
              </div>
              <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">
                  Materials per item
                </span>
                <span className="font-semibold">
                  {Number(metrics.totalItemsSold) > 0
                    ? (
                        Number(metrics.materialsRecycled) /
                        Number(metrics.totalItemsSold)
                      ).toFixed(2)
                    : 0}{" "}
                  kg
                </span>
              </div>
              <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 text-sm">
                <span className="text-muted-foreground">Revenue per item</span>
                <span className="font-semibold">
                  $
                  {Number(metrics.totalItemsSold) > 0
                    ? (
                        Number(metrics.totalRevenue) /
                        Number(metrics.totalItemsSold)
                      ).toFixed(2)
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-display">CSR Highlights</CardTitle>
            <CardDescription>Key sustainability achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                icon: <Recycle className="h-4 w-4 text-primary" />,
                title: "Circular Economy Champion",
                desc: "Contributing to sustainable e-waste management cycles",
              },
              {
                icon: <Leaf className="h-4 w-4 text-primary" />,
                title: "Carbon Reduction Leader",
                desc: "Actively preventing greenhouse gas emissions",
              },
              {
                icon: <Package className="h-4 w-4 text-primary" />,
                title: "Resource Recovery Pioneer",
                desc: "Recovering valuable materials for industrial reuse",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/10 p-3"
              >
                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Share CTA banner */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold">
                Share Your Impact
              </h3>
              <p className="text-sm text-muted-foreground">
                Let your network know about your commitment to sustainable
                e-waste management
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                data-ocid="csr.secondary_button"
                onClick={handleLinkedInShare}
                className="gap-2"
              >
                <SiLinkedin className="h-4 w-4 text-[#0A66C2]" />
                Share on LinkedIn
              </Button>
              <Button
                variant="outline"
                data-ocid="csr.secondary_button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `I've recycled ${Number(metrics.totalItemsSold)} items and saved ${Number(metrics.co2Saved)} kg CO₂ with VEXO! 🌱`,
                  );
                  toast.success("Impact summary copied to clipboard!");
                }}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Copy Summary
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
