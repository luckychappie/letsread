const nextConfig = {


  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  //output: 'export',
  // reactStrictMode: true,
  // swcMinify: true,
  images: {
    unoptimized: true
  },

  // distDir: 'dist',
}


export default nextConfig;