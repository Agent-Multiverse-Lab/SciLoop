import * as React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return <main className="shell">
    <header><img src="./icon.png" alt="" /><span>SciLoop</span></header>
    <section>
      <p className="eyebrow">FROM PAPERS TO EXPERIMENTS</p>
      <h1>Your research workspace.</h1>
      <p className="description">Understand. Build. Run. Analyze. Iterate.</p>
    </section>
  </main>;
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
