import { defineMessages } from "./intl";

export const messages = defineMessages({
  "en-NZ": {
    heading: "Type Safe Intl Basic Example",
    date: "Today's date is <b>{now, date, ::yyyyMMdd}</b>",
    messages: `You have {numMessages, plural,
      =0 {no messages.}
      =1 {one message.}
      other {# messages.}}`,
  },
} as const);
