import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), visualizer({ open: true })],
	publicDir: "client/public",
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "client/src"),
			"@hooks": path.resolve(import.meta.dirname, "client/src/hooks"),
			"@api": path.resolve(import.meta.dirname, "client/src/api"),
			"@helpers": path.resolve(import.meta.dirname, "client/src/helpers"),
			"@pages": path.resolve(import.meta.dirname, "client/src/pages"),
			"@services": path.resolve(import.meta.dirname, "client/src/services"),
			"@components": path.resolve(import.meta.dirname, "client/src/components"),
			"@icons": path.resolve(import.meta.dirname, "client/public/icons"),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
               @use "@/styles/abstracts/_variables.scss" as *;
               @use "@/styles/abstracts/_mixins.scss" as *;
            `,
			},
		},
	},
});
