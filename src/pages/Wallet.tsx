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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  QrCode,
  AlertTriangle,
  Wallet as WalletIcon,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Wallet = () => {
  const [depositAddress] = useState(
    "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
  );
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const { toast } = useToast();

  const walletData = [
    {
      coin: "Bitcoin",
      symbol: "BTC",
      available: "2.3456",
      locked: "0.1234",
      valueUSD: "$152,340.50",
    },
    {
      coin: "Ethereum",
      symbol: "ETH",
      available: "12.8765",
      locked: "2.1234",
      valueUSD: "$41,385.20",
    },
    {
      coin: "Solana",
      symbol: "SOL",
      available: "245.67",
      locked: "54.33",
      valueUSD: "$35,098.15",
    },
    {
      coin: "Cardano",
      symbol: "ADA",
      available: "15,432.10",
      locked: "1,567.90",
      valueUSD: "$13,734.47",
    },
    {
      coin: "USDT",
      symbol: "USDT",
      available: "5,250.00",
      locked: "750.00",
      valueUSD: "$5,250.00",
    },
    {
      coin: "BNB",
      symbol: "BNB",
      available: "28.45",
      locked: "5.55",
      valueUSD: "$8,940.25",
    },
  ];

  const recentTransactions = [
    {
      type: "Deposit",
      coin: "BTC",
      amount: "0.5000",
      status: "Completed",
      time: "2 hours ago",
      txHash: "a1b2c3...",
    },
    {
      type: "Withdraw",
      coin: "ETH",
      amount: "2.5000",
      status: "Pending",
      time: "1 day ago",
      txHash: "d4e5f6...",
    },
    {
      type: "Deposit",
      coin: "USDT",
      amount: "1,000.00",
      status: "Completed",
      time: "2 days ago",
      txHash: "g7h8i9...",
    },
    {
      type: "Withdraw",
      coin: "SOL",
      amount: "50.00",
      status: "Failed",
      time: "3 days ago",
      txHash: "j1k2l3...",
    },
  ];

  // Portfolio allocation for wallet
  const portfolioAllocation = [
    { name: "BTC", value: 152340.5, color: "hsl(var(--chart-1))" },
    { name: "ETH", value: 41385.2, color: "hsl(var(--chart-2))" },
    { name: "SOL", value: 35098.15, color: "hsl(var(--chart-3))" },
    { name: "ADA", value: 13734.47, color: "hsl(var(--chart-4))" },
    { name: "USDT", value: 5250.0, color: "hsl(var(--chart-5))" },
    { name: "BNB", value: 8940.25, color: "hsl(var(--chart-1))" },
  ];

  // Transaction history trend data
  const transactionTrend = [
    { date: "7d ago", deposits: 2500, withdrawals: 1200, net: 1300 },
    { date: "6d ago", deposits: 3200, withdrawals: 800, net: 2400 },
    { date: "5d ago", deposits: 1800, withdrawals: 2200, net: -400 },
    { date: "4d ago", deposits: 4100, withdrawals: 1500, net: 2600 },
    { date: "3d ago", deposits: 2900, withdrawals: 1800, net: 1100 },
    { date: "2d ago", deposits: 3600, withdrawals: 900, net: 2700 },
    { date: "Yesterday", deposits: 2200, withdrawals: 1400, net: 800 },
    { date: "Today", deposits: 1500, withdrawals: 500, net: 1000 },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawal Submitted",
      description: "Your withdrawal request has been submitted for processing",
    });
    setWithdrawAmount("");
    setWithdrawAddress("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-danger" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-success";
      case "Pending":
        return "text-warning";
      case "Failed":
        return "text-danger";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-muted-foreground">
              Manage your cryptocurrency balances and transactions.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Bitcoin</DialogTitle>
                  <DialogDescription>
                    Send Bitcoin to the address below. Only send BTC to this
                    address.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-muted mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Scan QR Code or copy address below
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Bitcoin Address</Label>
                    <div className="flex gap-2">
                      <Input
                        value={depositAddress}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(depositAddress)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-warning/10 p-4 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-warning">
                        Important Notice
                      </p>
                      <p className="text-muted-foreground mt-1">
                        Only send Bitcoin (BTC) to this address. Sending any
                        other cryptocurrency will result in permanent loss.
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Bitcoin</DialogTitle>
                  <DialogDescription>
                    Enter the destination address and amount to withdraw.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawAddress">Destination Address</Label>
                    <Input
                      id="withdrawAddress"
                      placeholder="Enter Bitcoin address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Amount (BTC)</Label>
                    <Input
                      id="withdrawAmount"
                      placeholder="0.00000000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <div className="text-sm text-muted-foreground">
                      Available: 2.3456 BTC • Network fee: 0.0001 BTC
                    </div>
                  </div>

                  <div className="bg-info/10 p-4 rounded-lg">
                    <p className="text-sm text-info">
                      Withdrawals are processed within 24 hours. You will
                      receive an email confirmation.
                    </p>
                  </div>

                  <Button onClick={handleWithdraw} className="w-full">
                    Submit Withdrawal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Portfolio Summary with Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">$257,748.57</div>
              <div className="text-muted-foreground">≈ 3.9401 BTC</div>
            </CardContent>
          </Card>

          {/* Portfolio Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
              <CardDescription>Portfolio allocation by value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {portfolioAllocation.map((entry, index) => (
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
            </CardContent>
          </Card>

          {/* Transaction Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Activity</CardTitle>
              <CardDescription>7-day deposit/withdrawal trend</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transactionTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
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
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString()}`,
                        name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="deposits"
                      stackId="1"
                      stroke="hsl(var(--success))"
                      fill="hsl(var(--success))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="withdrawals"
                      stackId="2"
                      stroke="hsl(var(--warning))"
                      fill="hsl(var(--warning))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Balances</CardTitle>
            <CardDescription>
              Your cryptocurrency holdings across all supported coins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-3 font-medium text-muted-foreground">
                      Coin
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Available
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      In Orders
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Value (USD)
                    </th>
                    <th className="py-3 font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {walletData.map((wallet, index) => (
                    <tr
                      key={index}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-bold text-sm">
                              {wallet.symbol.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{wallet.coin}</div>
                            <div className="text-sm text-muted-foreground">
                              {wallet.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 font-mono">{wallet.available}</td>
                      <td className="py-4 font-mono text-muted-foreground">
                        {wallet.locked}
                      </td>
                      <td className="py-4 font-mono font-medium">
                        {(
                          parseFloat(wallet.available) +
                          parseFloat(wallet.locked)
                        ).toFixed(4)}
                      </td>
                      <td className="py-4 font-medium">{wallet.valueUSD}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ArrowDownRight className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest deposits and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(tx.status)}
                          <div
                            className={`p-2 rounded-full ${
                              tx.type === "Deposit"
                                ? "bg-success/10"
                                : "bg-warning/10"
                            }`}
                          >
                            {tx.type === "Deposit" ? (
                              <ArrowDownRight
                                className={`h-4 w-4 ${
                                  tx.type === "Deposit"
                                    ? "text-success"
                                    : "text-warning"
                                }`}
                              />
                            ) : (
                              <ArrowUpRight
                                className={`h-4 w-4 ${
                                  tx.type === "Deposit"
                                    ? "text-success"
                                    : "text-warning"
                                }`}
                              />
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="font-medium">
                            {tx.type} {tx.coin}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tx.amount} {tx.coin} • {tx.time}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge
                          variant={
                            tx.status === "Completed"
                              ? "default"
                              : tx.status === "Pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={getStatusColor(tx.status)}
                        >
                          {tx.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          TX: {tx.txHash}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="deposits">
                <div className="space-y-4">
                  {recentTransactions
                    .filter((tx) => tx.type === "Deposit")
                    .map((tx, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <div className="p-2 rounded-full bg-success/10">
                              <ArrowDownRight className="h-4 w-4 text-success" />
                            </div>
                          </div>

                          <div>
                            <div className="font-medium">
                              {tx.type} {tx.coin}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {tx.amount} {tx.coin} • {tx.time}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge
                            variant={
                              tx.status === "Completed"
                                ? "default"
                                : "secondary"
                            }
                            className={getStatusColor(tx.status)}
                          >
                            {tx.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            TX: {tx.txHash}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="withdrawals">
                <div className="space-y-4">
                  {recentTransactions
                    .filter((tx) => tx.type === "Withdraw")
                    .map((tx, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <div className="p-2 rounded-full bg-warning/10">
                              <ArrowUpRight className="h-4 w-4 text-warning" />
                            </div>
                          </div>

                          <div>
                            <div className="font-medium">
                              {tx.type} {tx.coin}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {tx.amount} {tx.coin} • {tx.time}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge
                            variant={
                              tx.status === "Completed"
                                ? "default"
                                : tx.status === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className={getStatusColor(tx.status)}
                          >
                            {tx.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            TX: {tx.txHash}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
