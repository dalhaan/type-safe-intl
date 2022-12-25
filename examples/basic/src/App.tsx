import { useState } from "react";

import "./App.css";
import { messages } from "./App.messages";
import { useIntl } from "./intl";

function App() {
  const [count, setCount] = useState(0);

  const { formatMessage } = useIntl(messages);

  return (
    <div className="App">
      <h1>{formatMessage("heading")}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          {formatMessage("date", {
            now: Date.now(),
          })}
        </p>
      </div>
    </div>
  );
}

export default App;
