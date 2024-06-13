import React from "react";
import "./App.css";
import JsonExplorer from "./JsonExplorer";

const demoData = {
  date: "2021-10-27T07:49:14.896Z",
  hasError: false,
  fields: [
    {
      id: "4c212130",
      prop: "iban",
      value: "DE81200505501265402568",
      hasError: false,
    },
  ],
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <JsonExplorer jsonData={demoData} />
      </header>
    </div>
  );
}

export default App;
