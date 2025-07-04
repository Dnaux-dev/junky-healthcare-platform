"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  CheckCircle,
  User,
  LogOut,
  Bell,
  Settings,
  Activity,
  Database,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const API_BASE_URL = "https://junky-f7rm.onrender.com"

interface SystemStats {
  totalUsers: number
  totalPatients: number
  totalDonors: number
  totalHospitals: number
  totalFunding: number
  activeApplications: number
  successRate: number
  platformHealth: number
}

// 1. Add interfaces for admin data
interface Application {
  _id: string
  title: string
  amount: number
  urgency: string
  status: string
  patient: any
  createdAt: string
  documents: string[]
}
interface User {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  phone?: string
}
interface Hospital {
  _id: string
  name: string
  email: string
  verified: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // 2. Add state for admin data
  const [applications, setApplications] = useState<Application[]>([])
  const [patients, setPatients] = useState<User[]>([])
  const [donors, setDonors] = useState<User[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Mock system stats
  const systemStats: SystemStats = {
    totalUsers: 15847,
    totalPatients: 8923,
    totalDonors: 5234,
    totalHospitals: 156,
    totalFunding: 2400000,
    activeApplications: 234,
    successRate: 94,
    platformHealth: 98,
  }

  const recentActivity = [
    {
      id: "1",
      type: "application",
      message: "New patient application submitted",
      user: "Sarah M.",
      timestamp: "2 minutes ago",
      status: "pending",
    },
    {
      id: "2",
      type: "donation",
      message: "Donation of $500 received",
      user: "John D.",
      timestamp: "5 minutes ago",
      status: "completed",
    },
    {
      id: "3",
      type: "verification",
      message: "Hospital verified patient application",
      user: "City General Hospital",
      timestamp: "12 minutes ago",
      status: "verified",
    },
    {
      id: "4",
      type: "funding",
      message: "Treatment funding approved",
      user: "Michael R.",
      timestamp: "1 hour ago",
      status: "approved",
    },
  ]

  // 3. Fetch all admin data on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin" && parsedUser.role !== "super_admin") {
      router.push("/auth")
      return
    }

    setUser(parsedUser)
    setLoading(false)

