/**
 * A fully type safe i18n library without the need for scripts to generate the types
 */

import { IntlMessageFormat, PrimitiveType } from "intl-messageformat";
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

function createIntl<
  LocaleType extends string,
  Locales extends LocaleType[],
  Locale extends Locales[number]
>(locales: Locales) {
  validateLocales(locales);

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

  function defineMessages<
    Base,
    MessageKeys extends UnionKeys<Base[keyof Base]>
  >(intl: Base & Record<Locale, Record<MessageKeys, string>>) {
    return intl;
  }

  // ------------------------------------------------------------------
  // useIntl
  // ------------------------------------------------------------------

  function useIntl<Base, MessageKeys extends UnionKeys<Base[keyof Base]>>(
    intl: Base & Record<Locale, Record<MessageKeys, string>>
  ) {
    const { locale } = useIntlContext();

    function formatMessage<
      Values extends Record<string, PrimitiveType | undefined>
    >(id: MessageKeys, values: Values) {
      if (!values) {
        return intl[locale][id] as string;
      }

      return new IntlMessageFormat(intl[locale][id], locale).format(values);
    }

    return {
      formatMessage,
    };
  }

  return {
    IntlProvider,
    useIntl,
    defineMessages,
  };
}

/**
 * Validates an array of locales.
 * Throws an error if they either don't exist or are of the incorrect format.
 */
function validateLocales(locales: string[]) {
  const errors: string[] = [];

  for (const localeTag of locales) {
    try {
      // const locale = new Intl.Locale(localeTag); // Throws error if invalid locale.
      const canonicalLocale = Intl.getCanonicalLocales(localeTag); // Throws error if invalid locale.

      // Throw error if locale doesn't exactly match BCP47 format.
      if (localeTag !== canonicalLocale[0])
        errors.push(
          `Invalid locale: "${localeTag}", did you mean "${canonicalLocale[0]}"`
        );
    } catch (incorrectLocaleError) {
      errors.push(`Invalid locale: "${localeTag}"`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LocalesFromIntlProvider<IntlProvider extends (...args: any) => any> =
  Parameters<IntlProvider>[0] extends { locale: string }
    ? Parameters<IntlProvider>[0]["locale"]
    : never;

// ------------------------------------------------------------------

export { createIntl };
export type { LocalesFromIntlProvider };
