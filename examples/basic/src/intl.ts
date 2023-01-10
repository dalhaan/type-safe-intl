import { createIntl } from "type-safe-intl";

export const LOCALES = ["en-NZ", "fr-FR"] as const;
export type Locale = typeof LOCALES[number];

export const { IntlProvider, defineTranslations, useIntl, useIntlContext } =
  createIntl(LOCALES);
