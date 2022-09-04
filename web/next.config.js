const withTM = require("next-transpile-modules")(["vega-lite", "compassql", "react-vega"]);

const out = withTM({
  typescript: {
    ignoreBuildErrors: true,
  },
});
//

// webpack: (config, options) => {
//     // console.log(config, options);
//     // console.log(JSON.stringify(config.module.rules, null, 4));
//     return config
//   },

// console.log("gout", out.webpack());

module.exports = out;
