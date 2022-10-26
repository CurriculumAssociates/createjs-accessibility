import html from "@rollup/plugin-html";
import config from "../../rollup.common";

const [, browserConfig] = config;

// browserConfig.output.file = "public/main.js",
browserConfig.plugins.push(html());

export default browserConfig;
