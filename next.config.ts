import type {NextConfig} from "next";

const path = require('path');

const nextConfig: NextConfig = {
    webpack: (config: any, {isServer}: { isServer: any }) => {
        if (!isServer) {
            // Ensure that all imports of 'yjs' resolve to the same instance

            config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
        }
        return config;
    },
};

export default nextConfig;
