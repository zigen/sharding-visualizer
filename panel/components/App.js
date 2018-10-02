import React from "react";
import Node from "./node";

const App = () => {
  return (
    <div className="panel-root">
      <div className="container">
        <Node />
      </div>
      <style jsx>{`
        .container {
          width: 20rem;
          height: 20rem;
          border: 1px solid red;
          background-color: rgba(0, 0, 0, 0.8);
        }
        .panel-root {
          position: fixed;
          right: 1rem;
          top: 1rem;
          color: white;
        }
      `}</style>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default App;
