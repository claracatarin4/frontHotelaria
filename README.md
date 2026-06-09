# Hotel Luxe — Frontend

Frontend React para o sistema de hotelaria, integrado com os microserviços de backend.

## Fluxo de Telas

```
/ (Menu)  →  /login  →  /home (quartos)
              ↓
           /cadastro
```

## Microserviços integrados

| Serviço        | Porta | Variável de ambiente      |
|----------------|-------|---------------------------|
| cliente/usuário| 9531  | `VITE_USUARIO_API`        |
| quarto         | 9533  | `VITE_QUARTO_API`         |
| reserva        | 9532  | `VITE_RESERVA_API`        |
| pagamento      | 9534  | `VITE_PAGAMENTO_API`      |

## Setup

### 1. Copiar e configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com os endereços corretos dos seus backends (ex: se rodar no Docker, use o IP do container).

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar o projeto

```bash
npm run dev
```

Acesse: http://localhost:5173

## Endpoints utilizados

### Usuário (porta 9531)
- `POST /usuario/cadastrar` — criar usuário (login + senha)
- `POST /usuario/login` — autenticar e obter JWT
- `POST /` — criar perfil de cliente (nome, CPF, telefone, etc.)

### Quarto (porta 9533)
- `GET /quartos` — listar quartos (suporta filtros: `status`, `tipoQuartoId`, `skip`, `take`)
- `GET /quartos/:id` — detalhe de um quarto

## Estrutura de pastas

```
src/
├── context/        # AuthContext (JWT + user state)
├── pages/
│   ├── Menu/       # Landing page (/)
│   ├── Login/      # Tela de login (/login)
│   ├── Cadastro/   # Cadastro em 2 etapas (/cadastro)
│   └── Home/       # Listagem de quartos (/home)
├── routes/         # AppRoutes.jsx (React Router)
├── services/       # api.js (instâncias axios)
└── index.css       # Design tokens globais
```

## Tecnologias

- React 19 + Vite
- React Router DOM v7
- Axios
- CSS Modules
- Google Fonts (Cormorant Garamond + DM Sans)
