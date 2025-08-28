import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Shield,
  Zap,
  Headphones,
  ArrowRight,
  Bitcoin,
  Menu,
  ChevronDown,
} from "lucide-react";

const LandingPage = () => {
  const topCoins = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$65,432.10",
      change: "+2.45%",
      volume: "$28.5B",
      positive: true,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "$3,215.67",
      change: "-1.23%",
      volume: "$15.2B",
      positive: false,
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "$142.89",
      change: "+5.67%",
      volume: "$2.8B",
      positive: true,
    },
    {
      name: "Cardano",
      symbol: "ADA",
      price: "$0.89",
      change: "+1.12%",
      volume: "$1.2B",
      positive: true,
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      price: "$1.23",
      change: "-0.56%",
      volume: "$890M",
      positive: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WebiTrade</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/markets"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Markets
            </Link>
            <Link
              to="#features"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              to="#support"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 smart-animated-bg"></div>

        {/* Matrix grid background */}
        <div className="matrix-grid"></div>

        {/* Neural network orbs */}
        <div className="neural-network">
          <div className="neural-orb neural-orb-1"></div>
          <div className="neural-orb neural-orb-2"></div>
          <div className="neural-orb neural-orb-3"></div>
        </div>

        {/* Data streams */}
        <div className="data-streams">
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
        </div>

        {/* Floating crypto symbols */}
        <div className="crypto-symbols">
          <div className="crypto-symbol">₿</div>
          <div className="crypto-symbol">Ξ</div>
          <div className="crypto-symbol">◎</div>
          <div className="crypto-symbol">₳</div>
          <div className="crypto-symbol">Ð</div>
        </div>

        {/* Pulse rings */}
        <div className="pulse-rings">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
        </div>
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-2">
              🚀 New: Advanced Trading Features
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Trade Bitcoin, Ethereum,
              <span className="text-primary"> and more</span> —
              <span className="text-primary"> instantly</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Secure, fast, and reliable crypto trading platform. Join millions
              of traders who trust us with their digital assets.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/markets">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Explore Markets
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Snapshot */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Market Data</h2>
            <p className="text-muted-foreground">
              Real-time prices for top cryptocurrencies
            </p>
          </div>

          <Card className="bg-card-gradient shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="py-4 px-6 font-medium text-muted-foreground">
                        Coin
                      </th>
                      <th className="py-4 px-6 font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="py-4 px-6 font-medium text-muted-foreground">
                        24h Change
                      </th>
                      <th className="py-4 px-6 font-medium text-muted-foreground">
                        Volume
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCoins.map((coin, index) => (
                      <tr
                        key={index}
                        className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {coin.symbol.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {coin.symbol}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono font-medium">
                          {coin.price}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`font-medium ${
                              coin.positive ? "text-success" : "text-danger"
                            }`}
                          >
                            {coin.change}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          {coin.volume}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose WebiTrade</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for traders, by traders. Experience the future of crypto
              trading.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 bg-card-gradient shadow-md hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-4">Secure & Compliant</CardTitle>
              <CardDescription className="text-base">
                Bank-grade security with regulatory compliance. Your funds are
                protected with cold storage and insurance.
              </CardDescription>
            </Card>

            <Card className="text-center p-8 bg-card-gradient shadow-md hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-4">Lightning Fast</CardTitle>
              <CardDescription className="text-base">
                Advanced matching engine processes millions of orders per second
                with sub-millisecond latency.
              </CardDescription>
            </Card>

            <Card className="text-center p-8 bg-card-gradient shadow-md hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-4">Advanced Trading</CardTitle>
              <CardDescription className="text-base">
                Professional tools including advanced charts, indicators, and
                algorithmic trading options.
              </CardDescription>
            </Card>

            <Card className="text-center p-8 bg-card-gradient shadow-md hover:shadow-glow transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="mb-4">24/7 Support</CardTitle>
              <CardDescription className="text-base">
                Round-the-clock customer support from crypto experts ready to
                help you succeed.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bitcoin className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">WebiTrade</span>
              </div>
              <p className="text-muted-foreground">
                The most trusted cryptocurrency exchange platform for millions
                of users worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Blog</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Terms of Service</div>
                <div>Privacy Policy</div>
                <div>Cookie Policy</div>
                <div>Compliance</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-muted-foreground">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>API Documentation</div>
                <div>Status Page</div>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 WebiTrade. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
