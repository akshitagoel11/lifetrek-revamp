"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { BarChart, LineChart, PieChart, AreaChart } from "lucide-react"
import { Chart, registerables } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Skill, Task } from "@/lib/types"

// Register Chart.js components
Chart.register(...registerables)

export default function AnalyticsSection() {
  const [skills] = useLocalStorage<Skill[]>("skills", [])
  const [tasks] = useLocalStorage<Task[]>("tasks", [])
  const [completedTasks] = useLocalStorage<Task[]>("completedTasks", [])

  const [timePeriod, setTimePeriod] = useState("weekly")
  const [chartType, setChartType] = useState("bar")

  const tasksChartRef = useRef<HTMLCanvasElement>(null)
  const skillsChartRef = useRef<HTMLCanvasElement>(null)
  const progressChartRef = useRef<HTMLCanvasElement>(null)
  const timeDistributionRef = useRef<HTMLCanvasElement>(null)

  const tasksChartInstance = useRef<Chart | null>(null)
  const skillsChartInstance = useRef<Chart | null>(null)
  const progressChartInstance = useRef<Chart | null>(null)
  const timeDistributionInstance = useRef<Chart | null>(null)

  useEffect(() => {
    updateCharts()

    return () => {
      if (tasksChartInstance.current) {
        tasksChartInstance.current.destroy()
      }
      if (skillsChartInstance.current) {
        skillsChartInstance.current.destroy()
      }
      if (progressChartInstance.current) {
        progressChartInstance.current.destroy()
      }
      if (timeDistributionInstance.current) {
        timeDistributionInstance.current.destroy()
      }
    }
  }, [timePeriod, chartType, skills, tasks, completedTasks])

  const getTimeFilteredData = () => {
    const now = new Date()
    let labels: string[] = []
    let tasksPending: number[] = []
    let tasksCompleted: number[] = []
    const skillLevels = skills.map((s) => ({ name: s.name, levels: [] as number[] }))

    if (timePeriod === "daily") {
      labels = ["Today"]
      tasksPending = [tasks.length]
      tasksCompleted = [completedTasks.length]
      skillLevels.forEach((s) => {
        const skill = skills.find((skill) => skill.name === s.name)
        s.levels = [skill ? skill.level : 0]
      })
    } else if (timePeriod === "weekly") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      tasksPending = Array(7).fill(0)
      tasksCompleted = Array(7).fill(0)

      // Simulate some data for the week
      for (let i = 0; i < 7; i++) {
        tasksPending[i] = Math.floor(Math.random() * 5) + 1
        tasksCompleted[i] = Math.floor(Math.random() * 3) + 1
      }

      skillLevels.forEach((s) => {
        const skill = skills.find((skill) => skill.name === s.name)
        s.levels = Array(7).fill(skill ? skill.level : 0)
      })
    } else if (timePeriod === "monthly") {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())
      tasksPending = Array(daysInMonth).fill(0)
      tasksCompleted = Array(daysInMonth).fill(0)

      // Simulate some data for the month
      for (let i = 0; i < daysInMonth; i++) {
        tasksPending[i] = Math.floor(Math.random() * 5)
        tasksCompleted[i] = Math.floor(Math.random() * 3)
      }

      skillLevels.forEach((s) => {
        const skill = skills.find((skill) => skill.name === s.name)
        s.levels = Array(daysInMonth).fill(skill ? skill.level : 0)
      })
    }

    return { labels, tasksPending, tasksCompleted, skillLevels }
  }

  const updateCharts = () => {
    const { labels, tasksPending, tasksCompleted, skillLevels } = getTimeFilteredData()

    // Tasks Chart
    if (tasksChartRef.current) {
      if (tasksChartInstance.current) {
        tasksChartInstance.current.destroy()
      }

      const ctx = tasksChartRef.current.getContext("2d")
      if (ctx) {
        tasksChartInstance.current = new Chart(ctx, {
          type: chartType as any,
          data: {
            labels: labels,
            datasets: [
              {
                label: "Pending Tasks",
                data: tasksPending,
                backgroundColor: "rgba(249, 115, 22, 0.2)",
                borderColor: "rgb(249, 115, 22)",
                borderWidth: 1,
              },
              {
                label: "Completed Tasks",
                data: tasksCompleted,
                backgroundColor: "rgba(225, 29, 72, 0.2)",
                borderColor: "rgb(225, 29, 72)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Task Progress",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        })
      }
    }

    // Skills Chart
    if (skillsChartRef.current) {
      if (skillsChartInstance.current) {
        skillsChartInstance.current.destroy()
      }

      const ctx = skillsChartRef.current.getContext("2d")
      if (ctx) {
        const datasets =
          timePeriod === "daily"
            ? [
                {
                  label: "Skill Levels",
                  data: skills.map((s) => s.level),
                  backgroundColor: skills.map(
                    (_, i) => `rgba(${(i * 50) % 255}, ${(i * 100) % 255}, ${(i * 150) % 255}, 0.2)`,
                  ),
                  borderColor: skills.map((_, i) => `rgb(${(i * 50) % 255}, ${(i * 100) % 255}, ${(i * 150) % 255})`),
                  borderWidth: 1,
                },
              ]
            : skillLevels.map((s, i) => ({
                label: s.name,
                data: s.levels,
                backgroundColor: `rgba(${(i * 50) % 255}, ${(i * 100) % 255}, ${(i * 150) % 255}, 0.2)`,
                borderColor: `rgb(${(i * 50) % 255}, ${(i * 100) % 255}, ${(i * 150) % 255})`,
                borderWidth: 1,
              }))

        skillsChartInstance.current = new Chart(ctx, {
          type: chartType as any,
          data: {
            labels: timePeriod === "daily" ? skills.map((s) => s.name) : labels,
            datasets: datasets,
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Skill Levels",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                title: {
                  display: true,
                  text: "Skill Level (0-5)",
                },
              },
            },
          },
        })
      }
    }

    // Progress Chart
    if (progressChartRef.current) {
      if (progressChartInstance.current) {
        progressChartInstance.current.destroy()
      }

      const ctx = progressChartRef.current.getContext("2d")
      if (ctx) {
        // Simulate progress data
        const progressData = [65, 78, 80, 74, 85, 90]
        const progressLabels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]

        progressChartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: progressLabels,
            datasets: [
              {
                label: "Overall Progress",
                data: progressData,
                fill: true,
                backgroundColor: "rgba(249, 115, 22, 0.2)",
                borderColor: "rgb(249, 115, 22)",
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Learning Progress",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Progress (%)",
                },
              },
            },
          },
        })
      }
    }

    // Time Distribution Chart
    if (timeDistributionRef.current) {
      if (timeDistributionInstance.current) {
        timeDistributionInstance.current.destroy()
      }

      const ctx = timeDistributionRef.current.getContext("2d")
      if (ctx) {
        // Simulate time distribution data
        const timeData = [25, 15, 20, 10, 30]
        const timeLabels = ["JavaScript", "React", "CSS", "Node.js", "Other"]

        timeDistributionInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: timeLabels,
            datasets: [
              {
                label: "Time Spent",
                data: timeData,
                backgroundColor: [
                  "rgba(249, 115, 22, 0.7)",
                  "rgba(225, 29, 72, 0.7)",
                  "rgba(59, 130, 246, 0.7)",
                  "rgba(16, 185, 129, 0.7)",
                  "rgba(139, 92, 246, 0.7)",
                ],
                borderColor: [
                  "rgb(249, 115, 22)",
                  "rgb(225, 29, 72)",
                  "rgb(59, 130, 246)",
                  "rgb(16, 185, 129)",
                  "rgb(139, 92, 246)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
              },
              title: {
                display: true,
                text: "Time Distribution",
              },
            },
          },
        })
      }
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
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your progress and analyze your learning patterns</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Card className="w-full md:w-auto">
          <CardContent className="p-4 flex space-x-4">
            <div>
              <p className="text-sm font-medium mb-1">Time Period</p>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Chart Type</p>
              <div className="flex space-x-2">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("bar")}
                  className="h-8 w-8"
                >
                  <BarChart className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("line")}
                  className="h-8 w-8"
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "pie" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("pie")}
                  className="h-8 w-8"
                >
                  <PieChart className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "radar" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setChartType("radar")}
                  className="h-8 w-8"
                >
                  <AreaChart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="tasks">Tasks & Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress & Time</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <CardTitle>Tasks</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <canvas ref={tasksChartRef}></canvas>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <canvas ref={skillsChartRef}></canvas>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="progress">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <canvas ref={progressChartRef}></canvas>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
                  <CardTitle>Time Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <canvas ref={timeDistributionRef}></canvas>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
