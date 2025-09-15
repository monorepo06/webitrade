import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  BarChart3,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const Markets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("volume");
  const [filterBy, setFilterBy] = useState("all");

  const markets = [
    {
      pair: "BTC/USDT",
      name: "Bitcoin",
      price: "65432.10",
      change: "+2.45%",
      volume: "$2.8B",
      high: "66100.50",
      low: "63890.20",
      positive: true,
      sparkline: [63890, 64200, 64100, 64800, 65200, 65432, 65650, 65432],
    },
    {
      pair: "ETH/USDT",
      name: "Ethereum",
      price: "3215.67",
      change: "-1.23%",
      volume: "$1.5B",
      high: "3289.45",
      low: "3150.30",
      positive: false,
      sparkline: [3289, 3250, 3200, 3180, 3150, 3190, 3220, 3215],
    },
    {
      pair: "SOL/USDT",
      name: "Solana",
      price: "142.89",
      change: "+5.67%",
      volume: "$890M",
      high: "145.20",
      low: "135.40",
      positive: true,
      sparkline: [135.4, 138.2, 140.1, 141.5, 143.2, 144.8, 145.2, 142.89],
    },
    {
      pair: "ADA/USDT",
      name: "Cardano",
      price: "0.89",
      change: "+1.12%",
      volume: "$420M",
      high: "0.92",
      low: "0.87",
      positive: true,
      sparkline: [0.87, 0.88, 0.885, 0.89, 0.91, 0.92, 0.905, 0.89],
    },
    {
      pair: "MATIC/USDT",
      name: "Polygon",
      price: "1.23",
      change: "-0.56%",
      volume: "$320M",
      high: "1.28",
      low: "1.21",
      positive: false,
      sparkline: [1.28, 1.26, 1.24, 1.22, 1.21, 1.225, 1.24, 1.23],
    },
    {
      pair: "DOT/USDT",
      name: "Polkadot",
      price: "8.45",
      change: "+3.21%",
      volume: "$280M",
      high: "8.67",
      low: "8.12",
      positive: true,
      sparkline: [8.12, 8.25, 8.3, 8.4, 8.55, 8.67, 8.5, 8.45],
    },
    {
      pair: "AVAX/USDT",
      name: "Avalanche",
      price: "28.67",
      change: "-2.14%",
      volume: "$245M",
      high: "29.34",
      low: "27.89",
      positive: false,
      sparkline: [29.34, 29.1, 28.85, 28.5, 27.89, 28.2, 28.45, 28.67],
    },
    {
      pair: "LINK/USDT",
      name: "Chainlink",
      price: "15.43",
      change: "+4.56%",
      volume: "$198M",
      high: "15.87",
      low: "14.76",
      positive: true,
      sparkline: [14.76, 15.1, 15.25, 15.45, 15.65, 15.87, 15.6, 15.43],
    },
  ];

  const filteredMarkets = markets.filter(
    (market) =>
      market.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Markets</h1>
          <p className="text-muted-foreground">
            Real-time cryptocurrency market data and trading pairs.
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.45T</div>
              <p className="text-xs text-success">+2.4% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$89.2B</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                BTC Dominance
              </CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42.8%</div>
              <p className="text-xs text-danger">-0.3% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Pairs
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Available for trading
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Trading Pairs</CardTitle>
            <CardDescription>
              Search and filter cryptocurrency trading pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search coin or pair (e.g., BTC/USDT)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="change">24h Change</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="market-cap">Market Cap</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pairs</SelectItem>
                  <SelectItem value="btc">BTC Pairs</SelectItem>
                  <SelectItem value="eth">ETH Pairs</SelectItem>
                  <SelectItem value="usdt">USDT Pairs</SelectItem>
                  <SelectItem value="stablecoins">Stablecoins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Markets Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      Pair
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      Last Price
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      24h Change
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      Chart
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      24h High
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      24h Low
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      24h Volume
                    </th>
                    <th className="py-3 px-4 font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarkets.map((market, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {market.pair.split("/")[0].charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{market.pair}</div>
                            <div className="text-sm text-muted-foreground">
                              {market.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-medium">
                        ${market.price}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={market.positive ? "default" : "destructive"}
                          className="font-medium"
                        >
                          {market.positive ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {market.change}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-20 h-8">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={market.sparkline.map((price, i) => ({
                                price,
                                index: i,
                              }))}
                            >
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke={
                                  market.positive
                                    ? "hsl(var(--success))"
                                    : "hsl(var(--danger))"
                                }
                                strokeWidth={1.5}
                                dot={false}
                                activeDot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-muted-foreground">
                        ${market.high}
                      </td>
                      <td className="py-4 px-4 font-mono text-muted-foreground">
                        ${market.low}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {market.volume}
                      </td>
                      <td className="py-4 px-4">
                        <Link to={`/trading?pair=${market.pair}`}>
                          <Button size="sm">Trade</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Markets;
