const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const faviconPath = path.resolve(__dirname, "public/favicon.ico");

  return {
    entry: "./src/main.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      chunkFilename: isProd
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      clean: true,
      publicPath: "/",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "esbuild-loader",
            options: {
              loader: "tsx",
              target: "es2020",
              jsx: "automatic",
              minify: isProd,
              sourcemap: true,
              tsconfigRaw: require("./tsconfig.json"),
            },
          },
        },
        {
          test: /\.svg$/i,
          oneOf: [
            {
              issuer: /\.[jt]sx?$/,
              use: [
                {
                  loader: "@svgr/webpack",
                  options: {
                    icon: true,
                    typescript: true,
                    ext: "tsx",
                  },
                },
              ],
            },
            {
              type: "asset/resource",
              resourceQuery: /url/,
              generator: {
                filename: "static/media/[name].[hash][ext]",
              },
            },
          ],
        },
        {
          test: /\.module.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: {
                  mode: "local",
                  localIdentName: "[name]__[local]__[hash:base64:5]", // Customize class name generation
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          exclude: /\.module\.s[ac]ss$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : "style-loader",
            {
              loader: "css-loader",
              options: {
                modules: false, // отключаем CSS Modules для обычных SCSS
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|webp|avif)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/media/[name].[hash:8][ext]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "static/fonts/[name].[hash:8][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
        minify: isProd
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
            }
          : false,
        ...(fs.existsSync(faviconPath) && {
          favicon: faviconPath,
        }),
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
    ],
    devServer: {
      port: 3000,
      hot: true,
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, "public"),
      },
      devMiddleware: {
        stats: "minimal",
      },
    },
    optimization: {
      splitChunks: isProd
        ? {
            chunks: "all",
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
                chunks: "all",
                priority: 20,
              },
              common: {
                name: "common",
                minChunks: 2,
                chunks: "all",
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          }
        : false,
      minimize: isProd,
    },
    devtool: isProd ? "source-map" : "eval-source-map",

    performance: {
      hints: isProd ? "warning" : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
  };
};
