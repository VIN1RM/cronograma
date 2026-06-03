// ============================================================
//  DADOS DO CRONOGRAMA
//  Formato de data: "DD/MM/AAAA"
//  Status possíveis: "Em andamento" | "Planejado" | "Concluído" | "Atrasado"
//  Prioridade: "Alta" | "Média" | "Baixa"
// ============================================================

export const TAREFAS = [
  {
    id: 1,
    funcionalidade: "Update Documentos",
    modulo: "Geral",
    dataInicio: "08/06/2026",
    dataFim: "19/06/2026",
    status: "Em andamento",
    prioridade: "Alta",
  },
  {
    id: 2,
    funcionalidade: "CNPJ Alfanumérico",
    modulo: "Geral",
    dataInicio: "22/06/2026",
    dataFim: "24/06/2026",
    status: "Planejado",
    prioridade: "Alta",
  },
  {
    id: 3,
    funcionalidade: "Descontos",
    modulo: "Geral",
    dataInicio: "24/06/2026",
    dataFim: "10/07/2026",
    status: "Planejado",
    prioridade: "Alta",
  },
  {
    id: 4,
    funcionalidade: "Casas Vazias",
    modulo: "Geral",
    dataInicio: "13/07/2026",
    dataFim: "31/07/2026",
    status: "Planejado",
    prioridade: "Alta",
  },
]

export const COR_STATUS = {
  "Em andamento": { bg: "#F59E0B", text: "#1a1a1a", barra: "#F59E0B" },
  "Planejado":    { bg: "#6366F1", text: "#ffffff", barra: "#6366F1" },
  "Concluído":    { bg: "#10B981", text: "#ffffff", barra: "#10B981" },
  "Atrasado":     { bg: "#EF4444", text: "#ffffff", barra: "#EF4444" },
}

export const COR_PRIORIDADE = {
  "Alta":  "#EF4444",
  "Média": "#F59E0B",
  "Baixa": "#10B981",
}
