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
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  BarChart3,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const portfolioData = {
    totalValue: 125842.67,
    totalChange: 2.45,
    btcValue: 2.3456,
  };

  const holdings = [
    {
      coin: "Bitcoin",
      symbol: "BTC",
      balance: "2.3456",
      value: "$152,340.50",
      change: "+2.45%",
      positive: true,
    },
    {
      coin: "Ethereum",
      symbol: "ETH",
      balance: "12.8765",
      value: "$41,385.20",
      change: "-1.23%",
      positive: false,
    },
    {
      coin: "Solana",
      symbol: "SOL",
      balance: "245.67",
      value: "$35,098.15",
      change: "+5.67%",
      positive: true,
    },
    {
      coin: "Cardano",
      symbol: "ADA",
      balance: "15,432.10",
      value: "$13,734.47",
      change: "+1.12%",
      positive: true,
    },
    {
      coin: "USDT",
      symbol: "USDT",
      balance: "5,250.00",
      value: "$5,250.00",
      change: "0.00%",
      positive: true,
    },
  ];

  const marketHighlights = [
    { title: "Top Gainer", coin: "SOL", price: "$142.89", change: "+15.67%" },
    { title: "Top Loser", coin: "DOGE", price: "$0.062", change: "-8.45%" },
    { title: "Most Traded", coin: "BTC", volume: "$28.5B", change: "+2.45%" },
  ];

  // Portfolio performance data for the chart
  const portfolioPerformance = [
    { date: "7d ago", value: 118500, change: 0 },
    { date: "6d ago", value: 121200, change: 2.3 },
    { date: "5d ago", value: 119800, change: -1.2 },
    { date: "4d ago", value: 123400, change: 3.0 },
    { date: "3d ago", value: 122100, change: -1.1 },
    { date: "2d ago", value: 124600, change: 2.0 },
    { date: "Yesterday", value: 123200, change: -1.1 },
    { date: "Today", value: 125842.67, change: 2.1 },
  ];

  // Asset allocation data for pie chart
  const assetAllocation = [
    {
      name: "BTC",
      value: 152340.5,
      percentage: 60.8,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "ETH",
      value: 41385.2,
      percentage: 16.5,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "SOL",
      value: 35098.15,
      percentage: 14.0,
      color: "hsl(var(--chart-3))",
    },
    {
      name: "ADA",
      value: 13734.47,
      percentage: 5.5,
      color: "hsl(var(--chart-4))",
    },
    {
      name: "USDT",
      value: 5250.0,
      percentage: 2.1,
      color: "hsl(var(--chart-5))",
    },
    {
      name: "Others",
      value: 3034.25,
      percentage: 1.1,
      color: "hsl(var(--muted))",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your portfolio overview.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ArrowDownRight className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
            <Link to="/trading">
              <Button size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Trade Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Summary with Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 bg-card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Portfolio Performance
                <Badge
                  variant={
                    portfolioData.totalChange >= 0 ? "default" : "destructive"
                  }
                >
                  {portfolioData.totalChange >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {portfolioData.totalChange >= 0 ? "+" : ""}
                  {portfolioData.totalChange}%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold">
                    ${portfolioData.totalValue.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">
                    ≈ {portfolioData.btcValue} BTC
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioPerformance}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(value) =>
                          `$${(value / 1000).toFixed(0)}k`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                          color: "hsl(var(--foreground))",
                        }}
                        formatter={(value) => [
                          `$${Number(value).toLocaleString()}`,
                          "Portfolio Value",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-success/10">
                    <div className="text-2xl font-bold text-success">
                      +$3,124
                    </div>
                    <div className="text-sm text-muted-foreground">24h P&L</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-primary/10">
                    <div className="text-2xl font-bold">$25,680</div>
                    <div className="text-sm text-muted-foreground">
                      Available Balance
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-warning/10">
                    <div className="text-2xl font-bold">$100,162</div>
                    <div className="text-sm text-muted-foreground">
                      In Orders
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Allocation Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Portfolio distribution by asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString()}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {assetAllocation.slice(0, 4).map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: asset.color }}
                      />
                      <span>{asset.name}</span>
                    </div>
                    <span className="font-medium">{asset.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Holdings Table */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>
                Your current cryptocurrency portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-sm">
                          {holding.symbol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{holding.coin}</div>
                        <div className="text-sm text-muted-foreground">
                          {holding.symbol}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-sm">
                        {holding.balance} {holding.symbol}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {holding.value}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          holding.positive ? "text-success" : "text-danger"
                        }`}
                      >
                        {holding.change}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Market Highlights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/wallet" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Manage Wallet
                  </Button>
                </Link>
                <Link to="/trading" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Start Trading
                  </Button>
                </Link>
                <Link to="/history" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Market Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {marketHighlights.map((highlight, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground">
                      {highlight.title}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="font-medium">{highlight.coin}</div>
                      <div className="text-right">
                        <div className="font-mono text-sm">
                          {highlight.price || highlight.volume}
                        </div>
                        <div
                          className={`text-xs ${
                            highlight.change.startsWith("+")
                              ? "text-success"
                              : highlight.change.startsWith("-")
                              ? "text-danger"
                              : "text-muted-foreground"
                          }`}
                        >
                          {highlight.change}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link to="/markets">
                  <Button variant="outline" className="w-full">
                    View All Markets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
