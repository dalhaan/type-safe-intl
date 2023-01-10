import { defineTranslations } from "./intl";

export const messages = defineTranslations({
  "en-NZ": {
    heading: "Type Safe Intl Basic Example",
    count: "count is {count, number}",
    messages: `You have {numMessages, plural,
      =0 {no messages}
      =1 {one message}
      other {# messages}} as of <b>{now, date, ::yyyyMMdd}</b>.`,
  },
  "fr-FR": {
    heading: "Type Safe Intl Basic Example FR",
    count: "count is {count, number} FR",
    messages: `You have {numMessages, plural,
      =0 {no messages}
      =1 {one message}
      other {# messages}} as of <b>{now, date, ::yyyyMMdd}</b>. FR`,
  },
} as const);
