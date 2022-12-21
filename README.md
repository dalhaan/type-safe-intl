# Type Safe Intl

A fully type-safe internationalisation library for React without the need for code generation.

**TODO:**
  - [ ] Ability to pass values with type saftey
  - [ ] Runtime validation
  - [ ] Plurals

## Usage

```tsx
// intl.ts
import { createIntlFunctions, LocalesFromIntlProvider } from "type-safe-intl";

// Define your supported locales as a type
type Locale = "en-nz" | "mi";

// Pass your locale type to `createIntlFunctions`.
// `createIntlFunctions` passes the locale type info to all intl functions & hooks 
// so they can enforce them.
const { generateIntl, IntlProvider, useIntl } = createIntlFunctions<Locale>();

export {
  generateIntl,
  IntlProvider,
  useIntl,
  Locale,
};

// app.tsx
import { IntlProvider, Locale } from "./intl";
import { Hello } from "./hello";

function App() {
  const locale = getLocalFromSomewhere<Locale>();
 
  // `IntlProvider` uses context to tell `useIntl` what locale to use.
  return (
    <IntlProvider locale={locale}>
      <Hello />
    </IntlProvider>
  );
}

// hello.tsx
import { generateIntl, useIntl } from "./intl";

// `generateIntl` enforces that all locales are provided and that they all have the same message ids.
const messages = generateIntl({
  "en-nz": {
    hello: "Hello!",
  },
  mi: {
    hello: "Kia ora!",
  },
});

export function Hello() {
  // `useIntl` returns a `formatMessage` function that returns the copy
  // for a given message id for the current locale.
  // It also enforces that the messages passed to it have all of the
  // correct locales and they have the same message ids.
  const { formatMessage } = useIntl(messages);

  return <h1>{formatMessage("hello")</h1>;
}
```
