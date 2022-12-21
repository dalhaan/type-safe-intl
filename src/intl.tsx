/**
 * A fully type safe i18n library without the need for scripts to generate the types
 */

import React, { PropsWithChildren } from "react";

// const intl = {
//     'en-nz': {
//         a: 'A',
//         b: 'B',
//         c: 'C',
//     },
//     'mi': {
//         a: 'J',
//         b: 'K',
//         c: 'L',
//     }
// }

// ------------------------------------------------------------------
// GenerateIntl
// ------------------------------------------------------------------

type UnionKeys<U> = U extends U ? keyof U : never;

function generateIntl<
  Base,
  Locales extends keyof Base,
  MessageKeys extends UnionKeys<Base[Locales]>
>(intl: Base & Record<Locales, Record<MessageKeys, string>>) {
  return intl;
}

// ------------------------------------------------------------------
// useIntl
// ------------------------------------------------------------------

function useIntl<
  Base,
  Locales extends keyof Base,
  MessageKeys extends UnionKeys<Base[Locales]>
>(intl: Base & Record<Locales, Record<MessageKeys, string>>) {
  const { locale } = useIntlContext();

  function formatMessage(id: MessageKeys) {
    return intl[locale as Locales][id] as string;
  }

  return {
    formatMessage,
  };
}

// ------------------------------------------------------------------
// IntlContext
// ------------------------------------------------------------------

type IntlContextType = {
  locale: string;
};

const IntlContext = React.createContext<IntlContextType | undefined>(undefined);

type IntlProviderType = PropsWithChildren<{
  locale: string;
}>;

function IntlProvider({ locale, children }: IntlProviderType) {
  return (
    <IntlContext.Provider value={{ locale }}>{children}</IntlContext.Provider>
  );
}

function useIntlContext() {
  const context = React.useContext(IntlContext);

  if (!context) {
    throw new Error("useIntlContext must be used within an <IntlProvider />");
  }

  return context;
}

// ------------------------------------------------------------------

export { generateIntl, useIntl, IntlProvider, useIntlContext };
