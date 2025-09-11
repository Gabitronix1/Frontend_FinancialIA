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

      const rawData = await res.json();
      
      // 🔄 Normalizar respuesta como en ChatPage
      let processedData = rawData.response ?? rawData;
      
      // Si viene como array con .output (OpenAI tools) → tomar .output
      if (Array.isArray(processedData) && processedData[0]?.output) {
        processedData = processedData[0].output;
      }
      
      setResponse(processedData);
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

  const styles = {
    // Design Tokens
    colors: {
      primary: '#0E3A53',
      accent: '#1B5E20',
      danger: '#C62828',
      bg: '#F5F7FA',
      text: '#2A2E33',
      border: '#D9DEE5',
      white: '#FFFFFF',
      gray50: '#F8FAFC',
      gray100: '#F1F5F9',
      gray200: '#E2E8F0',
      gray300: '#CBD5E1',
      gray600: '#475569',
      gray700: '#334155',
      gray800: '#1E293B'
    },
    
    // Base Styles
    app: {
      fontFamily: "'Inter', 'Manrope', system-ui, -apple-system, sans-serif",
      backgroundColor: '#F5F7FA',
      minHeight: "100vh",
      padding: "20px"
    },
    
    // Header
    header: {
      textAlign: "center",
      marginBottom: "32px"
    },
    
    title: {
      color: '#0E3A53',
      fontSize: "2.25rem",
      fontWeight: "700",
      margin: "0",
      letterSpacing: "-0.025em"
    },
    
    subtitle: {
      color: '#475569',
      fontSize: "1rem",
      margin: "8px 0 0 0",
      fontWeight: "400"
    },
    
    // Navigation
    tabContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "24px",
      gap: "8px"
    },
    
    tab: (isActive) => ({
      padding: "12px 20px",
      border: "2px solid",
      borderColor: isActive ? '#0E3A53' : '#D9DEE5',
      borderRadius: "12px",
      backgroundColor: isActive ? '#0E3A53' : '#FFFFFF',
      color: isActive ? '#FFFFFF' : '#475569',
      fontWeight: isActive ? "600" : "500",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      outline: "none",
      ':hover': {
        borderColor: '#0E3A53',
        transform: "translateY(-1px)"
      },
      ':focus-visible': {
        boxShadow: "0 0 0 3px rgba(14, 58, 83, 0.2)"
      }
    }),
    
    // Main Container
    mainContainer: {
      maxWidth: "896px",
      margin: "0 auto",
      backgroundColor: '#FFFFFF',
      borderRadius: "16px",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      overflow: "hidden",
      border: "1px solid #E2E8F0"
    },
    
    // Content sections
    contentSection: {
      padding: "32px"
    },
    
    sectionTitle: {
      color: '#2A2E33',
      fontSize: "1.5rem",
      fontWeight: "600",
      marginBottom: "24px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    
    // Form elements
    input: {
      width: "100%",
      padding: "16px",
      border: "2px solid #D9DEE5",
      borderRadius: "8px",
      fontSize: "16px",
      outline: "none",
      transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      boxSizing: "border-box",
      fontFamily: "inherit",
      backgroundColor: '#FFFFFF',
      color: '#2A2E33'
    },
    
    inputFocused: {
      borderColor: '#0E3A53',
      boxShadow: "0 0 0 3px rgba(14, 58, 83, 0.1)"
    },
    
    button: (variant = 'primary', disabled = false) => ({
      width: "100%",
      padding: "16px 24px",
      backgroundColor: disabled 
        ? '#CBD5E1' 
        : variant === 'primary' 
          ? '#0E3A53' 
          : variant === 'success' 
            ? '#1B5E20' 
            : '#FFFFFF',
      color: disabled 
        ? '#64748B' 
        : variant === 'primary' || variant === 'success' 
          ? '#FFFFFF' 
          : '#2A2E33',
      border: variant === 'outline' ? "2px solid #D9DEE5" : "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.2s ease-in-out",
      outline: "none",
      fontFamily: "inherit"
    }),
    
    // File upload area
    uploadArea: (hasFile) => ({
      border: "2px dashed",
      borderColor: hasFile ? '#1B5E20' : '#0E3A53',
      borderRadius: "12px",
      padding: "48px 24px",
      textAlign: "center",
      marginBottom: "24px",
      backgroundColor: hasFile ? 'rgba(27, 94, 32, 0.02)' : 'rgba(14, 58, 83, 0.02)',
      cursor: "pointer",
      transition: "all 0.2s ease-in-out"
    }),
    
    uploadIcon: {
      fontSize: "48px",
      marginBottom: "16px",
      display: "block"
    },
    
    uploadText: {
      color: '#2A2E33',
      fontSize: "18px",
      fontWeight: "600",
      margin: "0 0 8px 0"
    },
    
    uploadSubtext: {
      color: '#475569',
      fontSize: "14px",
      margin: "0"
    },
    
    // Quick actions grid
    actionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "16px"
    },
    
    actionCard: {
      padding: "24px",
      border: "2px solid #E2E8F0",
      borderRadius: "12px",
      backgroundColor: '#FFFFFF',
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      textAlign: "center",
      outline: "none"
    },
    
    actionCardHover: {
      borderColor: '#0E3A53',
      transform: "translateY(-2px)",
      boxShadow: "0 10px 15px -3px rgba(14, 58, 83, 0.1), 0 4px 6px -2px rgba(14, 58, 83, 0.05)"
    },
    
    actionIcon: {
      fontSize: "32px",
      marginBottom: "12px",
      display: "block"
    },
    
    actionTitle: {
      color: '#2A2E33',
      fontSize: "16px",
      fontWeight: "600",
      margin: "0 0 8px 0"
    },
    
    actionDescription: {
      color: '#64748B',
      fontSize: "14px",
      margin: "0",
      lineHeight: "1.4"
    },
    
    // Response section
    responseSection: {
      backgroundColor: '#F8FAFC',
      padding: "32px",
      borderTop: "1px solid #E2E8F0"
    },
    
    responseTitle: {
      color: '#2A2E33',
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    
    responseContent: {
      backgroundColor: '#FFFFFF',
      padding: "24px",
      borderRadius: "8px",
      border: "1px solid #E2E8F0",
      fontSize: "14px",
      lineHeight: "1.6"
    },
    
    responseText: {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      margin: "0",
      fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', monospace",
      color: '#2A2E33'
    },
    
    errorText: {
      color: '#C62828',
      fontWeight: "500"
    },
    
    // Footer
    footer: {
      textAlign: "center",
      marginTop: "32px",
      color: '#64748B',
      fontSize: "14px"
    },
    
    footerText: {
      margin: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px"
    }
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          Mi Agente Financiero
        </h1>
        <p style={styles.subtitle}>
          Tu asistente personal para el control de gastos y presupuestos
        </p>
      </header>

      {/* Navegación por pestañas */}
      <nav style={styles.tabContainer}>
        {[
          { key: "chat", label: "Consultas", icon: "💬" },
          { key: "upload", label: "Subir Factura", icon: "📄" },
          { key: "actions", label: "Acciones Rápidas", icon: "⚡" }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={styles.tab(activeTab === tab.key)}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.target.style.borderColor = '#0E3A53';
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.target.style.borderColor = '#D9DEE5';
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            <span style={{ marginRight: "6px" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenedor principal */}
      <main style={styles.mainContainer}>
        
        {/* Tab: Chat */}
        {activeTab === "chat" && (
          <section style={styles.contentSection}>
            <h2 style={styles.sectionTitle}>
              <span>💬</span>
              Consultas al Agente
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <input
                  type="text"
                  value={input}
                  placeholder="Pregúntame sobre tus finanzas, análisis de gastos o reportes..."
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  style={{
                    ...styles.input,
                    ...(document.activeElement === document.querySelector('input[type="text"]') ? styles.inputFocused : {})
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0E3A53';
                    e.target.style.boxShadow = "0 0 0 3px rgba(14, 58, 83, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#D9DEE5';
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || (!input.trim() && !selectedFile)}
                style={styles.button('primary', loading || (!input.trim() && !selectedFile))}
                onMouseEnter={(e) => {
                  if (!loading && (input.trim() || selectedFile)) {
                    e.target.style.backgroundColor = '#1A4D66';
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 6px -1px rgba(14, 58, 83, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && (input.trim() || selectedFile)) {
                    e.target.style.backgroundColor = '#0E3A53';
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {loading ? (
                  <span>🔄 Procesando consulta...</span>
                ) : (
                  <span>💼 Enviar consulta</span>
                )}
              </button>
            </form>
          </section>
        )}

        {/* Tab: Upload */}
        {activeTab === "upload" && (
          <section style={styles.contentSection}>
            <h2 style={styles.sectionTitle}>
              <span>📄</span>
              Procesar Documento
            </h2>
            
            <div style={styles.uploadArea(selectedFile)}>
              <input
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: "none" }}
                id="file-upload"
              />
              
              <label htmlFor="file-upload" style={{ cursor: "pointer", display: "block" }}>
                <span style={styles.uploadIcon}>
                  {selectedFile ? "✅" : "📎"}
                </span>
                
                <h3 style={styles.uploadText}>
                  {selectedFile ? selectedFile.name : "Seleccionar documento"}
                </h3>
                
                <p style={styles.uploadSubtext}>
                  {selectedFile 
                    ? "Documento listo para procesar" 
                    : "Formatos soportados: PNG, JPG, PDF, DOC, DOCX"
                  }
                </p>
              </label>
            </div>
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                placeholder="Instrucciones adicionales para el procesamiento (opcional)..."
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                style={{
                  ...styles.input,
                  marginBottom: "16px"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0E3A53';
                  e.target.style.boxShadow = "0 0 0 3px rgba(14, 58, 83, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D9DEE5';
                  e.target.style.boxShadow = "none";
                }}
              />
              
              <button
                type="submit"
                disabled={loading || !selectedFile}
                style={styles.button('success', loading || !selectedFile)}
                onMouseEnter={(e) => {
                  if (!loading && selectedFile) {
                    e.target.style.backgroundColor = '#2E7D32';
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 6px -1px rgba(27, 94, 32, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && selectedFile) {
                    e.target.style.backgroundColor = '#1B5E20';
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {loading ? (
                  <span>📤 Procesando documento...</span>
                ) : (
                  <span>💾 Procesar y registrar gasto</span>
                )}
              </button>
            </form>
          </section>
        )}

        {/* Tab: Acciones Rápidas */}
        {activeTab === "actions" && (
          <section style={styles.contentSection}>
            <h2 style={styles.sectionTitle}>
              <span>⚡</span>
              Acciones Rápidas
            </h2>
            
            <div style={styles.actionsGrid}>
              {[
                { 
                  action: "ver_presupuesto", 
                  label: "Ver Presupuesto", 
                  icon: "💰",
                  description: "Consulta el estado actual de tu presupuesto"
                },
                { 
                  action: "ver_gastos", 
                  label: "Lista de Gastos", 
                  icon: "📋",
                  description: "Revisa el detalle de todos tus gastos registrados"
                },
                { 
                  action: "resumen", 
                  label: "Resumen Financiero", 
                  icon: "📊",
                  description: "Obtén un análisis completo de tu situación financiera"
                }
              ].map(item => (
                <button
                  key={item.action}
                  onClick={() => handleQuickAction(item.action)}
                  disabled={loading}
                  style={styles.actionCard}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#0E3A53';
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 10px 15px -3px rgba(14, 58, 83, 0.1), 0 4px 6px -2px rgba(14, 58, 83, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                >
                  <span style={styles.actionIcon}>
                    {item.icon}
                  </span>
                  <h3 style={styles.actionTitle}>
                    {item.label}
                  </h3>
                  <p style={styles.actionDescription}>
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Respuesta del agente */}
        {response && (
          <section style={styles.responseSection}>
            <h3 style={styles.responseTitle}>
              <span>🤖</span>
              Respuesta del Agente Financiero
            </h3>
            
            <div style={styles.responseContent}>
              {response.error ? (
                <div style={styles.errorText}>
                  <strong>⚠️ Error:</strong> {response.error}
                </div>
              ) : (
                <pre style={styles.responseText}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          <span>🔐</span>
          <span>Conexión segura</span>
          <span>•</span>
          <span>Session ID: {sessionId?.substring(0, 8)}...</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
