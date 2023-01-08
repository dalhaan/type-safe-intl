# Type Safe Intl

A fully type-safe internationalisation library for React without the need for code generation.

This library statically analyses your locale messages to give you intellisense for any placeholder variables and XML tags to ensure you don't miss any which could result in runtime bugs. It also ensures that you have provided the translations required for all the locales you wish to support.

Internally, Type Safe Intl uses [intl-messageformat](https://formatjs.io/docs/intl-messageformat/) to format your messages so uses the same intl message format as [react-intl](https://www.npmjs.com/package/react-intl) and [react-aria](https://www.npmjs.com/package/react-aria).

**TODO:**

- [x] Enforce BCP 47 language tags for locales (at runtime, there are way too many to use types)
  - Using `Intl.getCanonicalLocales` to validate locale at runtime.
- [x] Ability to pass placeholders type safely (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
  - [x] "number" type
  - [x] "date" type
  - [x] "time" type
- [x] Support Date/Time/Number skeleton (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [x] Cache Intl.\* constructors (w/ [@formatjs/fast-memoize](https://github.com/formatjs/formatjs/tree/main/packages/fast-memoize))
- [x] Cache messages
- [ ] Add default locale resolution (maybe)
- [x] "plural" support with type saftey (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [ ] "select" support with type saftey (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [ ] "selectordinal" support with type saftey (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [ ] Runtime validation
- [ ] Character escaping

## Usage

```tsx
// intl.ts
import { createIntl } from "type-safe-intl";

// Pass your supported locales to `createIntl`.
// `createIntl` passes the locale type info to
// all intl functions & hooks so they can enforce them.
const { defineMessages, IntlProvider, useIntl } = createIntl(["en-NZ", "mi"]);

export { defineMessages, IntlProvider, useIntl };

// app.tsx
import { IntlProvider, Locale } from "./intl";
import { Hello } from "./hello";

function App() {
  const locale = getLocalFromSomewhere<"en-NZ" | "mi">();

  // `IntlProvider` uses context to tell `useIntl` what locale to use.
  return (
    <IntlProvider locale={locale}>
      <Hello />
    </IntlProvider>
  );
}

// hello.tsx
import { defineMessages, useIntl } from "./intl";

// `defineMessages` enforces that all locales are provided and that they all have the same message ids.
const messages = defineMessages({
  "en-NZ": {
    hello: `Hello {name}! You have {numMessages, plural,
      =0 {no messages.}
      =1 {one message.}
      other {# messages.}} @ {now, date, ::yyyyMMdd}`,
  },
  mi: {
    hello: `Kia ora {name}! {numMessages, plural,
      =0 {Karekau he karere.}
      =1 {Kotahi to karere.}
      other {E # au karere.}} @ {now, date, ::yyyyMMdd}`,
  },
});

export function Hello() {
  // `useIntl` returns a `formatMessage` function that returns the copy
  // for a given message id for the current locale.
  // It also enforces that the messages passed to it have all of the
  // correct locales and they have the same message ids.
  const { formatMessage } = useIntl(messages);

  return (
    <h1>
      {formatMessage("hello", {
        name: "Jane",
        numMessages: 5,
        now: Date.now(),
      })}
    </h1>
  );
}
```

## Plurals

Plurals are defined using the standard ICU message format for plurals.

**IMPORTANT:** The plural statement must end with "}}", the closing curly brackets cannot be on different lines or have spaces between them. This is due to a limitation with TypeScript.

e.g.

```
`{numMessages, plural,
      =0 {Karekau he karere.}
      =1 {Kotahi to karere.}
      other {E # au karere.}}`
```
