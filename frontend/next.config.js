/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_FLASK_URL: process.env.NEXT_PUBLIC_FLASK_URL,
    NEXT_PUBLIC_S3_BASE_URL: process.env.NEXT_PUBLIC_S3_BASE_URL,
  },
  images: {
    domains: [
      'i.ytimg.com',
      'images.unsplash.com',
      'dam.mediacorp.sg', // ← Add this since it caused the crash
      // Add other safe user-submitted domains here
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Optional: match all remote hosts (⚠️ be careful)
      },
    ],
  },
}

module.exports = nextConfig