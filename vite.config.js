import { defineConfig } from "vite";
import pkg from "./package.json";

const banner = `/**
 * @author ${pkg.author}
 * @name ${pkg.name}
 * @link ${pkg.homepage}
 * @description ${pkg.description}
 * @version ${pkg.version}
 * @license ${pkg.license}
 */`;

export default defineConfig({
    build: {
        outDir: "dist",
        rollupOptions: {
            input: "src/index.js",
            output: {
                entryFileNames: "index.js",
                assetFileNames: "assets/[name][extname]",
            }
        },
    },
    esbuild: {
        banner: banner,
        legalComments: "none",
    },
});
