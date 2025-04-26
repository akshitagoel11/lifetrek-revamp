"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, Plus, Check, Star } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Skill, Task } from "@/lib/types"

export default function DashboardSection() {
  const [skills, setSkills] = useLocalStorage<Skill[]>("skills", [
    { id: "1", name: "JavaScript", level: 5.0, history: [] },
    { id: "2", name: "Python", level: 3.5, history: [] },
    { id: "3", name: "HTML", level: 4.5, history: [] },
    { id: "4", name: "CSS", level: 4.0, history: [] },
    { id: "5", name: "Node.js", level: 3.0, history: [] },
    { id: "6", name: "React", level: 2.5, history: [] },
  ])

  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])
  const [newTask, setNewTask] = useState("")
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const tips = [
    "Teach what you've learned to solidify your understanding.",
    "Break tasks into smaller, manageable chunks.",
    "Review your progress weekly to stay on track.",
    "Collaborate with peers to gain new perspectives.",
    "Set specific, measurable goals for better tracking.",
    "Take regular breaks to maintain productivity.",
    "Celebrate small wins to stay motivated.",
  ]

  const [currentTip, setCurrentTip] = useState(tips[0])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  useEffect(() => {
    // Rotate tips every 10 seconds
    const tipInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * tips.length)
      setCurrentTip(tips[randomIndex])
    }, 10000)

    return () => clearInterval(tipInterval)
  }, [])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0")
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const secs = (totalSeconds % 60).toString().padStart(2, "0")
    return `${hours}:${minutes}:${secs}`
  }

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        createdDate: new Date().toISOString(),
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: true } : task)))
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Track your progress and manage your daily activities</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Skill Progress */}
        <motion.div variants={item}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Skill Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {skills.slice(0, 4).map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level.toFixed(1)}/5.0</span>
                    </div>
                    <Progress
                      value={(skill.level / 5) * 100}
                      className="h-2"
                      indicatorClassName="bg-gradient-to-r from-orange-500 to-rose-500"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Streak */}
        <motion.div variants={item}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Learning Streak</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">
                5 days
              </div>
              <p className="text-muted-foreground">Keep up the good work!</p>
              <div className="flex mt-4 space-x-1">
                {[1, 2, 3, 4, 5].map((day) => (
                  <motion.div
                    key={day}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: day * 0.1 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 flex items-center justify-center text-white text-xs"
                  >
                    {day}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Task */}
        <motion.div variants={item}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Next Task</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-4 font-medium">Complete JavaScript Basics course</div>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600">
                Start Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Add */}
        <motion.div variants={item}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Quick Add</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddTask}
                  size="icon"
                  className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800"
                  >
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.text}</span>
                    {!task.completed && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleCompleteTask(task.id)}
                        className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Timer */}
        <motion.div variants={item}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Learning Timer</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-mono text-center mb-4">{formatTime(seconds)}</div>
              <div className="flex justify-between">
                <Button
                  onClick={() => setIsRunning(true)}
                  disabled={isRunning}
                  className={`${isRunning ? "bg-gray-300 dark:bg-gray-700" : "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"}`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button onClick={() => setIsRunning(false)} disabled={!isRunning} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={() => {
                    setIsRunning(false)
                    setSeconds(0)
                  }}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Tip */}
        <motion.div variants={item}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Quick Tip</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <motion.p
                key={currentTip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-start"
              >
                <Star className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                <span>{currentTip}</span>
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  )
}
