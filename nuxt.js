import { join } from "path";
import { defineNuxtModule } from "@nuxt/kit";

export default defineNuxtModule({
  hooks: {
    "components:dirs"(dirs) {
      dirs.push({
        path: join(__dirname, "components"),
        prefix: "K",
      });
    },
  },
});
