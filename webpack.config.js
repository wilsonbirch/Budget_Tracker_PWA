const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    entry: "./public/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    mode: "development",
    plugins: [
        new WebpackPwaManifest({

            filename: "manifest.json",

            inject: false,

            fingerprints: false,

            name: "Budget App",
            short_name: "Budget",
            theme_color: "#ffffff",
            background_color: "#ffffff",
            start_url: "/",
            display: "standalone",

            icons: [
                {
                    "src": "public/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                  },
                  {
                    "src": "public/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                  }
            ]
        })
    ]
};

module.exports = config;