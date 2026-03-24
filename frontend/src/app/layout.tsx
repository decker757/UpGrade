import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UpGrade - University Tutoring & Notes Platform',
  description: 'Connect with expert tutors and access comprehensive study notes for university modules',
  openGraph: {
    title: 'UpGrade - Built with ChatAndBuild',
    description: 'Connect with expert tutors and access comprehensive study notes for university modules',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpGrade - Built with ChatAndBuild',
    description: 'Connect with expert tutors and access comprehensive study notes for university modules',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
    site: '@chatandbuild',
  },
  keywords: 'no-code, app builder, conversation-driven development, education platform, tutoring, university notes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
