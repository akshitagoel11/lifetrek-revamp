"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trash2, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Skill } from "@/lib/types"

export default function SkillsSection() {
  const [skills, setSkills] = useLocalStorage<Skill[]>("skills", [
    { id: "1", name: "JavaScript", level: 5.0, history: [] },
    { id: "2", name: "Python", level: 3.5, history: [] },
    { id: "3", name: "HTML", level: 4.5, history: [] },
    { id: "4", name: "CSS", level: 4.0, history: [] },
    { id: "5", name: "Node.js", level: 3.0, history: [] },
    { id: "6", name: "React", level: 2.5, history: [] },
  ])

  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState<number>(0)

  const handleAddSkill = () => {
    if (newSkillName.trim() && newSkillLevel >= 0 && newSkillLevel <= 5) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: newSkillName,
        level: newSkillLevel,
        history: [{ date: new Date().toISOString(), level: newSkillLevel }],
      }

      setSkills([...skills, newSkill])
      setNewSkillName("")
      setNewSkillLevel(0)
    }
  }

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
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
        <h1 className="text-3xl font-bold">Skills</h1>
        <p className="text-muted-foreground">Track and manage your skills development</p>
      </div>

      <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Skill name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center space-x-2 w-full md:w-48">
              <Input
                type="number"
                placeholder="Level (0-5)"
                min="0"
                max="5"
                step="0.1"
                value={newSkillLevel || ""}
                onChange={(e) => setNewSkillLevel(Number.parseFloat(e.target.value))}
              />
            </div>
            <Button
              onClick={handleAddSkill}
              className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {skills.map((skill) => (
          <motion.div key={skill.id} variants={item}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{skill.name}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Level</span>
                    <span className="text-sm font-medium">{skill.level.toFixed(1)}/5.0</span>
                  </div>
                  <Progress
                    value={(skill.level / 5) * 100}
                    className="h-2"
                    indicatorClassName="bg-gradient-to-r from-orange-500 to-rose-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