    setDataLoading(true)
    setDataError("")
    Promise.all([
      fetch(`${API_BASE_URL}/api/admin/applications`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE_URL}/api/admin/patients`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE_URL}/api/admin/donors`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${API_BASE_URL}/api/admin/hospitals`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([a, p, d, h]) => {
        if (!a.ok || !p.ok || !d.ok || !h.ok) throw new Error("Failed to fetch admin data")
        const [apps, pats, dons, hosps] = await Promise.all([
          a.json(), p.json(), d.json(), h.json()
        ])
        setApplications(apps.applications || apps)
        setPatients(pats.patients || pats)
        setDonors(dons.donors || dons)
        setHospitals(hosps.hospitals || hosps)
      })
      .catch(() => setDataError("Failed to load admin data"))
      .finally(() => setDataLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  // 4. Approve/Decline application handlers
  const handleApprove = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) return
    setActionLoading(id + "-approve")
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/applications/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setApplications(applications => applications.map(app => app._id === id ? { ...app, status: "approved" } : app))
      }
    } finally {
      setActionLoading(null)
    }
  }
  const handleDecline = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) return
    setActionLoading(id + "-decline")
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/applications/${id}/decline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setApplications(applications => applications.map(app => app._id === id ? { ...app, status: "rejected" } : app))
      }
    } finally {
      setActionLoading(null)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return <Users className="w-4 h-4" />
      case "donation":
        return <DollarSign className="w-4 h-4" />
      case "verification":
        return <CheckCircle className="w-4 h-4" />
      case "funding":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400"
      case "completed":
        return "text-green-400"
      case "verified":
        return "text-blue-400"
      case "approved":
        return "text-purple-400"
      default:
        return "text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    JUNKY
                  </span>
                </Link>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Admin Dashboard</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300 hidden sm:block">{user?.name || "Admin"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">System Administration</h1>
          <p className="text-gray-400 text-sm sm:text-base">Monitor platform performance and manage system operations</p>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 text-green-400 mr-2" />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm sm:text-base">Overall System Status</span>
                <span className="text-green-400 font-semibold">{systemStats.platformHealth}%</span>
              </div>
              <Progress value={systemStats.platformHealth} className="h-3 bg-gray-700" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-green-400 font-semibold text-sm sm:text-base">API</div>
                  <div className="text-xs sm:text-sm text-gray-400">Operational</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold text-sm sm:text-base">Database</div>
                  <div className="text-xs sm:text-sm text-gray-400">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold text-sm sm:text-base">Blockchain</div>
                  <div className="text-xs sm:text-sm text-gray-400">Synced</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{systemStats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Partner Hospitals</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{systemStats.totalHospitals}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Funding</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">${(systemStats.totalFunding / 1000000).toFixed(1)}M</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Success Rate</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{systemStats.successRate}%</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                System Overview
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Applications
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                User Management
              </TabsTrigger>
              <TabsTrigger value="hospitals" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Hospital Verification
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-400">
                      Latest platform activities and transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.status)} bg-current/20`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.message}</p>
                          <p className="text-gray-400 text-xs">
                            {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                        <Badge className={`${getActivityColor(activity.status)} bg-current/20 border-current/30`}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* System Metrics */}
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Key Metrics</CardTitle>
                    <CardDescription className="text-gray-400">
                      Important platform performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Applications</span>
                      <span className="text-white font-semibold">{systemStats.activeApplications}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Daily Donations</span>
                      <span className="text-green-400 font-semibold">$12,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">New Registrations</span>
                      <span className="text-blue-400 font-semibold">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Pending Verifications</span>
                      <span className="text-yellow-400 font-semibold">23</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Applications</h2>
              {dataLoading ? (
                <div className="text-gray-400">Loading applications...</div>
              ) : dataError ? (
                <div className="text-red-400">{dataError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-800 text-gray-400">
                        <th className="p-2">Title</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Urgency</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Patient</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id} className="border-b border-gray-700">
                          <td className="p-2 text-white">{app.title}</td>
                          <td className="p-2 text-white">${app.amount.toLocaleString()}</td>
                          <td className="p-2">
                            <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                              {app.urgency}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${app.status === "approved" ? "bg-green-500/20 text-green-400 border-green-500/30" : app.status === "rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>{app.status}</span>
                          </td>
                          <td className="p-2 text-white">{app.patient?.firstName || app.patient?.name || "-"}</td>
                          <td className="p-2 text-white">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="p-2">
                            <Button size="sm" variant="outline" className="mr-2" disabled={actionLoading === app._id + "-approve" || app.status === "approved"} onClick={() => handleApprove(app._id)}>
                              {actionLoading === app._id + "-approve" ? "Approving..." : "Approve"}
                            </Button>
                            <Button size="sm" variant="destructive" disabled={actionLoading === app._id + "-decline" || app.status === "rejected"} onClick={() => handleDecline(app._id)}>
                              {actionLoading === app._id + "-decline" ? "Declining..." : "Decline"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              {dataLoading ? (
                <div className="text-gray-400">Loading users...</div>
              ) : dataError ? (
                <div className="text-red-400">{dataError}</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 text-red-400 mr-2" />
                        Patients
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead>
                            <tr className="bg-gray-800 text-gray-400">
                              <th className="p-2">Name</th>
                              <th className="p-2">Email</th>
                              <th className="p-2">Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            {patients.map(p => (
                              <tr key={p._id} className="border-b border-gray-700">
                                <td className="p-2 text-white">{p.firstName} {p.lastName}</td>
                                <td className="p-2 text-white">{p.email}</td>
                                <td className="p-2 text-white">{p.phone || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Users className="w-5 h-5 text-blue-400 mr-2" />
                        Donors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                          <thead>
                            <tr className="bg-gray-800 text-gray-400">
                              <th className="p-2">Name</th>
                              <th className="p-2">Email</th>
                              <th className="p-2">Phone</th>
                            </tr>
                          </thead>
                          <tbody>
                            {donors.map(d => (
                              <tr key={d._id} className="border-b border-gray-700">
                                <td className="p-2 text-white">{d.firstName} {d.lastName}</td>
                                <td className="p-2 text-white">{d.email}</td>
                                <td className="p-2 text-white">{d.phone || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hospitals" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Hospital Management</h2>
              {dataLoading ? (
                <div className="text-gray-400">Loading hospitals...</div>
              ) : dataError ? (
                <div className="text-red-400">{dataError}</div>
              ) : (
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Building2 className="w-5 h-5 text-green-400 mr-2" />
                      Hospitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-left">
                        <thead>
                          <tr className="bg-gray-800 text-gray-400">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Verified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {hospitals.map(h => (
                            <tr key={h._id} className="border-b border-gray-700">
                              <td className="p-2 text-white">{h.name}</td>
                              <td className="p-2 text-white">{h.email}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${h.verified ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}>{h.verified ? "Verified" : "Pending"}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Platform Analytics</h2>
              {/* Example chart: Application status breakdown */}
              <div className="bg-gray-900 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Application Status Breakdown</h3>
                <div className="flex items-center space-x-8">
                  {(() => {
                    const statusCounts: Record<string, number> = {}
                    applications.forEach(app => {
                      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1
                    })
                    const total = applications.length || 1
                    return Object.entries(statusCounts).map(([status, count]) => (
                      <div key={status} className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-white">{Math.round((count / total) * 100)}%</span>
                        <span className="text-gray-400 text-sm capitalize">{status}</span>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
