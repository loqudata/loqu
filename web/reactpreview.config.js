// const reactpreview = require("@reactpreview/config");
// const Environment = require("vite-plugin-environment")

// const loc = path.resolve(__dirname + "/.");
module.exports = {
  publicDir: "src/assets/",
  // alias: {
  //     "@/": "src/"
  // },
  // vite: {
  //   // Doesn't do anything
  //   plugins: [Environment(["NEXT_PUBLIC_TYPESENSE_READ_API_KEY"])]
  // },

  vite: {
    optimizeDeps: {
      include: ["react-vega", "vega-lite"],
    },
  },
};
