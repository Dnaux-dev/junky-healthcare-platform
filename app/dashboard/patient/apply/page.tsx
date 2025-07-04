"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/AuthContext";

const API_BASE_URL = "https://junky-f7rm.onrender.com"

export default function ApplyPage() {
  const router = useRouter()
  const { token } = useAuth();
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [urgency, setUrgency] = useState("medium")
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (!token) {
      setError("You must be logged in to apply.")
      setLoading(false)
      return
    }
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("amount", amount)
      formData.append("urgency", urgency)
      if (documents && documents.length > 0) {
        for (let i = 0; i < documents.length; i++) {
          formData.append("documents", documents[i])
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
        router.push("/dashboard/patient")
      } else {
        const data = await res.json()
        setError(data.message || "Failed to create application.")
      }
    } catch (err) {
      setError("Failed to create application.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
      <Card className="w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">New Medical Funding Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min={1}
                placeholder="e.g. 1000000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency}>
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
                onChange={e => setDocuments(e.target.files)}
                className="mt-1"
              />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 