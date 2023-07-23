/** @type {import('next').NextConfig} */

const nextConfig = {
	async redirects() {
    return [
      // {
      //   source: '/',
      //   destination: '/write', // Matched parameters can be used in the destination
      //   permanent: false,
      // },
    ]
  },
}

module.exports = nextConfig
