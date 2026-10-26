import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton (document id `gallery`). */
export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "localeString" }),
    defineField({ name: "title", type: "localeString" }),
    defineField({ name: "description", type: "localeText" }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "localeString",
            }),
            defineField({ name: "caption", type: "localeString" }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Gallery" }) },
});
