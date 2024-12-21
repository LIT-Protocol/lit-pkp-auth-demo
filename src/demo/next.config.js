/** @type {import('next').NextConfig} */
const path = require('path');
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable HMR for node_modules
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules']
      };
    }

    // Add rule to handle import.meta
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-syntax-import-meta'],
        },
      },
    });

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
  // Ensure Next.js treats auth-lib and ESM packages as external packages
  transpilePackages: ['@lit-protocol/auth-lib', '@simplewebauthn/browser', '@lit-protocol/lit-auth-client'],
};

module.exports = nextConfig;
