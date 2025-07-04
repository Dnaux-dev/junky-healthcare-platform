"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Users,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Search,
  User,
  LogOut,
  Bell,
  Settings,
  AlertTriangle,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const API_BASE_URL = "https://junky-f7rm.onrender.com"

interface PatientVerification {
  _id: string
  patient: {
    name: string
    age: number
    email: string
  }
  title: string
  amount: number
  urgency: "low" | "medium" | "high" | "critical"
  status: "pending_verification" | "verified" | "rejected"
  description: string
  documents: string[]
  createdAt: string
}

export default function HospitalDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [pendingVerifications, setPendingVerifications] = useState<PatientVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for demonstration
  const mockVerifications: PatientVerification[] = [
    {
      _id: "1",
      patient: { name: "Sarah Mitchell", age: 7, email: "sarah.m@email.com" },
      title: "Congenital Heart Defect Surgery",
      amount: 45000,
      urgency: "critical",
      status: "pending_verification",
      description:
        "Patient requires immediate surgical intervention for congenital heart defect. Surgery scheduled pending funding approval.",
      documents: ["medical_report.pdf", "cardiologist_assessment.pdf"],
      createdAt: "2025-01-04T10:30:00Z",
    },
    {
      _id: "2",
      patient: { name: "Michael Rodriguez", age: 34, email: "michael.r@email.com" },
      title: "Acute Leukemia Treatment",
      amount: 78000,
      urgency: "high",
      status: "pending_verification",
      description: "Patient diagnosed with acute lymphoblastic leukemia. Immediate chemotherapy treatment required.",
      documents: ["blood_work.pdf", "oncology_report.pdf"],
      createdAt: "2025-01-04T09:15:00Z",
    },
    {
      _id: "3",
      patient: { name: "Elena Kowalski", age: 52, email: "elena.k@email.com" },
      title: "Spinal Fusion Surgery",
      amount: 32000,
      urgency: "medium",
      status: "verified",
      description: "Patient requires spinal fusion surgery for severe degenerative disc disease.",
      documents: ["mri_scan.pdf", "orthopedic_evaluation.pdf"],
      createdAt: "2025-01-03T14:20:00Z",
    },
  ]

  const hospitalStats = {
    pendingVerifications: 12,
    verifiedPatients: 45,
    totalFunding: 234000,
    successfulTreatments: 38,
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "hospital") {
      router.push("/auth")
      return
    }

    setUser(parsedUser)
    // Use mock data for now
    setPendingVerifications(mockVerifications)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleVerifyPatient = async (patientId: string, action: "verify" | "reject") => {
    // Mock verification action
    setPendingVerifications((prev) =>
      prev.map((patient) =>
        patient._id === patientId ? { ...patient, status: action === "verify" ? "verified" : "rejected" } : patient,
      ),
    )
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
      case "pending_verification":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "verified":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const filteredVerifications = pendingVerifications.filter(
    (verification) =>
      verification.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="w-8 h-8 text-black" />
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    JUNKY
                  </span>
                </Link>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Hospital Dashboard</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-300">{user?.name || "Hospital"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Hospital Management Portal</h1>
          <p className="text-gray-400 text-sm sm:text-base">Verify patient applications and manage treatment funding</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Pending Verifications</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{hospitalStats.pendingVerifications}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Verified Patients</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{hospitalStats.verifiedPatients}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Total Funding</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">${hospitalStats.totalFunding.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Successful Treatments</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{hospitalStats.successfulTreatments}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="verifications" className="space-y-4 sm:space-y-6">
            <TabsList className="bg-gray-800 border-gray-700 w-full sm:w-auto">
              <TabsTrigger
                value="verifications"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm"
              >
                Patient Verifications
              </TabsTrigger>
              <TabsTrigger
                value="treatments"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm"
              >
                Active Treatments
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black text-xs sm:text-sm"
              >
                Resource Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verifications" className="space-y-4 sm:space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search patients or conditions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>

              {/* Verification Queue */}
              <div className="space-y-3 sm:space-y-4">
                {filteredVerifications.map((verification) => (
                  <Card key={verification._id} className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold">
                            {verification.patient.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{verification.patient.name}</h3>
                            <p className="text-sm text-gray-400">
                              {verification.patient.age} years old • {verification.patient.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getUrgencyColor(verification.urgency)}>
                            {verification.urgency.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(verification.status)}>
                            {verification.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">{verification.title}</h4>
                        <p className="text-gray-300 text-sm mb-3">{verification.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-yellow-400">
                            ${verification.amount.toLocaleString()}
                          </span>
                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied {new Date(verification.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Medical Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {verification.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                              <FileText className="w-3 h-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {verification.status === "pending_verification" && (
                        <div className="flex items-center space-x-3">
                          <Button
                            onClick={() => handleVerifyPatient(verification._id, "verify")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify & Approve
                          </Button>
                          <Button
                            onClick={() => handleVerifyPatient(verification._id, "reject")}
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Request More Info
                          </Button>
                          <Button
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            View Full Details
                          </Button>
                        </div>
                      )}

                      {verification.status === "verified" && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold">Verified and approved for funding</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Active Treatments</h2>
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Active Treatment Management</h3>
                  <p className="text-gray-400">Monitor ongoing treatments and report patient outcomes</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Resource Management</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Facility Capacity</CardTitle>
                    <CardDescription className="text-gray-400">
                      Current availability and resource allocation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Available Beds</span>
                      <span className="text-white font-semibold">23/50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Surgery Rooms</span>
                      <span className="text-white font-semibold">3/8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">ICU Capacity</span>
                      <span className="text-white font-semibold">12/20</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Specialist Availability</CardTitle>
                    <CardDescription className="text-gray-400">
                      Medical specialist schedules and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-center py-8">
                      Specialist scheduling system integration coming soon
                    </p>
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
