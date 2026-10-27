# FiscalFlow (protótipo)

Protótipo visual navegável para monitoramento operacional de documentos fiscais eletrônicos (NF-e, NFS-e, CT-e, MDF-e).

## Requisitos

- Node.js 20+

## Executar

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

## Scripts

| Comando        | Descrição              |
| -------------- | ---------------------- |
| `npm run dev`  | Servidor de desenvolvimento |
| `npm run build`| Build de produção      |
| `npm run lint` | Verificação TypeScript |

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- i18next (pt-BR, en, es)
- Recharts (saúde operacional)
- Lucide React (ícones)

Dados são fictícios e locais; não há backend nesta etapa.
