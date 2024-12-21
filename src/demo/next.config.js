/** @type {import('next').NextConfig} */
const path = require('path');
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add rule to handle TypeScript files from auth-lib
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, '../auth-lib')],
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, 'tsconfig.json'),
            compilerOptions: {
              module: 'esnext',
              moduleResolution: 'node',
              target: 'es5',
              jsx: 'preserve',
            },
          },
        },
      ],
    });

    // Add auth-lib to module resolution paths
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lit-protocol/auth-lib': path.resolve(__dirname, '../auth-lib'),
    };

    // Add fallbacks for node-specific modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      zlib: require.resolve('browserify-zlib'),
      path: require.resolve('path-browserify'),
      url: require.resolve('url/'),
    };

    // Add buffer polyfill
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ];

    return config;
  },
  // Ensure Next.js treats auth-lib as external package
  transpilePackages: ['@lit-protocol/auth-lib'],
};

module.exports = nextConfig;
