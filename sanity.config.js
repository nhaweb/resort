import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";

export const studioBasePath = "/studio";

export default defineConfig({
  name: "orilla",
  title: "Orilla",
  basePath: studioBasePath,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("villa").title("Villas / rooms"),
            S.divider(),
            ...singletonTypes.map((type) =>
              S.listItem()
                .title(type === "faq" ? "FAQ" : "Gallery")
                .id(type)
                .child(S.document().schemaType(type).documentId(type)),
            ),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !singletonTypes.includes(schemaType),
      ),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.includes(context.schemaType)
        ? input.filter(
            ({ action }) => action !== "duplicate" && action !== "delete",
          )
        : input,
  },
});
