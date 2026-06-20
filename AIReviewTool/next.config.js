/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 忽略 TypeScript 的类型构建错误
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig