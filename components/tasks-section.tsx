"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Trash2, Plus, Clock } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Task } from "@/lib/types"

export default function TasksSection() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", [])
  const [completedTasks, setCompletedTasks] = useLocalStorage<Task[]>("completedTasks", [])
  const [newTask, setNewTask] = useState("")

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
    const task = tasks.find((t) => t.id === id)
    if (task) {
      const updatedTask = {
        ...task,
        completed: true,
        completedDate: new Date().toISOString(),
      }
      setCompletedTasks([...completedTasks, updatedTask])
      setTasks(tasks.filter((t) => t.id !== id))
    }
  }

  const handleDeleteTask = (id: string, isCompleted = false) => {
    if (isCompleted) {
      setCompletedTasks(completedTasks.filter((t) => t.id !== id))
    } else {
      setTasks(tasks.filter((t) => t.id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage your to-do list and track completed tasks</p>
      </div>

      <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <Input
              placeholder="New task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1"
            />
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active tasks. Add a new task to get started!</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {tasks.map((task) => (
                <motion.div key={task.id} variants={item}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{task.text}</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Created: {formatDate(task.createdDate)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCompleteTask(task.id)}
                            className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No completed tasks yet. Complete a task to see it here!</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {completedTasks.map((task) => (
                <motion.div key={task.id} variants={item}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium line-through text-muted-foreground">{task.text}</p>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Check className="h-3 w-3 mr-1 text-green-500" />
                            <span>Completed: {formatDate(task.completedDate || task.createdDate)}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id, true)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
