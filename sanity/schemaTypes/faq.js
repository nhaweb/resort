import { defineArrayMember, defineField, defineType } from "sanity";

/** Singleton (document id `faq`). */
export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "title", type: "localeString" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", type: "localeString" }),
            defineField({ name: "answer", type: "localeText" }),
          ],
          preview: {
            select: { title: "question.vi", subtitle: "question.en" },
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "FAQ" }) },
});
