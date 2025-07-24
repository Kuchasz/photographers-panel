import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import("next").NextConfig} */
const config = {
    output: 'standalone',
    serverExternalPackages: ["pg"],
    images: {
        remotePatterns: [
            {
                hostname: 'ps-wed.azurewebsites.net',
                protocol: 'https',
            },
            {
                hostname: 'pyszstudio.pl',
                protocol: 'https',
            },
            {
                hostname: 'test.pyszstudio.pl',
                protocol: 'https',
            },
            {
                hostname: 'staging.pyszstudio.pl',
                protocol: 'https',
            },
            {
                hostname: '*.cdninstagram.com',
                protocol: 'https',
            },
            {
                hostname: '*.fbcdn.net',
                protocol: 'https',
            },
            {
                hostname: "*.contabostorage.com",
                protocol: "https",
            }
        ],
    },
};

export default withPayload(config);
