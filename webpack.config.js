const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const mode = process.env.NODE_ENV || 'development';

const devMode = mode === 'development';

const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
   mode,
   target,
   devtool,

   devServer: {
      port: 3000,
      open: true,
      hot: true,
      static: './dist',
   },

   entry: ["@babel/polyfill", path.resolve(__dirname, 'src', 'index.js')],

   output: {
      clean: true,
      filename: './bundle/[name].js',
      path: path.resolve(__dirname, 'dist'),
   },

   optimization: {
      runtimeChunk: 'single',
   },

   plugins: [
      new HtmlWebpackPlugin({
         filename: "index.html",
         template: "src/index.html",
      }),
      new MiniCssExtractPlugin({
         filename: "./style/style.css",
      })
   ],

   module: {
      rules: [
         {
            test: /\.svg$/,
            use: [
               {
                  loader: 'image-webpack-loader',
               }
            ],
            type: 'asset/resource',
            generator: {
               filename: 'icons/[name][ext]'
            }
         },
         {
            test: /\.(png|jpg|jpeg|gif)$/i,
            use: [
               {
                  loader: 'image-webpack-loader',
                  options: {
                     mozjpeg: {
                        progressive: true,
                     },
                     // optipng.enabled: false will disable optipng
                     optipng: {
                        enabled: false,
                     },
                     pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                     },
                     gifsicle: {
                        interlaced: false,
                     },
                     // the webp option will enable WEBP
                     webp: {
                        quality: 75
                     },
                  }
               }
            ],
            type: 'asset/resource',
            generator: {
               filename: 'images/[name][ext]'
            }
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
               filename: 'fonts/[name][ext]'
            }
         },
         {
            test: /\.(c|sa|sc)ss$/i,
            use: [
               MiniCssExtractPlugin.loader,
               'css-loader',
               {
                  loader: "postcss-loader",
                  options: {
                     postcssOptions: {
                        plugins: [
                           [
                              "postcss-preset-env",
                              {
                                 // Options
                              },
                           ],
                        ],
                     },
                  },
               },
               'sass-loader',
            ],
         },
         {
            test: /\.html$/,
            loader: 'html-loader'
         },
         {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env']
               }
            }
         }
      ],
   },

   resolve: {
      alias: {
         alwaysPresent: path.resolve(__dirname, '/src/alwaysPresent'),
      },

      fallback: { process: require.resolve("process/browser") }
   }
};
