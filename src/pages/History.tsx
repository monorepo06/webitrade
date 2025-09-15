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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Calendar as CalendarIcon,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import DashboardLayout from "@/components/layout/DashboardLayout";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const deposits = [
    {
      id: "DEP001",
      coin: "BTC",
      amount: "0.5000",
      status: "Completed",
      date: "2024-01-15 14:30:22",
      txHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      network: "Bitcoin",
      confirmations: "6/6",
    },
    {
      id: "DEP002",
      coin: "ETH",
      amount: "2.5000",
      status: "Pending",
      date: "2024-01-14 09:15:43",
      txHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
      network: "Ethereum",
      confirmations: "8/12",
    },
    {
      id: "DEP003",
      coin: "USDT",
      amount: "1,000.00",
      status: "Completed",
      date: "2024-01-13 16:45:12",
      txHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
      network: "Ethereum (ERC-20)",
      confirmations: "12/12",
    },
  ];

  const withdrawals = [
    {
      id: "WIT001",
      coin: "BTC",
      amount: "0.2500",
      status: "Completed",
      date: "2024-01-12 11:20:15",
      txHash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3",
      network: "Bitcoin",
      fee: "0.0001 BTC",
      address: "bc1qxy2...fjhx0wlh",
    },
    {
      id: "WIT002",
      coin: "SOL",
      amount: "50.00",
      status: "Failed",
      date: "2024-01-11 08:35:28",
      txHash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4",
      network: "Solana",
      fee: "0.001 SOL",
      address: "7xKXtg...4S8qY9",
    },
    {
      id: "WIT003",
      coin: "USDT",
      amount: "500.00",
      status: "Processing",
      date: "2024-01-10 13:50:41",
      txHash: "f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5",
      network: "Ethereum (ERC-20)",
      fee: "15.00 USDT",
      address: "0x742d35...0deB4F",
    },
  ];

  const trades = [
    {
      id: "TRD001",
      pair: "BTC/USDT",
      side: "Buy",
      amount: "0.1000",
      price: "65,432.10",
      total: "6,543.21",
      fee: "6.54 USDT",
      status: "Filled",
      date: "2024-01-15 10:25:33",
    },
    {
      id: "TRD002",
      pair: "ETH/USDT",
      side: "Sell",
      amount: "2.0000",
      price: "3,215.67",
      total: "6,431.34",
      fee: "0.004 ETH",
      status: "Filled",
      date: "2024-01-14 15:40:18",
    },
    {
      id: "TRD003",
      pair: "SOL/USDT",
      side: "Buy",
      amount: "50.00",
      price: "142.89",
      total: "7,144.50",
      fee: "7.14 USDT",
      status: "Partial",
      date: "2024-01-13 12:15:07",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "filled":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
      case "processing":
      case "partial":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-danger" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "filled":
        return "default";
      case "pending":
      case "processing":
      case "partial":
        return "secondary";
      case "failed":
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">
              View and manage your trading, deposit, and withdrawal history.
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter your transaction history by type, status, and date range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trades">Trades</SelectItem>
                  <SelectItem value="deposits">Deposits</SelectItem>
                  <SelectItem value="withdrawals">Withdrawals</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>
              Your complete transaction history across all activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="trades">Trades</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-4">
                  {/* Combined view showing all transaction types */}
                  <div className="text-sm text-muted-foreground">
                    Showing all transaction types
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trades">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 font-medium text-muted-foreground">
                          Trade ID
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Pair
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Side
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Price
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Total
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Fee
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.map((trade, index) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-4 font-mono text-sm">{trade.id}</td>
                          <td className="py-4 font-medium">{trade.pair}</td>
                          <td className="py-4">
                            <Badge
                              variant={
                                trade.side === "Buy" ? "default" : "destructive"
                              }
                            >
                              {trade.side === "Buy" ? (
                                <BarChart3 className="h-3 w-3 mr-1" />
                              ) : (
                                <BarChart3 className="h-3 w-3 mr-1" />
                              )}
                              {trade.side}
                            </Badge>
                          </td>
                          <td className="py-4 font-mono">{trade.amount}</td>
                          <td className="py-4 font-mono">${trade.price}</td>
                          <td className="py-4 font-mono">${trade.total}</td>
                          <td className="py-4 font-mono text-muted-foreground">
                            {trade.fee}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(trade.status)}
                              <Badge variant={getStatusVariant(trade.status)}>
                                {trade.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground text-sm">
                            {trade.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="deposits">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 font-medium text-muted-foreground">
                          Deposit ID
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Coin
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Network
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Confirmations
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          TX Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deposits.map((deposit, index) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-4 font-mono text-sm">
                            {deposit.id}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                                <ArrowDownRight className="h-3 w-3 text-success" />
                              </div>
                              <span className="font-medium">
                                {deposit.coin}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 font-mono">{deposit.amount}</td>
                          <td className="py-4 text-muted-foreground">
                            {deposit.network}
                          </td>
                          <td className="py-4 font-mono text-sm">
                            {deposit.confirmations}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(deposit.status)}
                              <Badge variant={getStatusVariant(deposit.status)}>
                                {deposit.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground text-sm">
                            {deposit.date}
                          </td>
                          <td className="py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-mono text-xs"
                            >
                              {deposit.txHash.substring(0, 8)}...
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="withdrawals">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 font-medium text-muted-foreground">
                          Withdrawal ID
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Coin
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Amount
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Network
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Fee
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Address
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="py-3 font-medium text-muted-foreground">
                          TX Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal, index) => (
                        <tr
                          key={index}
                          className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-4 font-mono text-sm">
                            {withdrawal.id}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center">
                                <ArrowUpRight className="h-3 w-3 text-warning" />
                              </div>
                              <span className="font-medium">
                                {withdrawal.coin}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 font-mono">
                            {withdrawal.amount}
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {withdrawal.network}
                          </td>
                          <td className="py-4 font-mono text-muted-foreground">
                            {withdrawal.fee}
                          </td>
                          <td className="py-4 font-mono text-xs">
                            {withdrawal.address}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(withdrawal.status)}
                              <Badge
                                variant={getStatusVariant(withdrawal.status)}
                              >
                                {withdrawal.status}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground text-sm">
                            {withdrawal.date}
                          </td>
                          <td className="py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="font-mono text-xs"
                            >
                              {withdrawal.txHash.substring(0, 8)}...
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;
