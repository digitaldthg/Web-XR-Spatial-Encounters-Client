const path = require("path");
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const fs = require("fs");

let clientFolder = "client_public";

module.exports = {
		mode: 'development',
		entry: {
        app: [
            './client/app.js'
        ]
    },
    resolve: {
      alias: {
        Client: path.resolve(__dirname, 'client/js/'),
        
      }
    },
    module: {
      //noParse: /models/,
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/, // exclude any and all files in the `node_modules folder`
            use: [
                {
                
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            "@babel/plugin-syntax-dynamic-import",
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
              
            }]
          },
          {
            test: /\.(gltf)$/,
            use: [
              {
                loader: "gltf-webpack-loader"
              }
            ]
          },
          {
            test: /\.(bin|glb)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}
              }
            ]
          },
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
              'file-loader',
              {
                loader: 'image-webpack-loader',
                options: {
                  bypassOnDebug: true, // webpack@1.x
                  disable: true, // webpack@2.x and newer
                },
              },
            ],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              'style-loader',
              // Translates CSS into CommonJS
              'css-loader',
              // Compiles Sass to CSS
              'sass-loader',
            ],
          },
          
        ]
    },
    node: {
      fs: "empty"
    },
    // resolve: {
    //     extensions: ['*', '.js', '.jsx']
    // },
    output: {
        path: path.join(__dirname, clientFolder),
        filename: "bundle.js",
        publicPath: "/"
    }, 
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      hot: true,
      host: '0.0.0.0',
      port: 8080,
      watchContentBase: true,
      contentBase: path.join(__dirname, clientFolder),
      historyApiFallback: true,
      //https: true,
      watchOptions: {
        ignored: [
          path.resolve(__dirname, 'models')
        ]
      }
    }
};