import { ChangeEvent, useMemo, useState } from "react";

import "./App.css";
import { messages } from "./App.translations";
import { LOCALES, Locale, useIntl, useIntlContext } from "./intl";

function App() {
  const [count, setCount] = useState(0);

  const { formatMessage, FormatMessage } = useIntl(messages);

  const now = useMemo(() => Date.now(), []);
  const numMessages = useMemo(() => Math.round(Math.random() * 20), []);

  return (
    <div className="App">
      <IntlSelect />

      <h1>{formatMessage("heading")}</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          <FormatMessage
            id="count"
            values={{
              count,
            }}
          />
        </button>

        <p>
          <FormatMessage
            id="messages"
            values={{
              numMessages,
              now,
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        </p>
      </div>
    </div>
  );
}

function IntlSelect() {
  const { setLocale } = useIntlContext();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const newLocale = event.target.value as Locale;

    setLocale(newLocale);
  }

  return (
    <select onChange={handleChange}>
      {LOCALES.map((locale) => (
        <option key={locale}>{locale}</option>
      ))}
    </select>
  );
}

export default App;
