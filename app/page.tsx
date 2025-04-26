"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp } from "lucide-react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import DashboardSection from "@/components/dashboard-section"
import SkillsSection from "@/components/skills-section"
import TasksSection from "@/components/tasks-section"
import ResourcesSection from "@/components/resources-section"
import CalendarSection from "@/components/calendar-section"
import SocialSection from "@/components/social-section"
import AnalyticsSection from "@/components/analytics-section"
import RewardsSection from "@/components/rewards-section"
import FinancialSection from "@/components/financial-section"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />
      case "skills":
        return <SkillsSection />
      case "tasks":
        return <TasksSection />
      case "resources":
        return <ResourcesSection />
      case "calendar":
        return <CalendarSection />
      case "social":
        return <SocialSection />
      case "analytics":
        return <AnalyticsSection />
      case "rewards":
        return <RewardsSection />
      case "financial":
        return <FinancialSection />
      default:
        return <DashboardSection />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main ref={mainRef} className="container mx-auto px-4 py-20 md:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              size="icon"
              className="rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
              onClick={scrollToTop}
            >
              <ChevronUp className="h-5 w-5" />
              <span className="sr-only">Scroll to top</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
