(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TypeSafeIntl = {}, global.React));
})(this, (function (exports, React) { 'use strict';

    /**
     * A fully type safe i18n library without the need for scripts to generate the types
     */
    function createIntl(locales) {
        validateLocales(locales);
        // ------------------------------------------------------------------
        // IntlContext
        // ------------------------------------------------------------------
        const IntlContext = React.createContext(undefined);
        function IntlProvider({ locale, children }) {
            return (React.createElement(IntlContext.Provider, { value: { locale } }, children));
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
        function defineMessages(intl) {
            return intl;
        }
        // ------------------------------------------------------------------
        // useIntl
        // ------------------------------------------------------------------
        function useIntl(intl) {
            const { locale } = useIntlContext();
            function formatMessage(id) {
                return intl[locale][id];
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
    function validateLocales(locales) {
        const errors = [];
        for (const localeTag of locales) {
            try {
                // const locale = new Intl.Locale(localeTag); // Throws error if invalid locale.
                const canonicalLocale = Intl.getCanonicalLocales(localeTag); // Throws error if invalid locale.
                // Throw error if locale doesn't exactly match BCP47 format.
                if (localeTag !== canonicalLocale[0])
                    errors.push(`Invalid locale: "${localeTag}", did you mean "${canonicalLocale[0]}"`);
            }
            catch (incorrectLocaleError) {
                errors.push(`Invalid locale: "${localeTag}"`);
            }
        }
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
    }

    exports.createIntl = createIntl;

}));
