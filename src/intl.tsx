/**
 * A fully type safe i18n library without the need for scripts to generate the types
 */

import memoize from "@formatjs/fast-memoize";
import {
  MessageFormatElement,
  parse,
} from "@formatjs/icu-messageformat-parser";
import { IntlMessageFormat } from "intl-messageformat";
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

/**
 * Converts a type to keys of an object.
 * e.g.
 *
 * type Values = "foo" | "bar" | "baz";
 * type Obj = TypeToObjKeys<Values, any>;
 *
 * Obj -> {
 *  foo: any;
 *  bar: any;
 *  baz: any;
 * }
 */
// type TypeToObjKeys<Type extends string, Value> = {
//   [Key in Type]: Value;
// };

/**
 * Maps a placeholder's type string to a type.
 * e.g. "{now, date}" -> Date | number
 * e.g. "{amount, number}" -> number
 */
// TODO: Map remaining placeholder types: select, selectordinal
type PlaceholderTypes = {
  number: number;
  date: Date | number;
  time: Date | number;
  plural: number;
};

/**
 * Get remaining string after plural statement.
 * IMPORTANT: Plural statement must end with "}}".
 *
 * e.g.
 * `You have {numPhotos, plural,
 *    =0 {no photos.}
 *    =1 {one photo.}
 *    other {# photos.}}REMAINING`
 *
 * returns "REMAINING"
 */
type GetRemainingAfterPlural<Tail extends string> =
  // Match ".*}}(Remaining:.*)"
  Tail extends `${string}}}${infer Remaining extends string}`
    ? Remaining
    : unknown;

/**
 * Extracts variable values out of an internationalised string.
 * e.g.
 *
 * type Message = "{greeting} {name}! Amount due {amount, number, ::currency:EUR} by {due, date, ::yyyyMMdd}.";
 * type Values = GetVariableValues<Message>;
 *
 * ```
 * Values -> {
 *  greeting: string;
 *  name: string;
 *  amount: number;
 *  due: Date | number;
 * }
 * ```
 */
// TODO: Match remaining placeholder types: select, selectordinal
type GetVariableValues<Message extends string | unknown> =
  // Match "{.+}" e.g. "{placeholder}" or "{placeholder, number}" or "{placeholder, number, ::currency:EUR}"
  Message extends `${string}{${infer Variable}}${infer Tail}`
    ? // Match "{.+, .+}" e.g. "{placeholder, number}" or "{placeholder, number, ::currency:EUR}"
      Variable extends `${infer Name}, ${infer Info}`
      ? // Match "{.+, .+,.+}" e.g. "{placeholder, number, ::currency:EUR}"
        Info extends `${infer Type extends keyof PlaceholderTypes},${string}`
        ? Type extends "plural"
          ? // Plural
            {
              [K in Name]: PlaceholderTypes[Type];
            } & GetVariableValues<GetRemainingAfterPlural<Tail>>
          : // Other
            {
              [K in Name]: PlaceholderTypes[Type];
            } & GetVariableValues<Tail>
        : // Match "{.+,.+}" e.g. "{placeholder, number}"
          {
            [K in Name]: Info extends keyof PlaceholderTypes
              ? PlaceholderTypes[Info]
              : any;
          } & GetVariableValues<Tail>
      : // Match "{placeholder}"
        {
          [K in Variable]: string;
        } & GetVariableValues<Tail>
    : unknown;

// type Test =
//   GetVariableValues<"Hey {placeholder1} and {placeholder2, number, ::currency:EUR} and {placeholder3, date}">;

/**
 * Extracts XML values out of an internationalised string.
 * e.g.
 *
 * type Message = "I am <strong>strong</strong> and <b>bold</b>.";
 * type Values = GetXMLValues<Message>;
 *
 * ```
 * Values -> {
 *  strong: (chunks: any) => React.ReactNode;
 *  b: (chunks: any) => React.ReactNode;
 * }
 * ```
 */
type GetXMLValues<Message extends string> =
  Message extends `${infer Head}</${infer Value}>${infer Tail}`
    ? {
        [K in Value]: (chunks: any) => React.ReactNode;
      } & GetXMLValues<Head> &
        GetXMLValues<Tail>
    : unknown;

// type Test2 =
//   GetXMLValues<"Hey <b>placeholder1</b> and <i>placeholder2</i>, number, ::currency:EUR} and {placeholder3, date}">;

/**
 * Extracts all values out of an internationalised string.
 * e.g.
 *
 * type Message = "{greeting} {name}! I am <strong>strong</strong> and <b>bold</b>.";
 * type Values = GetValuesFromMessage<Message>;
 *
 * ```
 * Values -> {
 *  greeting: string;
 *  name: string;
 *  strong: (chunks: any) => React.ReactNode;
 *  b: (chunks: any) => React.ReactNode;
 * }
 * ```
 */
