/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '/static/uploads/confectioneries/**',
            }
        ]
    }
};

export default nextConfig;
