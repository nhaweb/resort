import { faq } from "./faq";
import { gallery } from "./gallery";
import { localeString, localeText } from "./locale";
import { villa } from "./villa";

export const schemaTypes = [localeString, localeText, villa, gallery, faq];

/** Document types edited as a single document (no "create new"). */
export const singletonTypes = ["gallery", "faq"];
