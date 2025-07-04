"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Heart,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  UserIcon,
  LogOut,
  Bell,
  Settings,
  Star,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const API_BASE_URL = "https://junky-f7rm.onrender.com"

interface DonorUser {
  id: string
  name: string
  email: string
  role: string
}

interface PatientCase {
  _id: string
  patient: {
    name: string
    age: number
  }
  title: string
  amount: number
  urgency: "low" | "medium" | "high" | "critical"
  status: "pending" | "approved" | "funded"
  description: string
  raised: number
  location: string
  createdAt: string
}

export default function DonorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DonorUser | null>(null)
  const [patientCases, setPatientCases] = useState<PatientCase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock data for demonstration
  const mockPatientCases: PatientCase[] = [
    {
      _id: "1",
      patient: { name: "Sarah M.", age: 7 },
      title: "Heart Surgery for Sarah",
      amount: 45000,
      urgency: "critical",
      status: "pending",
      description: "Sarah needs urgent heart surgery to correct a congenital defect. Time is critical.",
      raised: 32000,
      location: "New York, NY",
      createdAt: "2025-01-01T00:00:00Z",
    },
    {
      _id: "2",
      patient: { name: "Michael R.", age: 34 },
      title: "Leukemia Treatment",
      amount: 78000,
      urgency: "high",
      status: "approved",
      description: "Michael requires immediate chemotherapy treatment for acute leukemia.",
      raised: 45000,
      location: "Los Angeles, CA",
      createdAt: "2025-01-02T00:00:00Z",
    },
    {
      _id: "3",
      patient: { name: "Elena K.", age: 52 },
      title: "Spinal Surgery",
      amount: 32000,
      urgency: "medium",
      status: "funded",
      description: "Elena needs spinal surgery to regain mobility and reduce chronic pain.",
      raised: 32000,
      location: "Chicago, IL",
      createdAt: "2025-01-03T00:00:00Z",
    },
  ]

  const donorStats = {
    totalDonated: 2450,
    patientsHelped: 8,
    successRate: 94,
    monthlyImpact: 1200,
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "donor") {
      router.push("/auth")
      return
    }

    setUser(parsedUser)
    // Use mock data for now
    setPatientCases(mockPatientCases)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "approved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "funded":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredCases = patientCases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || case_.urgency === selectedFilter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                JUNKY
              </span>
            </Link>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Donor Dashboard</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-300">{user?.name || "Donor"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(" ")[0] || "Donor"}</h1>
          <p className="text-gray-400">Continue making a difference in patients' lives through your generous support</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Donated</p>
                  <p className="text-2xl font-bold text-white">${donorStats.totalDonated.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Patients Helped</p>
                  <p className="text-2xl font-bold text-white">{donorStats.patientsHelped}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{donorStats.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Impact</p>
                  <p className="text-2xl font-bold text-white">${donorStats.monthlyImpact.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
              >
                Discover Patients
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Donation History
              </TabsTrigger>
              <TabsTrigger value="impact" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                My Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search patients or conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                  >
                    <option value="all">All Urgency</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              {/* Patient Cases */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((case_) => (
                  <Card
                    key={case_._id}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                            {case_.patient.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{case_.patient.name}</h3>
                            <p className="text-sm text-gray-400">{case_.patient.age} years old</p>
                          </div>
                        </div>
                        <Badge className={getUrgencyColor(case_.urgency)}>{case_.urgency.toUpperCase()}</Badge>
                      </div>

                      <h4 className="text-lg font-semibold text-white mb-2">{case_.title}</h4>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{case_.description}</p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                          <span>Funding Progress</span>
                          <span>{Math.round((case_.raised / case_.amount) * 100)}%</span>
                        </div>
                        <Progress value={(case_.raised / case_.amount) * 100} className="h-2 bg-gray-700" />
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-green-400">${case_.raised.toLocaleString()} raised</span>
                          <span className="text-gray-400">of ${case_.amount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          {case_.location}
                        </div>
                        <Badge className={getStatusColor(case_.status)}>{case_.status.toUpperCase()}</Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                          Donate Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                        >
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Donation History</h2>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardContent className="p-12 text-center">
                  <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Your Donation History</h3>
                  <p className="text-gray-400 mb-6">Track all your contributions and see the impact you've made</p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700">
                    View Full History
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Your Impact</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-2" />
                      Impact Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Lives Touched</span>
                      <span className="text-white font-semibold">{donorStats.patientsHelped}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-green-400 font-semibold">{donorStats.successRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Donation</span>
                      <span className="text-white font-semibold">
                        ${Math.round(donorStats.totalDonated / donorStats.patientsHelped)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Thank You Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-center py-8">Thank you messages from patients will appear here</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
