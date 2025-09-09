import React, { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Crear o recuperar sessionId al cargar la app
  useEffect(() => {
    let id = sessionStorage.getItem("sessionId");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("sessionId", id);
    }
    setSessionId(id);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    setLoading(true);
    try {
      let requestBody = { text: input, sessionId };
      
      // Si hay un archivo seleccionado, incluirlo en la solicitud
      if (selectedFile) {
        const fileData = await convertFileToBase64(selectedFile);
        requestBody.file = {
          name: selectedFile.name,
          type: selectedFile.type,
          data: fileData
        };
      }

      const res = await fetch(
        "https://n8n-production-e992.up.railway.app/webhook/cbb3bdda-d405-4eb0-a8db-be74e12393bd",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json();
      setResponse(data);
      setInput("");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Error al conectar con el agente financiero" });
    } finally {
      setLoading(false);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    let message = "";
    
    switch (action) {
      case "ver_presupuesto":
        message = "Muéstrame mi presupuesto actual";
        break;
      case "ver_gastos":
        message = "Muéstrame la lista de mis gastos";
        break;
      case "resumen":
        message = "Dame un resumen de mi situación financiera";
        break;
      default:
        return;
    }

    try {
      const res = await fetch(
        "https://n8n-production-e992.up.railway.app/webhook/cbb3bdda-d405-4eb0-a8db-be74e12393bd",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message, sessionId }),
        }
      );

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Error al conectar con el agente financiero" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        marginBottom: "30px"
      }}>
        <h1 style={{
          color: "white",
          fontSize: "2.5rem",
          fontWeight: "300",
          margin: "0",
          textShadow: "0 2px 4px rgba(0,0,0,0.3)"
        }}>
          🏦 Mi Agente Financiero
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: "1.1rem",
          margin: "10px 0 0 0"
        }}>
          Tu asistente personal para el control de gastos y presupuestos
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px"
      }}>
        {[
          { key: "chat", label: "💬 Chat", icon: "💬" },
          { key: "upload", label: "📄 Subir Factura", icon: "📄" },
          { key: "actions", label: "⚡ Acciones Rápidas", icon: "⚡" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "12px 24px",
              margin: "0 5px",
              border: "none",
              borderRadius: "25px",
              background: activeTab === tab.key ? "white" : "rgba(255,255,255,0.2)",
              color: activeTab === tab.key ? "#667eea" : "white",
              fontWeight: activeTab === tab.key ? "600" : "400",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenedor principal */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        
        {/* Tab: Chat */}
        {activeTab === "chat" && (
          <div style={{ padding: "30px" }}>
            <h2 style={{ 
              color: "#333",
              marginBottom: "20px",
              fontSize: "1.5rem"
            }}>
              💬 Conversa con tu agente
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  value={input}
                  placeholder="Pregúntame sobre tus finanzas, sube facturas o pide reportes..."
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "15px",
                    border: "2px solid #e1e8ed",
                    borderRadius: "10px",
                    fontSize: "16px",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e1e8ed"}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || (!input.trim() && !selectedFile)}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: loading ? "#ccc" : "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {loading ? "🤔 Procesando..." : "💸 Enviar consulta"}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Upload */}
        {activeTab === "upload" && (
          <div style={{ padding: "30px" }}>
            <h2 style={{ 
              color: "#333",
              marginBottom: "20px",
              fontSize: "1.5rem"
            }}>
              📄 Subir Factura o Boleta
            </h2>
            
            <div style={{
              border: "2px dashed #667eea",
              borderRadius: "15px",
              padding: "40px",
              textAlign: "center",
              marginBottom: "20px",
              background: selectedFile ? "rgba(102, 126, 234, 0.05)" : "rgba(0,0,0,0.02)"
            }}>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: "none" }}
                id="file-upload"
              />
              
              <label htmlFor="file-upload" style={{
                cursor: "pointer",
                display: "block"
              }}>
                <div style={{
                  fontSize: "48px",
                  marginBottom: "15px"
                }}>
                  {selectedFile ? "✅" : "📎"}
                </div>
                
                <h3 style={{ color: "#333", margin: "0 0 10px 0" }}>
                  {selectedFile ? selectedFile.name : "Seleccionar archivo"}
                </h3>
                
                <p style={{ 
                  color: "#666",
                  margin: "0",
                  fontSize: "14px"
                }}>
                  {selectedFile ? "Archivo listo para procesar" : "Soporta: PNG, JPG, PDF, DOC, DOCX"}
                </p>
              </label>
            </div>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                placeholder="Instrucciones adicionales (opcional)..."
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "2px solid #e1e8ed",
                  borderRadius: "10px",
                  fontSize: "16px",
                  outline: "none",
                  marginBottom: "15px",
                  boxSizing: "border-box"
                }}
              />
              
              <button
                type="submit"
                disabled={loading || !selectedFile}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: loading || !selectedFile ? "#ccc" : "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: loading || !selectedFile ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "📤 Procesando factura..." : "💾 Procesar y guardar gasto"}
              </button>
            </form>
          </div>
        )}

        {/* Tab: Acciones Rápidas */}
        {activeTab === "actions" && (
          <div style={{ padding: "30px" }}>
            <h2 style={{ 
              color: "#333",
              marginBottom: "25px",
              fontSize: "1.5rem"
            }}>
              ⚡ Acciones Rápidas
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px"
            }}>
              {[
                { 
                  action: "ver_presupuesto", 
                  label: "Ver Presupuesto", 
                  icon: "💰",
                  description: "Consulta tu presupuesto actual"
                },
                { 
                  action: "ver_gastos", 
                  label: "Lista de Gastos", 
                  icon: "📋",
                  description: "Revisa todos tus gastos registrados"
                },
                { 
                  action: "resumen", 
                  label: "Resumen Financiero", 
                  icon: "📊",
                  description: "Obtén un análisis de tu situación"
                }
              ].map(item => (
                <button
                  key={item.action}
                  onClick={() => handleQuickAction(item.action)}
                  disabled={loading}
                  style={{
                    padding: "20px",
                    border: "2px solid #e1e8ed",
                    borderRadius: "15px",
                    background: "white",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "center"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.15)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = "#e1e8ed";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>
                    {item.icon}
                  </div>
                  <h3 style={{ 
                    color: "#333", 
                    margin: "0 0 8px 0",
                    fontSize: "16px"
                  }}>
                    {item.label}
                  </h3>
                  <p style={{ 
                    color: "#666", 
                    margin: "0",
                    fontSize: "12px",
                    lineHeight: "1.4"
                  }}>
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Respuesta del agente */}
        {response && (
          <div style={{
            background: "#f8f9fc",
            padding: "30px",
            borderTop: "1px solid #e1e8ed"
          }}>
            <h3 style={{ 
              color: "#333", 
              marginBottom: "15px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              🤖 Respuesta del Agente Financiero
            </h3>
            
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #e1e8ed",
              fontSize: "14px",
              lineHeight: "1.6"
            }}>
              {response.error ? (
                <div style={{ color: "#e74c3c" }}>
                  ❌ {response.error}
                </div>
              ) : (
                <pre style={{ 
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: "0",
                  fontFamily: "inherit",
                  color: "#333"
                }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center",
        marginTop: "30px",
        color: "rgba(255,255,255,0.7)",
        fontSize: "14px"
      }}>
        <p style={{ margin: "0" }}>
          🔐 Tus datos están seguros • Session ID: {sessionId?.substring(0, 8)}...
        </p>
      </div>
    </div>
  );
}

export default App;
