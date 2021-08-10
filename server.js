const next = require("next");
const nextConfig = require("./next.config");

next({ dev, dir: __dirname, conf: nextConfig });
