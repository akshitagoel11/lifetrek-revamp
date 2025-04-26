"use client"

import { motion } from "framer-motion"
import { MessageSquare, UserPlus, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function SocialSection() {
  const profiles = [
    {
      id: "1",
      name: "Alice Smith",
      initials: "AS",
      role: "Frontend Developer",
      skills: ["React", "TypeScript", "CSS"],
      status: "online",
    },
    {
      id: "2",
      name: "Bob Johnson",
      initials: "BJ",
      role: "Backend Developer",
      skills: ["Node.js", "Python", "MongoDB"],
      status: "offline",
    },
    {
      id: "3",
      name: "Carol White",
      initials: "CW",
      role: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Sketch"],
      status: "online",
    },
    {
      id: "4",
      name: "David Brown",
      initials: "DB",
      role: "Full Stack Developer",
      skills: ["JavaScript", "React", "Express"],
      status: "away",
    },
    {
      id: "5",
      name: "Emma Davis",
      initials: "ED",
      role: "Data Scientist",
      skills: ["Python", "R", "TensorFlow"],
      status: "offline",
    },
    {
      id: "6",
      name: "Frank Miller",
      initials: "FM",
      role: "DevOps Engineer",
      skills: ["Docker", "Kubernetes", "AWS"],
      status: "online",
    },
  ]

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <section>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted-foreground">Connect with other learners and professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
            <CardTitle>Learning Groups</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-md">
                    <Users className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Web Development</h3>
                    <p className="text-sm text-muted-foreground">24 members</p>
                  </div>
                </div>
                <Button size="sm">Join</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Data Science</h3>
                    <p className="text-sm text-muted-foreground">18 members</p>
                  </div>
                </div>
                <Button size="sm">Join</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">UI/UX Design</h3>
                    <p className="text-sm text-muted-foreground">12 members</p>
                  </div>
                </div>
                <Button size="sm">Join</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
            <CardTitle>Recent Discussions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Best resources for learning React?</h3>
                  <Badge variant="outline">Web Dev</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  I'm looking for the most up-to-date resources for learning React in 2025...
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="text-[10px]">AS</AvatarFallback>
                    </Avatar>
                    <span>Alice Smith</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>12 replies</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">How to structure a large Next.js project?</h3>
                  <Badge variant="outline">Architecture</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  I'm working on a large Next.js project and need advice on folder structure...
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarFallback className="text-[10px]">BJ</AvatarFallback>
                    </Avatar>
                    <span>Bob Johnson</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>8 replies</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Community Members</h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {profiles.map((profile) => (
          <motion.div key={profile.id} variants={item}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        {profile.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(profile.status)}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{profile.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {profile.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.role}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button size="sm" variant="outline" className="flex-1 mr-2">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
