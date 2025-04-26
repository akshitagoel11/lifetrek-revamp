"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, Calendar, FileText, Home, Menu, Moon, Star, Sun, Users, DollarSign, Award } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Show welcome toast
    setShowWelcome(true)
    const timer = setTimeout(() => setShowWelcome(false), 3000)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { id: "skills", label: "Skills", icon: <Star className="h-5 w-5" /> },
    { id: "tasks", label: "Tasks", icon: <FileText className="h-5 w-5" /> },
    { id: "resources", label: "Resources", icon: <FileText className="h-5 w-5" /> },
    { id: "calendar", label: "Calendar", icon: <Calendar className="h-5 w-5" /> },
    { id: "social", label: "Social", icon: <Users className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "rewards", label: "Rewards", icon: <Award className="h-5 w-5" /> },
    { id: "financial", label: "Financial", icon: <DollarSign className="h-5 w-5" /> },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md" : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center py-6 border-b">
                      <div className="flex items-center space-x-2">
                        <svg width="40" height="40" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                          <circle
                            cx="100"
                            cy="100"
                            r="95"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-orange-500"
                          />
                          <path
                            d="M70,140 L70,80 L110,80 Q130,80 140,110 T180,110"
                            fill="none"
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            stroke="url(#gradient)"
                          />
                          <polygon points="170,90 190,110 170,130" fill="currentColor" className="text-orange-500" />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f97316" />
                              <stop offset="100%" stopColor="#e11d48" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">
                          LIFETREK
                        </span>
                      </div>
                    </div>
                    <nav className="flex-1 overflow-auto py-6">
                      <ul className="space-y-2">
                        {navItems.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => {
                                setActiveSection(item.id)
                              }}
                              className={cn(
                                "flex w-full items-center space-x-3 px-4 py-3 rounded-lg transition-all",
                                activeSection === item.id
                                  ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-800",
                              )}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center space-x-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hidden md:block"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="95"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-orange-500"
                  />
                  <path
                    d="M70,140 L70,80 L110,80 Q130,80 140,110 T180,110"
                    fill="none"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="url(#gradient)"
                  />
                  <polygon points="170,90 190,110 170,130" fill="currentColor" className="text-orange-500" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">
                  LIFETREK
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center space-x-1 rounded-lg transition-all",
                    activeSection === item.id
                      ? "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium"
                      : "",
                  )}
                >
                  {item.icon}
                  <span className="hidden lg:inline-block">{item.label}</span>
                </Button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    JD
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-md shadow-lg">
              Welcome back, John Doe!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
