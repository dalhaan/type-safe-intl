import { defineMessages } from "./intl";

export const messages = defineMessages({
  "en-NZ": {
    heading: "Type Safe Intl Basic Example",
    count: "count is {count, number}",
    messages: `You have {numMessages, plural,
      =0 {no messages}
      =1 {one message}
      other {# messages}} as of <b>{now, date, ::yyyyMMdd}</b>.`,
  },
} as const);
