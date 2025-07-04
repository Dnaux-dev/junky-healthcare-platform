import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: 'Junky Healthcare Platform',
  description: 'A comprehensive healthcare platform for patients, hospitals, and donors',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
