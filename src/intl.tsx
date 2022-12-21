/**
 * A fully type safe i18n library without the need for scripts to generate the types
 */

import React from "react";

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

type UnionKeys<U> = U extends U ? keyof U : never;

function createIntlFunctions<Locale extends string>() {
  // ------------------------------------------------------------------
  // IntlContext
  // ------------------------------------------------------------------

  const IntlContext = React.createContext<
    | {
        locale: Locale;
      }
    | undefined
  >(undefined);

  type IntlProviderType = React.PropsWithChildren<{
    locale: Locale;
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
  // generateIntl
  // ------------------------------------------------------------------

  function generateIntl<Base, MessageKeys extends UnionKeys<Base[keyof Base]>>(
    intl: Base & Record<Locale, Record<MessageKeys, string>>
  ) {
    return intl;
  }

  // ------------------------------------------------------------------
  // useIntl
  // ------------------------------------------------------------------

  function useIntl<Base, MessageKeys extends UnionKeys<Base[keyof Base]>>(
    intl: Base & Record<Locale, Record<MessageKeys, string>>
  ) {
    const { locale } = useIntlContext();

    function formatMessage(id: MessageKeys) {
      return intl[locale][id] as string;
    }

    return {
      formatMessage,
    };
  }

  return {
    IntlProvider,
    useIntl,
    generateIntl,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LocalesFromIntlProvider<IntlProvider extends (...args: any) => any> =
  Parameters<IntlProvider>[0] extends { locale: string }
    ? Parameters<IntlProvider>[0]["locale"]
    : never;

// ------------------------------------------------------------------

export { createIntlFunctions };
export type { LocalesFromIntlProvider };
