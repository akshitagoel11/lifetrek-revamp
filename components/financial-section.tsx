"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, ArrowUpRight, ArrowDownRight, Filter, Plus, Trash2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Transaction } from "@/lib/types"
import { cn } from "@/lib/utils"
import { TransactionHistoryChart, SpendingAnalyticsChart } from "@/components/ui/financial-charts"

export default function FinancialSection() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>("transactions", [
    {
      id: "1",
      amount: 1200,
      type: "income",
      category: "salary",
      description: "Monthly salary",
      date: new Date(2025, 3, 1).toISOString(),
    },
    {
      id: "2",
      amount: 45,
      type: "expense",
      category: "food",
      description: "Grocery shopping",
      date: new Date(2025, 3, 2).toISOString(),
    },
    {
      id: "3",
      amount: 30,
      type: "expense",
      category: "entertainment",
      description: "Movie tickets",
      date: new Date(2025, 3, 3).toISOString(),
    },
    {
      id: "4",
      amount: 200,
      type: "expense",
      category: "utilities",
      description: "Electricity bill",
      date: new Date(2025, 3, 5).toISOString(),
    },
    {
      id: "5",
      amount: 300,
      type: "income",
      category: "freelance",
      description: "Freelance project",
      date: new Date(2025, 3, 10).toISOString(),
    },
  ])

  const [newAmount, setNewAmount] = useState("")
  const [newType, setNewType] = useState<"income" | "expense">("expense")
  const [newCategory, setNewCategory] = useState("food")
  const [newDescription, setNewDescription] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  const handleAddTransaction = () => {
    if (newAmount && Number.parseFloat(newAmount) > 0) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        amount: Number.parseFloat(newAmount),
        type: newType,
        category: newCategory,
        description: newDescription || `${newType === "income" ? "Income" : "Expense"} - ${newCategory}`,
        date: new Date().toISOString(),
      }

      setTransactions([transaction, ...transactions])
      setNewAmount("")
      setNewDescription("")
    }
  }

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const filteredTransactions =
    filterCategory === "all" ? transactions : transactions.filter((t) => t.category === filterCategory)

  const categoryOptions = [
    { value: "food", label: "Food & Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment" },
    { value: "other", label: "Other" },
  ]

  const getCategoryLabel = (value: string) => {
    const category = categoryOptions.find((c) => c.value === value)
    return category ? category.label : value
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return "🍔"
      case "transportation":
        return "🚗"
      case "utilities":
        return "💡"
      case "entertainment":
        return "🎬"
      case "shopping":
        return "🛍️"
      case "health":
        return "🏥"
      case "education":
        return "📚"
      case "salary":
        return "💼"
      case "freelance":
        return "💻"
      case "investment":
        return "📈"
      default:
        return "📋"
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Financial Tracker</h1>
        <p className="text-muted-foreground">Track your income, expenses, and manage your budget</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          className={cn(
            "overflow-hidden hover:shadow-lg transition-shadow",
            balance >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <h2
                  className={cn(
                    "text-3xl font-bold",
                    balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                  )}
                >
                  {formatCurrency(balance)}
                </h2>
              </div>
              <div
                className={cn(
                  "p-3 rounded-full",
                  balance >= 0 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30",
                )}
              >
                <Wallet className={cn("h-6 w-6", balance >= 0 ? "text-green-500" : "text-red-500")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</h2>
              </div>
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                <ArrowUpRight className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(totalExpenses)}</h2>
              </div>
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <ArrowDownRight className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow mb-6">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No transactions found. Add some to get started!</p>
                    </div>
                  ) : (
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                      {filteredTransactions.map((transaction) => (
                        <motion.div key={transaction.id} variants={item}>
                          <div
                            className={cn(
                              "flex items-center justify-between p-4 rounded-md",
                              transaction.type === "income"
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "bg-red-50 dark:bg-red-900/20",
                            )}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={cn(
                                  "flex items-center justify-center w-10 h-10 rounded-full",
                                  transaction.type === "income"
                                    ? "bg-green-100 dark:bg-green-900/30"
                                    : "bg-red-100 dark:bg-red-900/30",
                                )}
                              >
                                <span className="text-lg">{getCategoryIcon(transaction.category)}</span>
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span>{getCategoryLabel(transaction.category)}</span>
                                  <span className="mx-2">•</span>
                                  <span>{formatDate(transaction.date)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <p
                                className={cn(
                                  "font-medium",
                                  transaction.type === "income"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400",
                                )}
                              >
                                {transaction.type === "income" ? "+" : "-"}
                                {formatCurrency(transaction.amount)}
                              </p>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">This Month</p>
                        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Last Month</p>
                        <p className="text-2xl font-bold">{formatCurrency(balance * 0.85)}</p>
                      </div>
                    </div>

                    <TransactionHistoryChart transactions={transactions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <CardTitle>Spending Analytics</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <SpendingAnalyticsChart transactions={transactions} />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-sm text-muted-foreground">Food & Dining</p>
                        <p className="text-lg font-medium">{formatCurrency(75)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-sm text-muted-foreground">Transportation</p>
                        <p className="text-lg font-medium">{formatCurrency(50)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-sm text-muted-foreground">Entertainment</p>
                        <p className="text-lg font-medium">{formatCurrency(30)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <p className="text-sm text-muted-foreground">Utilities</p>
                        <p className="text-lg font-medium">{formatCurrency(200)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={newType === "expense" ? "default" : "outline"}
                    onClick={() => setNewType("expense")}
                    className={newType === "expense" ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    Expense
                  </Button>
                  <Button
                    variant={newType === "income" ? "default" : "outline"}
                    onClick={() => setNewType("income")}
                    className={newType === "income" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Income
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Amount</p>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Category</p>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions
                        .filter((option) =>
                          newType === "income"
                            ? ["salary", "freelance", "investment", "other"].includes(option.value)
                            : !["salary", "freelance", "investment"].includes(option.value),
                        )
                        .map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Description (Optional)</p>
                  <Input
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddTransaction}
                  disabled={!newAmount || Number.parseFloat(newAmount) <= 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow mt-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Budget Goals</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Monthly Savings</p>
                    <p className="text-sm text-muted-foreground">$300 / $500</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Food Budget</p>
                    <p className="text-sm text-muted-foreground">$75 / $200</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "37.5%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium">Entertainment</p>
                    <p className="text-sm text-muted-foreground">$30 / $100</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>

                <Button className="w-full">Set Budget Goals</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
