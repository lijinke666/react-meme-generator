const webpack = require("webpack");
const path = require("path");
const OpenBrowserPlugin = require("open-browser-webpack-plugin");

const HOST = "localhost";
const PORT = 8081;

module.exports = env => {
  const mode = (env && env.mode) || "DEV";
  const options = {
    entry:
      mode === "DEV"
        ? [
            "react-hot-loader/patch", //热更新
            `webpack-dev-server/client?http://${HOST}:${PORT}`,
            "webpack/hot/only-dev-server",
            path.join(__dirname, "../example/example.js")
          ]
        : path.join(__dirname, "../example/example.js"),

    output: {
      path: path.join(__dirname, "../example/dist"),
      filename: "build.js"
    },
    //模块加载器
    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          use: [
            {
              loader: "babel-loader"
            }
          ],
          exclude: "/node_modules/"
        },
        {
          test: /\.less$/,
          use: [
            { loader: "style-loader" },
            {
              loader: "css-loader",
              options: { minimize: false, sourceMap: true }
            },
            {
              loader: "less-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" }, //loader 倒序执行  先执行 less-laoder
            {
              loader: "css-loader",
              options: { minimize: false, sourceMap: true }
            }
          ]
        },
        {
          test: /\.(eot|ttf|svg|woff|woff2)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "fonts/[name][hash:8].[ext]"
              }
            }
          ]
        }
      ]
    },
    devtool: "source-map",
    //自动补全后缀
    resolve: {
      enforceExtension: false,
      extensions: [".js", ".jsx", ".json"],
      modules: [path.resolve("src"), path.resolve("."), "node_modules"]
    },
    externals: {
      async: "commonjs async"
    },
    devServer: {
      contentBase: path.join(__dirname, "../example/"),
      inline: true,
      port: PORT,
      publicPath: "/dist/",
      historyApiFallback: true,
      stats: {
        color: true,
        errors: true,
        version: true,
        warnings: true,
        progress: true
      }
    },
    plugins: [
      new OpenBrowserPlugin({
        url: `http:${HOST}:${PORT}/`
      })
    ]
  };
  if (mode === "PROD") {
    options.plugins = options.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        output: {
          comments: false
        },
        compress: {
          warnings: false
        }
      })
    ]);
  }
  return options;
};
