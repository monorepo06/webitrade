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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Trading = () => {
  const [orderType, setOrderType] = useState("market");
  const [buyAmount, setBuyAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [sellPrice, setSellPrice] = useState("");

  const currentPair = "BTC/USDT";
  const currentPrice = "65,432.10";
  const priceChange = "+2.45%";
  const high24h = "66,100.50";
  const low24h = "63,890.20";
  const volume24h = "$2.8B";

  const orderBook = {
    sells: [
      { price: "65,440.20", amount: "0.1234", total: "8,071.28" },
      { price: "65,438.90", amount: "0.2456", total: "16,069.89" },
      { price: "65,436.50", amount: "0.5678", total: "37,153.95" },
      { price: "65,434.10", amount: "0.8901", total: "58,245.67" },
      { price: "65,432.80", amount: "1.2345", total: "80,789.12" },
    ],
    buys: [
      { price: "65,430.90", amount: "0.9876", total: "64,643.21" },
      { price: "65,428.30", amount: "0.7654", total: "50,076.89" },
      { price: "65,425.80", amount: "0.4321", total: "28,267.45" },
      { price: "65,423.40", amount: "0.2109", total: "13,799.34" },
      { price: "65,420.10", amount: "0.1987", total: "13,001.09" },
    ],
  };

  const recentTrades = [
    { price: "65,432.10", amount: "0.1234", time: "14:23:45", type: "buy" },
    { price: "65,431.50", amount: "0.2456", time: "14:23:44", type: "sell" },
    { price: "65,433.20", amount: "0.0987", time: "14:23:43", type: "buy" },
    { price: "65,430.80", amount: "0.3456", time: "14:23:42", type: "sell" },
    { price: "65,432.90", amount: "0.1876", time: "14:23:41", type: "buy" },
  ];

  const openOrders = [
    {
      pair: "BTC/USDT",
      type: "Buy",
      amount: "0.1234",
      price: "65,200.00",
      filled: "0%",
      status: "Open",
    },
    {
      pair: "ETH/USDT",
      type: "Sell",
      amount: "2.5678",
      price: "3,250.00",
      filled: "45%",
      status: "Partial",
    },
  ];

  // Chart data for BTC/USDT with price and volume
  const chartData = [
    {
      time: "09:00",
      price: 63890,
      volume: 120,
      high: 64100,
      low: 63800,
      open: 63950,
      close: 63890,
    },
    {
      time: "10:00",
      price: 64200,
      volume: 150,
      high: 64350,
      low: 63890,
      open: 63890,
      close: 64200,
    },
    {
      time: "11:00",
      price: 64100,
      volume: 180,
      high: 64250,
      low: 64050,
      open: 64200,
      close: 64100,
    },
    {
      time: "12:00",
      price: 64800,
      volume: 220,
      high: 64900,
      low: 64100,
      open: 64100,
      close: 64800,
    },
    {
      time: "13:00",
      price: 65200,
      volume: 190,
      high: 65300,
      low: 64750,
      open: 64800,
      close: 65200,
    },
    {
      time: "14:00",
      price: 65432,
      volume: 160,
      high: 65500,
      low: 65150,
      open: 65200,
      close: 65432,
    },
    {
      time: "15:00",
      price: 65650,
      volume: 140,
      high: 65700,
      low: 65400,
      open: 65432,
      close: 65650,
    },
    {
      time: "16:00",
      price: 65432,
      volume: 170,
      high: 65680,
      low: 65380,
      open: 65650,
      close: 65432,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Trading Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div>
                  <h1 className="text-2xl font-bold">{currentPair}</h1>
                  <p className="text-muted-foreground">Bitcoin / Tether</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div>
                    <div className="text-2xl font-bold">${currentPrice}</div>
                    <Badge variant="default" className="text-success">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {priceChange}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h High:</span>
                      <span>${high24h}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Low:</span>
                      <span>${low24h}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Volume:</span>
                      <span>{volume24h}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Select defaultValue="BTC/USDT">
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                  <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                  <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Order Book */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Order Book</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {/* Sell Orders */}
                <div>
                  <div className="px-4 pb-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                      <span>Price (USDT)</span>
                      <span className="text-right">Amount (BTC)</span>
                      <span className="text-right">Total</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {orderBook.sells.reverse().map((order, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-2 px-4 py-1 text-xs hover:bg-muted/20 cursor-pointer"
                      >
                        <span className="text-danger">{order.price}</span>
                        <span className="text-right">{order.amount}</span>
                        <span className="text-right text-muted-foreground">
                          {order.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Price */}
                <div className="px-4 py-2 bg-muted/20 text-center">
                  <span className="text-lg font-bold text-success">
                    ${currentPrice}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    Current Price
                  </div>
                </div>

                {/* Buy Orders */}
                <div>
                  <div className="space-y-1">
                    {orderBook.buys.map((order, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-2 px-4 py-1 text-xs hover:bg-muted/20 cursor-pointer"
                      >
                        <span className="text-success">{order.price}</span>
                        <span className="text-right">{order.amount}</span>
                        <span className="text-right text-muted-foreground">
                          {order.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Area */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Price Chart</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    1H
                  </Button>
                  <Button variant="outline" size="sm">
                    4H
                  </Button>
                  <Button variant="outline" size="sm">
                    1D
                  </Button>
                  <Button variant="default" size="sm">
                    1W
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      yAxisId="price"
                      orientation="right"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <YAxis
                      yAxisId="volume"
                      orientation="left"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      hide
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value, name) => {
                        if (name === "price")
                          return [
                            `$${Number(value).toLocaleString()}`,
                            "Price",
                          ];
                        if (name === "volume") return [`${value}K`, "Volume"];
                        return [value, name];
                      }}
                    />
                    <Bar
                      yAxisId="volume"
                      dataKey="volume"
                      fill="hsl(var(--muted))"
                      opacity={0.3}
                      radius={[2, 2, 0, 0]}
                    />
                    <Line
                      yAxisId="price"
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{
                        fill: "hsl(var(--primary))",
                        strokeWidth: 2,
                        r: 3,
                      }}
                      activeDot={{
                        r: 5,
                        stroke: "hsl(var(--primary))",
                        strokeWidth: 2,
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Placement & Recent Trades */}
          <div className="xl:col-span-1 space-y-6">
            {/* Order Placement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={orderType} onValueChange={setOrderType}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                  </TabsList>

                  <TabsContent value="market" className="space-y-4">
                    <Tabs defaultValue="buy">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="buy"
                          className="text-success data-[state=active]:bg-success/10"
                        >
                          Buy
                        </TabsTrigger>
                        <TabsTrigger
                          value="sell"
                          className="text-danger data-[state=active]:bg-danger/10"
                        >
                          Sell
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="buy" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="buyAmount">Amount (BTC)</Label>
                          <Input
                            id="buyAmount"
                            placeholder="0.00"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available: 5,250.00 USDT
                        </div>
                        <Button className="w-full bg-success hover:bg-success/90">
                          Buy BTC
                        </Button>
                      </TabsContent>

                      <TabsContent value="sell" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sellAmount">Amount (BTC)</Label>
                          <Input
                            id="sellAmount"
                            placeholder="0.00"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Available: 2.3456 BTC
                        </div>
                        <Button className="w-full bg-danger hover:bg-danger/90">
                          Sell BTC
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="limit" className="space-y-4">
                    <Tabs defaultValue="buy">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="buy"
                          className="text-success data-[state=active]:bg-success/10"
                        >
                          Buy
                        </TabsTrigger>
                        <TabsTrigger
                          value="sell"
                          className="text-danger data-[state=active]:bg-danger/10"
                        >
                          Sell
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="buy" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="buyLimitPrice">Price (USDT)</Label>
                          <Input
                            id="buyLimitPrice"
                            placeholder="65,000.00"
                            value={buyPrice}
                            onChange={(e) => setBuyPrice(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="buyLimitAmount">Amount (BTC)</Label>
                          <Input
                            id="buyLimitAmount"
                            placeholder="0.00"
                            value={buyAmount}
                            onChange={(e) => setBuyAmount(e.target.value)}
                          />
                        </div>
                        <Button className="w-full bg-success hover:bg-success/90">
                          Place Buy Order
                        </Button>
                      </TabsContent>

                      <TabsContent value="sell" className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="sellLimitPrice">Price (USDT)</Label>
                          <Input
                            id="sellLimitPrice"
                            placeholder="65,500.00"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sellLimitAmount">Amount (BTC)</Label>
                          <Input
                            id="sellLimitAmount"
                            placeholder="0.00"
                            value={sellAmount}
                            onChange={(e) => setSellAmount(e.target.value)}
                          />
                        </div>
                        <Button className="w-full bg-danger hover:bg-danger/90">
                          Place Sell Order
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Recent Trades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Trades</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  <div className="px-4 py-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground border-b">
                    <span>Price</span>
                    <span className="text-right">Amount</span>
                    <span className="text-right">Time</span>
                  </div>
                  {recentTrades.map((trade, index) => (
                    <div
                      key={index}
                      className="px-4 py-1 grid grid-cols-3 gap-2 text-xs hover:bg-muted/20"
                    >
                      <span
                        className={
                          trade.type === "buy" ? "text-success" : "text-danger"
                        }
                      >
                        {trade.price}
                      </span>
                      <span className="text-right">{trade.amount}</span>
                      <span className="text-right text-muted-foreground">
                        {trade.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Open Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Open Orders</CardTitle>
            <CardDescription>Your current active orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 font-medium text-muted-foreground">
                      Pair
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Filled
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {openOrders.map((order, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-4 font-medium">{order.pair}</td>
                      <td className="py-4">
                        <Badge
                          variant={
                            order.type === "Buy" ? "default" : "destructive"
                          }
                        >
                          {order.type}
                        </Badge>
                      </td>
                      <td className="py-4 font-mono">{order.amount}</td>
                      <td className="py-4 font-mono">${order.price}</td>
                      <td className="py-4">{order.filled}</td>
                      <td className="py-4">
                        <Badge variant="outline">{order.status}</Badge>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
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

export default Trading;
