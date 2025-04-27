"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon, Trash2, Plus, Check } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Deadline } from "@/lib/types"
import { cn } from "@/lib/utils"
type CustomDayProps = {
  date: Date
  selected?: boolean
  today?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  onFocus?: (e: React.FocusEvent) => void
}

export default function CalendarSection() {
  const [deadlines, setDeadlines] = useLocalStorage<Deadline[]>("deadlines", [])
  const [newDeadlineText, setNewDeadlineText] = useState("")
  const [newDeadlineDate, setNewDeadlineDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleAddDeadline = () => {
    if (newDeadlineText.trim() && newDeadlineDate) {
      const newDeadline: Deadline = {
        id: Date.now().toString(),
        text: newDeadlineText,
        date: newDeadlineDate.toISOString(),
        completed: false,
      }

      setDeadlines([...deadlines, newDeadline])
      setNewDeadlineText("")
      setNewDeadlineDate(new Date())
    }
  }

  const handleDeleteDeadline = (id: string) => {
    setDeadlines(deadlines.filter((deadline) => deadline.id !== id))
  }

  const handleToggleComplete = (id: string) => {
    setDeadlines(
      deadlines.map((deadline) => (deadline.id === id ? { ...deadline, completed: !deadline.completed } : deadline)),
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDeadlinesForDate = (date: Date) => {
    if (!date) return []

    return deadlines.filter((deadline) => {
      if (!deadline.date) return false

      try {
        const deadlineDate = new Date(deadline.date)
        return (
          deadlineDate.getDate() === date.getDate() &&
          deadlineDate.getMonth() === date.getMonth() &&
          deadlineDate.getFullYear() === date.getFullYear()
        )
      } catch (error) {
        console.error("Error parsing deadline date:", error)
        return false
      }
    })
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
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
    <div className="calendar-section">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Manage your deadlines and important dates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20 flex flex-row items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span>{currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
            <Calendar
  mode="single"
  month={currentMonth}
  onMonthChange={setCurrentMonth}
  className="rounded-md border"
  components={{
    Day: ({ date, selected, today, disabled, onClick, onKeyDown, onFocus }: CustomDayProps) => {
      const dayDeadlines = getDeadlinesForDate(date)
      const hasDeadline = dayDeadlines.length > 0
  
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <button
            onClick={onClick}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            disabled={disabled}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted"
          >
            {date.getDate()}
          </button>
          {hasDeadline && (
            <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
          )}
        </div>
      )
    }
  }}  
/>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow mb-6">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Add Deadline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Input
                  placeholder="Deadline description"
                  value={newDeadlineText}
                  onChange={(e) => setNewDeadlineText(e.target.value)}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newDeadlineDate ? (
                        newDeadlineDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={newDeadlineDate} onSelect={setNewDeadlineDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <Button
                  onClick={handleAddDeadline}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deadline
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {deadlines.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No deadlines yet. Add some to get started!</p>
              ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                  {deadlines
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((deadline) => (
                      <motion.div key={deadline.id} variants={item}>
                        <div
                          className={cn(
                            "flex items-center justify-between p-3 rounded-md",
                            deadline.completed
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-orange-50 dark:bg-orange-900/20",
                          )}
                        >
                          <div className="flex-1">
                            <p
                              className={cn("font-medium", deadline.completed && "line-through text-muted-foreground")}
                            >
                              {deadline.text}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(deadline.date)}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleComplete(deadline.id)}
                              className={cn(
                                "h-7 w-7",
                                deadline.completed
                                  ? "text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                                  : "text-orange-500 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20",
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDeadline(deadline.id)}
                              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
        </div>
      </div>
    </div>
  )
}
