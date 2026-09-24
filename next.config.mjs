import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — the whole site ships as files, no Node server required.
  output: 'export',
  // Emits about/index.html etc. so Apache/cPanel serves clean URLs without rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  outputFileTracingRoot: root,

  // The `@/*` alias is declared explicitly rather than inferred from tsconfig paths,
  // which did not resolve reliably for every folder under src/ in this setup.
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(root, 'src'),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@/*': './src/*',
    },
  },
};

export default nextConfig;