type GetValuesFromMessage<Message extends string> =
  | GetVariableValues<Message> & GetXMLValues<Message>;

// type Test3 = GetValuesFromMessage<"Hey {placeholder}">;

/**
 * Extracts values out of an internationalised string and converts them to an object.
 * e.g.
 *
 * type Messages = {
 *  "en-nz": {
 *   "title": "Example title";
 *   "body": "{greeting} {name}! I am <strong>strong</strong> and <b>bold</b>.";
 * };
 *
 * type ValuesObj = GetValuesFromMessage<Messages, "body">;
 *
 * ValuesObj -> {
 *  greeting: any;
 *  name: any;
 *  strong: any;
 *  b: any;
 * }
 */
// type GetValuesFromMessage<Message extends string> = TypeToObjKeys<
//   GetAllValues<Message>,
//   any
// >;

function createIntl<
  LocaleType extends string,
  Locales extends LocaleType[],
  Locale extends Locales[number]
>(locales: Locales) {
  // Validate that locales are valid BCP 47 language tags
  validateLocales(locales);

  // Create message AST cache
  const messageASTCache = new Map<string, MessageFormatElement[]>();

  // Memoise formatters
  const formatters = {
    getNumberFormat: memoize(
      (locale, opts) => new Intl.NumberFormat(locale, opts)
    ),
    getDateTimeFormat: memoize(
      (locale, opts) => new Intl.DateTimeFormat(locale, opts)
    ),
    getPluralRules: memoize(
      (locale, opts) => new Intl.PluralRules(locale, opts)
    ),
  };

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
    // Parse messages as ASTs and cache them.
    for (const locale in intl) {
      // Parse and store messages as ASTs in the AST cache if it doesn't already exist.
      for (const message of Object.values(intl[locale as Locale])) {
        if (!messageASTCache.has(message as string)) {
          messageASTCache.set(message as string, parse(message as string));
        }
      }
    }

    return intl;
  }

  // ------------------------------------------------------------------
  // useIntl
  // ------------------------------------------------------------------

  function useIntl<Base, MessageKeys extends UnionKeys<Base[keyof Base]>>(
    intl: Base & Record<Locale, Record<MessageKeys, string>>
  ) {
    const { locale } = useIntlContext();

    const formatMessage: {
      <Id extends MessageKeys>(
        ...args: GetValuesFromMessage<
          typeof intl[typeof locale][Id]
        > extends Record<string, any>
          ? // If placeholder values, require both `id` and `values` args
            [
              id: Id,
              values: GetValuesFromMessage<typeof intl[typeof locale][Id]>
            ]
          : // If no placeholder values, only require the `id` arg
            [id: Id]
      ): string | string[];
    } = (...args) => {
      const id = args[0];
      const values = args[1];

      // If no values are needed, just return the message
      if (!values) {
        return intl[locale][id] as string;
      }

      return new IntlMessageFormat(
        // Use pre parsed message to format, otherwise use raw message
        messageASTCache.get(intl[locale][id]) || intl[locale][id],
        locale,
        undefined,
        // Use memoised formatters
        {
          formatters,
        }
      ).format<string>(values);
    };

    function FormatMessage<Id extends MessageKeys>(
      props: GetValuesFromMessage<
        typeof intl[typeof locale][Id]
      > extends Record<string, any> // If placeholder values, require both `id` and `values` props
        ? {
            id: Id;
            values: GetValuesFromMessage<typeof intl[typeof locale][Id]>;
          } // If no placeholder values, only require the `id` prop
        : { id: Id }
    ) {
      if ("values" in props) {
        // @ts-expect-error TypeScript cannot determine if the args are valid.
        return <>{formatMessage(props.id, props.values)}</>;
      }

      // @ts-expect-error TypeScript cannot determine if the args are valid.
      return <>{formatMessage(props.id)}</>;
    }

    return {
      formatMessage,
      FormatMessage,
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

// const { IntlProvider, defineMessages, useIntl } = createIntl(["en-NZ"]);

// const messages = defineMessages({
//   "en-NZ": {
//     noPlaceholder: "Yo man",
//     example: "Yo {placeholder} {amount, number, ::currency:EUR} <b>BOLD</b>",
//     plural: `You have {numPhotos, plural,
//       =0 {no photos.}
//       =1 {one photo.}
//       other {# photos.}} as of {now, date, ::yyyyMMdd}.`,
//     date: "Today's date is {now, date, ::yyyyMMdd}",
//   },
// } as const);

// const { formatMessage } = useIntl(messages);

// formatMessage("plural", {
//   now: Date.now(),
//   numPhotos: 5,
// });
