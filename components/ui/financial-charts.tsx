"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import type { Transaction } from "@/lib/types"

// Custom tooltip for the line chart
const TransactionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-green-600">Income: ${payload[0].value.toFixed(2)}</p>
        <p className="text-red-600">Expense: ${payload[1].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

// Custom tooltip for the pie chart
const SpendingTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-gray-700">${payload[0].value.toFixed(2)}</p>
        <p className="text-gray-500">{payload[0].payload.percentage}% of total</p>
      </div>
    )
  }
  return null
}

// Colors for the pie chart
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8AC926"]

export function TransactionHistoryChart({ transactions }: { transactions: Transaction[] }) {
  // Process transaction data for the chart
  const chartData = useMemo(() => {
    // Group transactions by date
    const groupedByDate = transactions.reduce(
      (acc: Record<string, { income: number; expense: number }>, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })

        if (!acc[date]) {
          acc[date] = { income: 0, expense: 0 }
        }

        if (transaction.type === "income") {
          acc[date].income += transaction.amount
        } else {
          acc[date].expense += transaction.amount
        }

        return acc
      },
      {},
    )

    // Convert to array and sort by date
    return Object.entries(groupedByDate)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      .slice(-10) // Get last 10 days
  }, [transactions])

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#f0f0f0" }} />
        <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip content={<TransactionTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 3, fill: "#10b981" }}
          activeDot={{ r: 5 }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 3, fill: "#ef4444" }}
          activeDot={{ r: 5 }}
          name="Expense"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function SpendingAnalyticsChart({ transactions }: { transactions: Transaction[] }) {
  // Process transaction data for the chart
  const chartData = useMemo(() => {
    // Filter only expenses
    const expenses = transactions.filter((t) => t.type === "expense")

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

    // Group by category
    const groupedByCategory = expenses.reduce((acc: Record<string, number>, transaction) => {
      const category = transaction.category

      if (!acc[category]) {
        acc[category] = 0
      }

      acc[category] += transaction.amount

      return acc
    }, {})

    // Convert to array with percentages
    return Object.entries(groupedByCategory)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : "0",
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  // Get category labels
  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      food: "Food & Dining",
      transportation: "Transportation",
      utilities: "Utilities",
      entertainment: "Entertainment",
      shopping: "Shopping",
      health: "Health",
      education: "Education",
      other: "Other",
    }

    return categoryMap[category] || category
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${getCategoryLabel(name)} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<SpendingTooltip />} />
        <Legend
          formatter={(value) => getCategoryLabel(value)}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
