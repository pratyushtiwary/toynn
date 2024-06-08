import { defineConfig, passthroughImageService } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    starlight({
      title: "ToyNN Docs",
      social: {
        github: "https://github.com/pratyushtiwary/toynn",
      },
      logo: {
        src: "./public/logo.svg",
        alt: "Toynn Docs",
        replacesTitle: true,
      },
      customCss: ["./src/styles.css"],
      sidebar: [
        {
          label: "Start Here",
          items: [
            {
              label: "Installation",
              link: "installation",
            },
            {
              label: "Examples",
              link: "examples",
            },
          ],
          collapsed: true,
        },
        {
          label: "NArray",
          autogenerate: { directory: "narray" },
          collapsed: true,
        },
        {
          label: "Dataset",
          autogenerate: { directory: "dataset" },
          collapsed: true,
        },
        {
          label: "Errors",
          autogenerate: { directory: "errors" },
          collapsed: true,
        },
        {
          label: "Functions",
          autogenerate: { directory: "functions" },
          collapsed: true,
        },
        {
          label: "NN",
          autogenerate: { directory: "nn" },
          collapsed: true,
        },
        {
          label: "Optimizers",
          autogenerate: { directory: "optimizers" },
          collapsed: true,
        },
        {
          label: "Utils",
          autogenerate: { directory: "utils" },
          collapsed: true,
        },
      ],
      lastUpdated: true,
    }),
  ],

  // Process images with sharp: https://docs.astro.build/en/guides/assets/#using-sharp
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
});
