import { useState } from "react";

import "./App.css";
import { messages } from "./App.messages";
import { useIntl } from "./intl";

function App() {
  const [count, setCount] = useState(0);

  const { formatMessage, FormatMessage } = useIntl(messages);

  return (
    <div className="App">
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
              numMessages: Math.round(Math.random() * 20),
              now: Date.now(),
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        </p>
      </div>
    </div>
  );
}

export default App;
