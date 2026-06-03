import React, { useMemo, useState } from "react"
import { TAREFAS, COR_STATUS, COR_PRIORIDADE } from "./dados.js"

function parseDate(str) {
  const [d, m, y] = str.split("/").map(Number)
  return new Date(y, m - 1, d)
}

function fmtDia(date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`
}

function gerarDias(inicio, fim) {
  const dias = []
  const cur = new Date(inicio)
  while (cur <= fim) {
    dias.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return dias
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export default function App() {
  const [hoverId, setHoverId] = useState(null)

  const tarefas = useMemo(() =>
    TAREFAS.map(t => ({
      ...t,
      inicio: parseDate(t.dataInicio),
      fim: parseDate(t.dataFim),
    })),
    [])

  const minData = useMemo(() => new Date(Math.min(...tarefas.map(t => t.inicio))), [tarefas])
  const maxData = useMemo(() => new Date(Math.max(...tarefas.map(t => t.fim))), [tarefas])

  const inicio = useMemo(() => { const d = new Date(minData); d.setDate(d.getDate() - 2); return d }, [minData])
  const fim = useMemo(() => { const d = new Date(maxData); d.setDate(d.getDate() + 3); return d }, [maxData])

  const dias = useMemo(() => gerarDias(inicio, fim), [inicio, fim])
  const totalDias = dias.length

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  function posX(date) {
    return (date - inicio) / (fim - inicio)
  }

  const grupos = useMemo(() => {
    const g = []
    let cur = null
    dias.forEach((d, i) => {
      const key = `${d.getFullYear()}-${d.getMonth()}`
      if (!cur || cur.key !== key) {
        cur = { key, mes: MESES[d.getMonth()], ano: d.getFullYear(), inicio: i, count: 1 }
        g.push(cur)
      } else {
        cur.count++
      }
    })
    return g
  }, [dias])

  const COL_W = 36
  const ROW_H = 60
  const LABEL_W = 220

  const totalW = totalDias * COL_W

  const hojeX = (hoje >= inicio && hoje <= fim)
    ? Math.floor((hoje - inicio) / 86400000) * COL_W + COL_W / 2
    : null

  return (
    <div style={{ minHeight: "100vh", padding: "40px 32px", background: "var(--bg)" }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 8, height: 40,
            background: "linear-gradient(to bottom, #7C6CFA, #F59E0B)",
            borderRadius: 4,
          }} />
          <div>
            <h1 style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "var(--text)",
            }}>
              Cronograma de Desenvolvimento - Projeto Quickness
            </h1>
            <p style={{ color: "var(--muted)", fontFamily: "'DM Mono',monospace", fontSize: 13, marginTop: 4 }}>
              {tarefas.length} entregas · {fmtDia(minData)} → {fmtDia(maxData)}
            </p>
          </div>
        </div>

        {/* Legenda status */}
        <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
          {Object.entries(COR_STATUS).map(([st, cor]) => (
            <div key={st} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: cor.barra }} />
              <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'DM Mono',monospace" }}>{st}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela Gantt */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: LABEL_W + totalW, position: "relative" }}>

            {/* Cabeçalho meses */}
            <div style={{ display: "flex", borderBottom: `1px solid var(--border)` }}>
              <div style={{
                width: LABEL_W, flexShrink: 0, borderRight: `1px solid var(--border)`,
                padding: "12px 20px",
                fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px"
              }}>
                Funcionalidade
              </div>
              <div style={{ position: "relative", height: 38, flex: 1 }}>
                {grupos.map(g => (
                  <div key={g.key} style={{
                    position: "absolute",
                    left: g.inicio * COL_W,
                    width: g.count * COL_W,
                    height: "100%",
                    borderRight: `1px solid var(--border)`,
                    display: "flex", alignItems: "center",
                    paddingLeft: 12,
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#555566",
                    letterSpacing: "0.5px",
                  }}>
                    {g.mes} {g.ano}
                  </div>
                ))}
              </div>
            </div>

            {/* Cabeçalho dias */}
            <div style={{ display: "flex", borderBottom: `1px solid var(--border)` }}>
              <div style={{ width: LABEL_W, flexShrink: 0, borderRight: `1px solid var(--border)` }} />
              <div style={{ position: "relative", height: 28, flex: 1 }}>
                {dias.map((d, i) => {
                  const isHoje = d.getTime() === hoje.getTime()
                  const isSeg = d.getDay() === 1
                  return (
                    <div key={i} style={{
                      position: "absolute", left: i * COL_W, width: COL_W,
                      height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10,
                      color: isHoje ? "#D97706" : isSeg ? "#6666AA" : "var(--muted)",
                      fontWeight: isHoje ? 700 : 400,
                      borderRight: isSeg ? `1px dashed #CCCCDD` : "none",
                    }}>
                      {d.getDate()}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Linhas de tarefas */}
            {tarefas.map((t, idx) => {
              const cor = COR_STATUS[t.status] || COR_STATUS["Planejado"]
              const corPri = COR_PRIORIDADE[t.prioridade] || "#999"

              const startIdx = Math.floor((t.inicio - inicio) / 86400000)
              const endIdx = Math.floor((t.fim - inicio) / 86400000)
              const barLeft = startIdx * COL_W
              const barW = (endIdx - startIdx + 1) * COL_W
              const duracao = Math.round((t.fim - t.inicio) / 86400000) + 1

              const isHovered = hoverId === t.id

              return (
                <div
                  key={t.id}
                  onMouseEnter={() => setHoverId(t.id)}
                  onMouseLeave={() => setHoverId(null)}
                  style={{
                    display: "flex",
                    borderBottom: idx < tarefas.length - 1 ? `1px solid var(--border)` : "none",
                    background: isHovered ? "var(--surface2)" : "transparent",
                    transition: "background 0.15s",
                    height: ROW_H,
                  }}
                >
                  {/* Label */}
                  <div style={{
                    width: LABEL_W, flexShrink: 0,
                    borderRight: `1px solid var(--border)`,
                    padding: "0 20px",
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: 4,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: corPri, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
                        {t.funcionalidade}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)",
                      paddingLeft: 14,
                    }}>
                      {t.dataInicio} → {t.dataFim}
                    </div>
                  </div>

                  {/* Área da barra */}
                  <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
                    {/* Linhas de semana */}
                    {dias.map((d, i) => d.getDay() === 1 ? (
                      <div key={i} style={{
                        position: "absolute", left: i * COL_W,
                        width: 1, height: "100%",
                        background: "var(--border)", opacity: 0.5,
                      }} />
                    ) : null)}

                    {/* Barra Gantt */}
                    <div style={{
                      position: "absolute",
                      left: barLeft + 2,
                      width: barW - 4,
                      height: 32,
                      borderRadius: 6,
                      background: cor.barra,
                      opacity: 0.9,
                      display: "flex", alignItems: "center",
                      paddingLeft: 10, paddingRight: 10,
                      overflow: "hidden",
                      boxShadow: isHovered ? `0 0 0 2px ${cor.barra}55, 0 4px 16px ${cor.barra}40` : "none",
                      transition: "box-shadow 0.2s",
                      cursor: "default",
                    }}>
                      <span style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 11,
                        fontWeight: 500,
                        color: cor.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {t.status} · {duracao}d
                      </span>
                    </div>

                    {/* Tooltip ao hover */}
                    {isHovered && (
                      <div style={{
                        position: "absolute",
                        left: barLeft + barW / 2,
                        top: -80,
                        transform: "translateX(-50%)",
                        background: "#FFFFFF",
                        border: `1px solid ${cor.barra}`,
                        borderRadius: 10,
                        padding: "10px 14px",
                        zIndex: 100,
                        pointerEvents: "none",
                        minWidth: 180,
                        boxShadow: `0 8px 32px #00000060`,
                      }}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{t.funcionalidade}</div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#555566", lineHeight: 1.8 }}>
                          <div>Módulo: {t.modulo}</div>
                          <div>Início: {t.dataInicio}</div>
                          <div>Fim: {t.dataFim}</div>
                          <div>Duração: {duracao} dias</div>
                          <div style={{ marginTop: 4 }}>
                            <span style={{
                              background: cor.barra,
                              color: cor.text,
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 10,
                            }}>{t.status}</span>
                          </div>
                        </div>
                        {/* setinha */}
                        <div style={{
                          position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
                          width: 12, height: 7,
                          background: "#FFFFFF",
                          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                          borderTop: `1px solid ${cor.barra}`,
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Linha do hoje */}
            {hojeX !== null && (
              <div style={{
                position: "absolute",
                left: LABEL_W + hojeX,
                top: 0, bottom: 0,
                width: 2,
                background: "#F59E0B",
                opacity: 0.8,
                pointerEvents: "none",
                zIndex: 10,
              }}>
                <div style={{
                  position: "sticky", top: 0,
                  background: "#F59E0B",
                  color: "#1a1a1a",
                  fontSize: 9,
                  fontFamily: "'DM Mono',monospace",
                  fontWeight: 700,
                  padding: "2px 5px",
                  borderRadius: 3,
                  whiteSpace: "nowrap",
                  transform: "translateX(-50%)",
                }}>HOJE</div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Cards resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginTop: 32 }}>
        {tarefas.map(t => {
          const cor = COR_STATUS[t.status] || COR_STATUS["Planejado"]
          const corPri = COR_PRIORIDADE[t.prioridade] || "#999"
          const duracao = Math.round((t.fim - t.inicio) / 86400000) + 1
          return (
            <div key={t.id} style={{
              background: "var(--surface)",
              border: `1px solid var(--border)`,
              borderLeft: `3px solid ${cor.barra}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{t.funcionalidade}</span>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: corPri, marginTop: 3 }} />
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", lineHeight: 1.9 }}>
                <div>{t.dataInicio} → {t.dataFim}</div>
                <div>{duracao} dias úteis</div>
              </div>
              <div style={{
                marginTop: 10,
                display: "inline-block",
                background: `${cor.barra}22`,
                color: cor.barra,
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontFamily: "'DM Mono',monospace",
                fontWeight: 500,
              }}>
                {t.status}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 40, textAlign: "center", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>
        edite <code style={{ background: "var(--surface2)", padding: "2px 6px", borderRadius: 4 }}>src/dados.js</code> para atualizar o cronograma
      </div>
    </div>
  )
}
