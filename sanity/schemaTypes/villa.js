import { defineArrayMember, defineField, defineType } from "sanity";

const imageWithAlt = {
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "localeString",
    }),
  ],
};

/**
 * Marketing copy for a bookable villa. `villaId` must equal the inventory id
 * in the booking store; rates, capacity and availability are NOT edited here.
 */
export const villa = defineType({
  name: "villa",
  title: "Villa / room",
  type: "document",
  fields: [
    defineField({
      name: "villaId",
      title: "Inventory id",
      description:
        "Must match the villa id in the booking database (e.g. east-cut).",
      type: "string",
      validation: (rule) =>
        rule.required().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
          name: "kebab-case",
        }),
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "line", title: "Tagline", type: "localeString" }),
    defineField({ name: "description", type: "localeText" }),
    defineField({
      name: "amenities",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
    defineField({ name: "materials", type: "localeString" }),
    defineField({
      name: "aspect",
      description: "Which way the villa faces.",
      type: "string",
      options: {
        list: ["north", "east", "south", "west"],
        layout: "radio",
      },
    }),
    defineField({ name: "mainImage", ...imageWithAlt }),
    defineField({
      name: "images",
      title: "Additional images",
      type: "array",
      of: [defineArrayMember(imageWithAlt)],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "villaId", media: "mainImage" },
  },
});
