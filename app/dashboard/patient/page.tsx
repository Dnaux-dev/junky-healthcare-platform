"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, FileText, DollarSign, Clock, CheckCircle, Plus, LogOut, Bell, Settings, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = "https://junky-f7rm.onrender.com"

interface Application {
  _id: string
  title: string
  amount: number
  urgency: "low" | "medium" | "high" | "critical"
  status: "pending" | "under_review" | "approved" | "funded" | "rejected"
  createdAt: string
  documents: string[]
}

interface DashboardStats {
  applications: number
  donationsReceived: number
}

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [stats, setStats] = useState<DashboardStats>({ applications: 0, donationsReceived: 0 })
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showApplyModal, setShowApplyModal] = useState(false)
  // Form state for modal
  const [formTitle, setFormTitle] = useState("")
  const [formAmount, setFormAmount] = useState("")
  const [formUrgency, setFormUrgency] = useState("medium")
  const [formDocuments, setFormDocuments] = useState<FileList | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "patient") {
      router.push("/auth")
      return
    }

    setUser(parsedUser)
    fetchDashboardData(token)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      // Fetch dashboard overview
      const dashboardResponse = await fetch(`${API_BASE_URL}/api/patient/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json()
        setStats(dashboardData.stats)
        setUser(dashboardData.user) // Set user from API response
        console.log('User set from API:', dashboardData.user)
      }

      // Fetch applications
      const applicationsResponse = await fetch(`${API_BASE_URL}/api/patient/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json()
        setApplications(applicationsData.applications)
      }
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError("")
    const token = localStorage.getItem("token")
    if (!token) {
      setFormError("You must be logged in to apply.")
      setFormLoading(false)
      return
    }
    try {
      const formData = new FormData()
      formData.append("title", formTitle)
      formData.append("amount", formAmount)
      formData.append("urgency", formUrgency)
      if (formDocuments && formDocuments.length > 0) {
        for (let i = 0; i < formDocuments.length; i++) {
          formData.append("documents", formDocuments[i])
        }
      }
      const res = await fetch(`${API_BASE_URL}/api/patient/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })
      if (res.ok) {
        setShowApplyModal(false)
        setFormTitle("")
        setFormAmount("")
        setFormUrgency("medium")
        setFormDocuments(null)
        // Optionally, refresh applications list
        fetchDashboardData(token)
      } else {
        const data = await res.json()
        setFormError(data.message || "Failed to create application.")
      }
    } catch (err) {
      setFormError("Failed to create application.")
    } finally {
      setFormLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "under_review":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "funded":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex flex-col lg:flex-row">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:flex bg-gray-950 border-r border-gray-800 w-64 p-4 space-y-4 flex-col">
        <Link href="/" className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            JUNKY
          </span>
        </Link>
        <Link href="/dashboard/patient">
          <Button variant="ghost" className="w-full justify-start mb-2">
            <FileText className="w-4 h-4 mr-2" /> Applications
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => setShowApplyModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Application
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <DollarSign className="w-4 h-4 mr-2" /> Donations
        </Button>
        <Button variant="ghost" className="w-full justify-start mb-2">
          <Settings className="w-4 h-4 mr-2" /> Profile
        </Button>
        <Button variant="ghost" className="w-full justify-start mt-auto" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center space-x-2 lg:hidden">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                      JUNKY
                    </span>
                  </Link>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Patient Dashboard</Badge>
                </div>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowApplyModal(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Settings className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 hidden sm:block">{user?.name || "Patient"}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1">
          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back, {user?.name?.split(" ")[0] || "Patient"}</h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your medical funding applications and track your progress</p>
          </motion.div>
          {/* Application Modal */}
          <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Medical Funding Application</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleApplySubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    required
                    placeholder="e.g. Heart Surgery"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount Needed (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formAmount}
                    onChange={e => setFormAmount(e.target.value)}
                    required
                    min={1}
                    placeholder="e.g. 1000000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select value={formUrgency} onValueChange={setFormUrgency}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    onChange={e => setFormDocuments(e.target.files)}
                    className="mt-1"
                  />
                </div>
                {formError && <div className="text-red-400 text-sm">{formError}</div>}
                <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700" disabled={formLoading}>
                  {formLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Total Applications</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.applications}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Donations Received</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">${stats.donationsReceived.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Success Rate</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">85%</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="applications" className="space-y-4 sm:space-y-6">
              <TabsList className="bg-gray-800 border-gray-700 w-full sm:w-auto">
                <TabsTrigger
                  value="applications"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm"
                >
                  My Applications
                </TabsTrigger>
                <TabsTrigger
                  value="donations"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm"
                >
                  Donations Received
                </TabsTrigger>
                <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm">
                  Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Your Applications</h2>
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 w-full sm:w-auto" onClick={() => setShowApplyModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>

                {applications.length === 0 ? (
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                    <CardContent className="p-6 sm:p-12 text-center">
                      <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Applications Yet</h3>
                      <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                        Start your journey by submitting your first medical funding application
                      </p>
                      <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 w-full sm:w-auto" onClick={() => setShowApplyModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Application
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {applications.map((application) => (
                      <Card key={application._id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 sm:mb-4">
                            <div className="flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{application.title}</h3>
                              <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
                                <Badge className={getStatusColor(application.status)}>
                                  {application.status.replace("_", " ").toUpperCase()}
                                </Badge>
                                <Badge className={getUrgencyColor(application.urgency)}>
                                  {application.urgency.toUpperCase()} PRIORITY
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl sm:text-2xl font-bold text-yellow-400">${application.amount.toLocaleString()}</p>
                              <p className="text-xs sm:text-sm text-gray-400">Requested</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-2">
                              <span>Funding Progress</span>
                              <span>0% Complete</span>
                            </div>
                            <Progress value={0} className="h-2 bg-gray-700" />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex items-center text-xs sm:text-sm text-gray-400">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent w-full sm:w-auto"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="donations" className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Donations Received</h2>
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardContent className="p-6 sm:p-12 text-center">
                    <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No Donations Yet</h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Once your applications are approved and funded, donations will appear here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4 sm:space-y-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Profile Settings</h2>
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Personal Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <p className="text-white">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Role</label>
                        <p className="text-white capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent w-full sm:w-auto">
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
