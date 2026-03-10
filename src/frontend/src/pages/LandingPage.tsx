import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BarChart3,
  CheckCircle,
  CreditCard,
  Leaf,
  MapPin,
  Recycle,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LandingPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();

  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    } else {
      try {
        await login();
        navigate({ to: "/dashboard" });
      } catch (error: any) {
        console.error("Login error:", error);
      }
    }
  };

  const handleLearnMore = () => {
    const aboutSection = document.getElementById("how-it-works");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    {
      value: "500+",
      label: "Verified Recyclers",
      icon: <Award className="h-5 w-5" />,
    },
    {
      value: "10,000+",
      label: "Items Recycled",
      icon: <Recycle className="h-5 w-5" />,
    },
    {
      value: "50+",
      label: "Tonnes CO₂ Saved",
      icon: <Leaf className="h-5 w-5" />,
    },
    {
      value: "98%",
      label: "Seller Satisfaction",
      icon: <CheckCircle className="h-5 w-5" />,
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "List Your E-Waste",
      description:
        "Upload photos and details of your electronic waste — from old phones to laptops and industrial equipment.",
      icon: <ShoppingCart className="h-7 w-7" />,
      color: "from-primary/20 to-primary/5",
    },
    {
      step: "02",
      title: "Compare Prices",
      description:
        "See real-time quotes from licensed recyclers near you. Compare by distance, rating, and price per unit.",
      icon: <TrendingUp className="h-7 w-7" />,
      color: "from-accent/20 to-accent/5",
    },
    {
      step: "03",
      title: "Get Paid",
      description:
        "Accept the best offer, schedule a pickup, and receive payment directly. Track every step in real time.",
      icon: <CreditCard className="h-7 w-7" />,
      color: "from-primary/20 to-accent/10",
    },
  ];

  return (
    <main className="flex-1 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/8" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="container relative">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Logo */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-primary/10 blur-xl" />
                <img
                  src="/assets/IMG-20251230-WA0012.jpg"
                  alt="VEXO Logo"
                  className="relative h-36 w-36 object-contain rounded-2xl shadow-lg"
                />
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <Badge
                variant="secondary"
                className="px-4 py-1.5 text-sm font-medium gap-2 border border-primary/20"
              >
                <Leaf className="h-3.5 w-3.5 text-primary" />
                India's #1 Licensed E-Waste Marketplace
              </Badge>
            </motion.div>

            {/* App Name */}
            <motion.h1
              className="mb-4 font-display text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl text-primary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              VEXO
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="mb-4 text-2xl sm:text-3xl font-semibold text-foreground font-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Compare. Sell. Recycle.
            </motion.p>
            <motion.p
              className="mb-10 text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              The Swiggy of e-waste — connecting individuals and companies to
              licensed recyclers for transparent, fair-value transactions and a
              greener planet.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoggingIn}
                data-ocid="hero.primary_button"
                className="px-10 text-lg h-14 font-semibold gap-2 shadow-lg"
              >
                {isLoggingIn ? "Loading..." : "Get Started Free"}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleLearnMore}
                data-ocid="hero.secondary_button"
                className="px-10 text-lg h-14 font-semibold border-2"
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-card">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold font-display text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-b from-background to-secondary/20"
      >
        <div className="container">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary px-3 py-1"
            >
              Simple Process
            </Badge>
            <h2 className="text-4xl font-bold font-display mb-4">
              How VEXO Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Three steps to turn your e-waste into value while helping the
              planet
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-accent/50 to-primary/30" />

            {howItWorks.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="relative overflow-hidden border-2 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-50 group-hover:opacity-70 transition-opacity`}
                  />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary border border-primary/20">
                        {step.icon}
                      </div>
                      <span className="font-display text-5xl font-bold text-primary/15">
                        {step.step}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-display">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display mb-4">
              Why Choose VEXO?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes e-waste management simple, transparent, and
              rewarding
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ShoppingCart className="h-7 w-7 text-primary" />,
                title: "Sell E-Waste",
                desc: "List your electronic waste and connect with verified recyclers offering competitive prices",
              },
              {
                icon: <TrendingUp className="h-7 w-7 text-primary" />,
                title: "Compare Prices",
                desc: "Get the best value by comparing offers from multiple verified recyclers in real-time",
              },
              {
                icon: <MapPin className="h-7 w-7 text-primary" />,
                title: "Track Pickup",
                desc: "Visual real-time tracking of your pickup — just like ordering food delivery",
              },
              {
                icon: <BarChart3 className="h-7 w-7 text-primary" />,
                title: "CSR Reports",
                desc: "Companies get detailed CSR reports and certificates to showcase sustainability",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-md h-full">
                  <CardHeader>
                    <div className="mb-3 inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 border border-primary/15">
                      {feat.icon}
                    </div>
                    <CardTitle className="font-display">{feat.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feat.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold font-display mb-4">
                About VEXO
              </h2>
              <p className="text-xl text-muted-foreground">
                Connecting individuals, companies, and licensed recyclers for
                eco-conscious waste management
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 h-full">
                  <CardHeader>
                    <Users className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="font-display">
                      For Individuals & Companies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Whether you're an individual with old electronics or a
                      company managing bulk e-waste, VEXO provides a seamless
                      platform to list items, compare prices, and ensure
                      transparent, fair-value transactions. Companies unlock
                      detailed CSR reporting to showcase sustainability
                      commitment.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 h-full">
                  <CardHeader>
                    <Recycle className="h-10 w-10 text-primary mb-2" />
                    <CardTitle className="font-display">
                      For Licensed Recyclers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Licensed recyclers gain access to a steady stream of
                      e-waste materials. Set competitive prices, manage incoming
                      listings, and build trust through our verification system.
                      VEXO ensures all partners meet industry standards for safe
                      and compliant processing.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-xl font-display">
                    Transparency & Fair Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    At the heart of VEXO is transparency. Our price comparison
                    tools ensure sellers get the best value for their e-waste,
                    while our verification system guarantees all recyclers meet
                    stringent licensing requirements.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Real-time price comparison across verified recyclers",
                      "Comprehensive environmental impact tracking and CSR metrics",
                      "Secure transactions with licensed, verified recycling partners",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 border-t border-border">
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-bold font-display">
              Ready to Make a Difference?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join VEXO today and start your sustainable e-waste journey.
              Together, we can create a cleaner, greener future.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isLoggingIn}
              data-ocid="cta.primary_button"
              className="px-12 text-lg h-14 font-semibold gap-2 shadow-lg"
            >
              {isLoggingIn
                ? "Loading..."
                : isAuthenticated
                  ? "Go to Dashboard"
                  : "Get Started Now"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
