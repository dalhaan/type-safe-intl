# Type Safe Intl

A fully type-safe internationalisation library without the need for code generation.

**TODO:**
  - [ ] Ability to pass values with type saftey
  - [ ] Runtime validation
  - [ ] Plurals

## Usage

```tsx
// intl.ts
import { createIntlFunctions, LocalesFromIntlProvider } from 'type-safe-intl';

const { generateIntl, IntlProvider, useIntl } = createIntlFunctions<"en-nz" | "mi">();

type Locale = LocalesFromIntlProvider<typeof IntlProvider>; // 'en-nz' | 'mi'

export {
  generateIntl,
  IntlProvider,
  useIntl,
  Locale,
};

// app.tsx
import { IntlProvider, Locale } from "./intl";
import { Hello } from './hello';

function App() {
  const locale = getLocalFromSomewhere<Locale>();
 
  return (
    <IntlProvider locale={locale}>
      <Hello />
    </IntlProvider>
  );
}

// hello.tsx
import { generateIntl, useIntl } from "./intl";

const intl = generateIntl({
  'en-nz': {
    hello: 'Hello!',
  },
  'mi': {
    hello: 'Kia ora!',
  },
});

export function Hello() {
  const { formatMessage } = useIntl(intl);
  return <h1>{formatMessage('hello')</h1>;
}
```
