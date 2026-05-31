import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // 静的エクスポートを有効化
  trailingSlash: true,   // Firebase Hostingとの互換性のため
  images: {
    unoptimized: true,   // 静的エクスポート時はNext.js画像最適化を無効化
  },
};

export default nextConfig;
