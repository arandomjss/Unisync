/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/profile/:path*',
                destination: '/api/proxy?path=/profile/:path*',
            },
            {
                source: '/dashboard/:path*',
                destination: '/api/proxy?path=/dashboard/:path*',
            },
            {
                source: '/admin/:path*',
                destination: '/api/proxy?path=/admin/:path*',
            },
            {
                source: '/club/:path*',
                destination: '/api/proxy?path=/club/:path*',
            },
            {
                source: '/events/:path*',
                destination: '/api/proxy?path=/events/:path*',
            },
        ];
    },
};

export default nextConfig;
