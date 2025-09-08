import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://n8n-production-e992.up.railway.app/webhook/cbb3bdda-d405-4eb0-a8db-be74e12393bd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Error al conectar con el webhook" });
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "50px" }}>
      <h1>Enviar datos al Webhook</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          placeholder="Escribe algo..."
          onChange={(e) => setInput(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px" }}>
          Enviar
        </button>
      </form>

      {response && (
        <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
          <h3>Respuesta del webhook:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
