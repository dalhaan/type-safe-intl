import { defineMessages } from "./intl";

export const messages = defineMessages({
  "en-NZ": {
    heading: "Type Safe Intl Basic Example",
    date: "Today's date is <b>{now, date, ::yyyyMMdd}</b>",
  },
} as const);
