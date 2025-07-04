"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Zap, ArrowRight, CheckCircle, Star, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-900 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              JUNKY
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
              How It Works
            </a>
            <a href="#impact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Impact
            </a>
            <a href="#programs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Programs
            </a>
            <a href="#case-studies" className="text-gray-600 hover:text-blue-600 transition-colors">
              Case Studies
            </a>
          </div>
          <Link href="/auth">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent" style={{ y }} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 bg-blue-600/20 text-blue-600 border-blue-600/30">
              AI-Powered Healthcare Funding
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent">
              Get Medical Treatment
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Funded by Community
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary blockchain platform connecting patients with donors through AI-powered assessment,
              transparent funding, and community governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth?role=patient">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold px-8 py-4 text-lg"
                >
                  Apply for Funding
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth?role=donor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg bg-transparent"
                >
                  Start Donating
                  <Heart className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-600/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "12,547", label: "Patients Helped", icon: Users },
              { number: "$2.4M", label: "Total Donated", icon: TrendingUp },
              { number: "156", label: "Partner Hospitals", icon: Shield },
              { number: "94%", label: "Success Rate", icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              How JUNKY Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our revolutionary 3-step process ensures transparent, efficient, and secure medical funding
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Patients Apply",
                description:
                  "Patients submit applications with medical documentation. Our AI system assesses urgency and medical necessity.",
                icon: Users,
                features: ["AI-powered assessment", "Medical verification", "Urgency prioritization"],
              },
              {
                step: "02",
                title: "Community Votes",
                description:
                  "DAO community members review cases and vote on funding allocation based on transparent criteria.",
                icon: Shield,
                features: ["Decentralized governance", "Transparent voting", "Community consensus"],
              },
              {
                step: "03",
                title: "Automatic Funding",
                description:
                  "Smart contracts automatically transfer funds to verified hospitals for approved treatments.",
                icon: Zap,
                features: ["Blockchain security", "Instant transfers", "Full transparency"],
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="text-6xl font-bold text-blue-600/20 mr-4">{step.step}</div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-2">
                      {step.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Our Programs
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized funding programs targeting different medical needs and demographics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Emergency Care",
                description: "Immediate funding for life-threatening conditions requiring urgent treatment.",
                amount: "$500K+",
                patients: "2,847",
                color: "from-red-500 to-red-600",
                icon: "🚨",
              },
              {
                title: "Pediatric Care",
                description: "Specialized program for children requiring medical treatment and surgery.",
                amount: "$750K+",
                patients: "1,923",
                color: "from-blue-500 to-blue-600",
                icon: "👶",
              },
              {
                title: "Cancer Treatment",
                description: "Comprehensive funding for cancer patients including chemotherapy and surgery.",
                amount: "$1.2M+",
                patients: "3,456",
                color: "from-purple-500 to-purple-600",
                icon: "🎗️",
              },
              {
                title: "Rare Diseases",
                description: "Support for patients with rare conditions requiring specialized treatment.",
                amount: "$300K+",
                patients: "567",
                color: "from-green-500 to-green-600",
                icon: "🧬",
              },
              {
                title: "Mental Health",
                description: "Funding for mental health treatment and therapy programs.",
                amount: "$200K+",
                patients: "1,234",
                color: "from-teal-500 to-teal-600",
                icon: "🧠",
              },
              {
                title: "Rehabilitation",
                description: "Post-treatment rehabilitation and physical therapy funding.",
                amount: "$400K+",
                patients: "2,100",
                color: "from-orange-500 to-orange-600",
                icon: "🏃",
              },
            ].map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 h-full hover:border-yellow-400/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{program.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{program.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{program.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <div
                          className={`text-lg font-bold bg-gradient-to-r ${program.color} bg-clip-text text-transparent`}
                        >
                          {program.amount}
                        </div>
                        <div className="text-xs text-gray-400">Total Funded</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">{program.patients}</div>
                        <div className="text-xs text-gray-400">Patients Helped</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real stories from patients whose lives were transformed through community support
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                age: 7,
                condition: "Congenital Heart Defect",
                funded: "$45,000",
                outcome: "Successful surgery, full recovery",
                story:
                  "Sarah needed urgent heart surgery that her family couldn't afford. The JUNKY community rallied together and funded her treatment in just 48 hours.",
                rating: 5,
              },
              {
                name: "Michael R.",
                age: 34,
                condition: "Leukemia Treatment",
                funded: "$78,000",
                outcome: "In remission, returning to work",
                story:
                  "Michael's cancer treatment was funded through our AI-prioritized system, allowing him to receive life-saving chemotherapy immediately.",
                rating: 5,
              },
              {
                name: "Elena K.",
                age: 52,
                condition: "Spinal Surgery",
                funded: "$32,000",
                outcome: "Walking again, pain-free",
                story:
                  "After years of chronic pain, Elena received the spinal surgery she needed thanks to transparent community funding.",
                rating: 5,
              },
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-lg">
                        {story.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-white">
                          {story.name}, {story.age}
                        </div>
                        <div className="text-sm text-gray-400">{story.condition}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        {story.funded} Funded
                      </Badge>
                      <div className="flex">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{story.story}</p>

                    <div className="border-t border-gray-700 pt-4">
                      <div className="text-sm font-semibold text-green-400">Outcome:</div>
                      <div className="text-sm text-gray-300">{story.outcome}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400/10 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of people who are transforming healthcare funding through blockchain technology and
              community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth?role=patient">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold px-8 py-4 text-lg"
                >
                  Apply for Funding
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth?role=donor">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg bg-transparent"
                >
                  Start Donating
                  <Heart className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth?role=hospital">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 px-8 py-4 text-lg bg-transparent"
                >
                  Partner Hospital
                  <Shield className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-black" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  JUNKY
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing healthcare funding through AI, blockchain, and community governance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Transparency
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    DAO Governance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400 transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 JUNKY. All rights reserved. Built with ❤️ for healthcare accessibility.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
