"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Building2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const API_BASE_URL = "https://junky-f7rm.onrender.com"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")
  const [selectedRole, setSelectedRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError] = useState("")

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: "",
  })

  // Admin login form state
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam) {
      setSelectedRole(roleParam)
      setLoginData((prev) => ({ ...prev, role: roleParam }))
      setRegisterData((prev) => ({ ...prev, role: roleParam }))
    }
  }, [searchParams])

  const roleOptions = [
    {
      value: "patient",
      label: "Patient",
      description: "Apply for medical funding",
      icon: Heart,
      color: "from-red-500 to-red-600",
    },
    {
      value: "donor",
      label: "Donor",
      description: "Support patients in need",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      value: "hospital",
      label: "Hospital",
      description: "Verify and treat patients",
      icon: Building2,
      color: "from-green-500 to-green-600",
    },
    {
      value: "admin",
      label: "Administrator",
      description: "Manage platform operations",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirect based on role
        switch (data.user.role) {
          case "patient":
            router.push("/dashboard/patient")
            break
          case "donor":
            router.push("/dashboard/donor")
            break
          case "hospital":
            router.push("/dashboard/hospital")
            break
          case "admin":
            router.push("/dashboard/admin")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Redirect based on role
        switch (data.user.role) {
          case "patient":
            router.push("/dashboard/patient")
            break
          case "donor":
            router.push("/dashboard/donor")
            break
          case "hospital":
            router.push("/dashboard/hospital")
            break
          case "admin":
            router.push("/dashboard/admin")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdminLoading(true)
    setAdminError("")

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      })

      const data = await response.json()

      if (response.ok && data.status === "success" && data.data) {
        // Store admin token and user data
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.admin))

        // Redirect to admin dashboard
        router.push("/dashboard/admin")
      } else {
        setAdminError(data.message || "Admin login failed")
      }
    } catch (err) {
      setAdminError("Network error. Please try again.")
    } finally {
      setAdminLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-black" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              JUNKY
            </span>
          </div>
          <p className="text-gray-400">Join the healthcare funding revolution</p>
        </div>

        {/* Role Selection */}
        {!selectedRole && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h3 className="text-xl font-semibold text-center mb-6">Choose Your Role</h3>
            <div className="grid grid-cols-2 gap-4">
              {roleOptions.map((role) => (
                <Card
                  key={role.value}
                  className="bg-gray-900 border-gray-700 hover:border-yellow-400/50 cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setSelectedRole(role.value)
                    setLoginData((prev) => ({ ...prev, role: role.value }))
                    setRegisterData((prev) => ({ ...prev, role: role.value }))
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${role.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                    >
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">{role.label}</h4>
                    <p className="text-xs text-gray-400">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Auth Forms */}
        {selectedRole && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {roleOptions.find((r) => r.value === selectedRole) && (
                    <>
                      <div
                        className={`w-8 h-8 bg-gradient-to-r ${roleOptions.find((r) => r.value === selectedRole)?.color} rounded-lg flex items-center justify-center mr-2`}
                      >
                        {(() => {
                          const roleOption = roleOptions.find((r) => r.value === selectedRole)
                          if (roleOption) {
                            const IconComponent = roleOption.icon
                            return <IconComponent className="w-4 h-4 text-white" />
                          }
                          return null
                        })()}
                      </div>
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                        {roleOptions.find((r) => r.value === selectedRole)?.label}
                      </Badge>
                    </>
                  )}
                </div>
                <CardTitle className="text-white">Welcome</CardTitle>
                <CardDescription className="text-gray-400">
                  {activeTab === "login" ? "Sign in to your account" : "Create your account"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {error && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={loginData.password}
                            onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold"
                        disabled={loading}
                      >
                        {loading ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={registerData.firstName}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={registerData.lastName}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-300">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={registerData.phone}
                          onChange={(e) => setRegisterData((prev) => ({ ...prev, phone: e.target.value }))}
                          className="bg-gray-800 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password" className="text-gray-300">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={registerData.password}
                            onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                            className="bg-gray-800 border-gray-600 text-white pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold"
                        disabled={loading}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedRole("");
                      setLoginData({ email: "", password: "", role: "" });
                      setRegisterData({ email: "", password: "", firstName: "", lastName: "", phone: "", role: "" });
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                    }}
                    className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Change Role
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Super Admin Login Section */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <div className="text-center">
          <button
            onClick={() => setShowAdminLogin(!showAdminLogin)}
            className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center mx-auto space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>Super Admin Access</span>
          </button>
        </div>

        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Card className="bg-gray-900 border-purple-700">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Super Admin
                  </Badge>
                </div>
                <CardTitle className="text-white">Administrator Access</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to manage platform operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adminError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {adminError}
                  </div>
                )}

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-email" className="text-gray-300">
                      Admin Email
                    </Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData((prev) => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-password" className="text-gray-300">
                      Admin Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={adminData.password}
                        onChange={(e) => setAdminData((prev) => ({ ...prev, password: e.target.value }))}
                        className="bg-gray-800 border-gray-600 text-white pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 font-semibold"
                    disabled={adminLoading}
                  >
                    {adminLoading ? "Signing In..." : "Sign In as Super Admin"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
