# Type Safe Intl

A fully type-safe internationalisation library for React without the need for code generation.

**TODO:**

- [x] Enforce BCP 47 language tags for locales (at runtime, there are way too many to use types)
  - Using `Intl.getCanonicalLocales` to validate locale at runtime.
- [ ] Add default locale resolution (maybe)
- [X] Ability to pass values type saftey (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [ ] Plural support with type saftey (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [X] Support Date/Time/Number skeleton (w/ [intl-messageformat](https://formatjs.io/docs/intl-messageformat/))
- [ ] Cache Intl.\* constructors
- [ ] Cache messages
- [ ] Runtime validation

## Usage

```tsx
// intl.ts
import { createIntl } from "type-safe-intl";

// Pass your supported locales to `createIntl`.
// `createIntl` passes the locale type info to
// all intl functions & hooks so they can enforce them.
const { defineMessages, IntlProvider, useIntl } = createIntl(["en-NZ", "mi"]);

export {
  defineMessages,
  IntlProvider,
  useIntl,
  Locale,
};

// app.tsx
import { IntlProvider, Locale } from "./intl";
import { Hello } from "./hello";

function App() {
  const locale = getLocalFromSomewhere<'en-NZ' | 'mi'>();

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
  "en-nz": {
    hello: "Hello {name}!",
  },
  mi: {
    hello: "Kia ora {name}!",
  },
});

export function Hello() {
  // `useIntl` returns a `formatMessage` function that returns the copy
  // for a given message id for the current locale.
  // It also enforces that the messages passed to it have all of the
  // correct locales and they have the same message ids.
  const { formatMessage } = useIntl(messages);

  return (
    <h1>{formatMessage("hello", {
      name: "Jane",
    })</h1>
  );
}
```
