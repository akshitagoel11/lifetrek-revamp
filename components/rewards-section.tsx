"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Award, Gift, Copy, Check, Star } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Voucher } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function RewardsSection() {
  const [totalXP, setTotalXP] = useLocalStorage("totalXP", 0)
  const [vouchers, setVouchers] = useLocalStorage<Voucher[]>("vouchers", [])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const XP_TO_VOUCHER = 50

  const xpToNext = XP_TO_VOUCHER - (totalXP % XP_TO_VOUCHER) || XP_TO_VOUCHER
  const progress = ((XP_TO_VOUCHER - xpToNext) / XP_TO_VOUCHER) * 100

  const handleGenerateVoucher = () => {
    if (totalXP >= XP_TO_VOUCHER) {
      const voucherCode = `AMZN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      const newVoucher: Voucher = {
        id: Date.now().toString(),
        code: voucherCode,
        date: new Date().toISOString(),
        used: false,
      }

      setVouchers([...vouchers, newVoucher])
      setTotalXP(totalXP - XP_TO_VOUCHER)
    }
  }

  const handleCopyVoucher = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRedeemVoucher = (id: string) => {
    setVouchers(vouchers.map((voucher) => (voucher.id === id ? { ...voucher, used: true } : voucher)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Simulate earning XP
  useEffect(() => {
    const earnXP = () => {
      setTotalXP((prev) => prev + 1)
    }

    const interval = setInterval(earnXP, 30000) // Earn 1 XP every 30 seconds
    return () => clearInterval(interval)
  }, [])

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
        <h1 className="text-3xl font-bold">Rewards</h1>
        <p className="text-muted-foreground">Earn XP and redeem rewards for your learning achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>XP Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{totalXP}</div>
                      <div className="text-sm text-muted-foreground">Total XP</div>
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-gray-200 dark:text-gray-700"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-orange-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="url(#gradient)"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>XP to Next Voucher</span>
                    <span>{xpToNext} XP</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2"
                    indicatorClassName="bg-gradient-to-r from-orange-500 to-rose-500"
                  />
                </div>

                <Button
                  onClick={handleGenerateVoucher}
                  disabled={totalXP < XP_TO_VOUCHER}
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {totalXP >= XP_TO_VOUCHER ? "Convert to Voucher" : `Need ${xpToNext} more XP`}
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <h3 className="text-lg font-semibold">How to Earn XP</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                    <span>Complete tasks: +10 XP</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                    <span>Daily login streak: +5 XP</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                    <span>Add new skills: +15 XP</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5" />
                    <span>Study time (30 min): +5 XP</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20">
              <CardTitle>Your Vouchers</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {vouchers.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Vouchers Yet</h3>
                  <p className="text-muted-foreground mb-4">Complete tasks and earn XP to get your first voucher!</p>
                  <Button
                    onClick={() => setTotalXP(totalXP + 10)}
                    className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"
                  >
                    Earn 10 XP (Demo)
                  </Button>
                </div>
              ) : (
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {vouchers.map((voucher) => (
                    <motion.div key={voucher.id} variants={item}>
                      <Card
                        className={cn(
                          "overflow-hidden transition-all",
                          voucher.used
                            ? "bg-gray-100 dark:bg-gray-800/50"
                            : "bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-950/20 dark:to-rose-950/20",
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center">
                                <Gift
                                  className={cn("h-5 w-5 mr-2", voucher.used ? "text-gray-400" : "text-orange-500")}
                                />
                                <h3 className={cn("font-medium", voucher.used && "text-muted-foreground")}>
                                  Amazon Gift Card
                                </h3>
                              </div>
                              <div className="flex items-center mt-1">
                                <code
                                  className={cn(
                                    "font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded",
                                    voucher.used && "line-through text-muted-foreground",
                                  )}
                                >
                                  {voucher.code}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCopyVoucher(voucher.id, voucher.code)}
                                  disabled={voucher.used}
                                  className="h-7 w-7 ml-2"
                                >
                                  {copiedId === voucher.id ? (
                                    <Check className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Generated: {formatDate(voucher.date)} • Valid for 30 days
                              </div>
                            </div>
                            <Button
                              onClick={() => handleRedeemVoucher(voucher.id)}
                              disabled={voucher.used}
                              className={cn(
                                "whitespace-nowrap",
                                !voucher.used &&
                                  "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600",
                              )}
                            >
                              {voucher.used ? "Redeemed" : "Mark as Redeemed"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <Award className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Achievement Badges</h3>
                    <p className="text-sm text-muted-foreground">Unlock special badges for your profile</p>
                  </div>
                </div>
                <Button className="w-full mt-4">View Badges</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <Gift className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">Premium Content</h3>
                    <p className="text-sm text-muted-foreground">Unlock premium learning resources</p>
                  </div>
                </div>
                <Button className="w-full mt-4">Explore Premium</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
