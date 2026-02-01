const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = {
	...defaultConfig,
	entry: {
		scripts: path.resolve(process.cwd(), "application", "scripts.tsx")
	},
	output: {
		filename: "[name].js", // Dynamically name your bundles
		path: path.resolve(process.cwd(), "public") // Output folder for compiled assets
	},
	resolve: {
		...defaultConfig.resolve,
		extensions: [".ts", ".tsx", ...defaultConfig.resolve.extensions], // Ensure TypeScript extensions
		alias: {
			"@": path.resolve(process.cwd(), "./") // Set up the alias correctly for imports
		}
	},
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true, // Speed up builds by skipping type checking
							configFile: path.resolve(process.cwd(), "tsconfig.json")
						}
					}
				],
				exclude: /node_modules/
			}
		]
	}
};
