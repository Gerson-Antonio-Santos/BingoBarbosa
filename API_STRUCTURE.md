# 📚 Estrutura da API Supabase

## 📁 Pasta `src/api/`

```
src/api/
├── supabase.ts              ← Configuração do Supabase
├── jogadoresController.ts   ← Controller com CRUD de jogadores
└── index.ts                 ← Exporta tudo facilmente
```

---

## 🔧 Arquivos Criados

### 1. `src/api/supabase.ts`
Arquivo de **configuração** que conecta ao Supabase.

Lê as variáveis de ambiente:
- `VITE_SUPABASE_URL` - URL do seu projeto
- `VITE_SUPABASE_ANON_KEY` - Chave pública

### 2. `src/api/jogadoresController.ts`
**Controller** com 6 funções principais:

#### `criarJogador(nome, cartela)`
Cria novo jogador no Supabase
```typescript
const jogador = await criarJogador("João", [1, 2, 3, ...]);
// Retorna: { id: "uuid", nome: "João", cartela: [...], ... }
```

#### `buscarJogador(id)`
Busca um jogador por ID
```typescript
const jogador = await buscarJogador("uuid-do-jogador");
```

#### `listarJogadores()`
Lista todos os jogadores
```typescript
const jogadores = await listarJogadores();
// Retorna array com todos os jogadores
```

#### `atualizarNumerosSelecionados(id, numerosSelecionados)`
Atualiza números selecionados do jogador
```typescript
await atualizarNumerosSelecionados("uuid", [1, 5, 12, ...]);
```

#### `atualizarCartela(id, cartela)`
Gera nova cartela
```typescript
await atualizarCartela("uuid", [21, 34, 45, ...]);
```

#### `deletarJogador(id)`
Remove jogador
```typescript
await deletarJogador("uuid");
```

### 3. `src/api/index.ts`
Exporta todas as funções facilmente:
```typescript
import { criarJogador, listarJogadores } from '../api';
```

---

## 🗄️ Tabela do Supabase

```sql
CREATE TABLE jogadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  cartela BIGINT[] NOT NULL,
  numerosSelecionados BIGINT[] DEFAULT ARRAY[]::bigint[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Campos:**
- `id` - Identificador único (UUID)
- `nome` - Nome do jogador
- `cartela` - Array com 25 números
- `numerosSelecionados` - Array de números marcados
- `created_at` - Data de criação

---

## 🔑 Configuração de Ambiente

### Arquivo `.env.local`

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

**⚠️ Importante:**
- Nunca commit `.env.local` (já está em `.gitignore`)
- Use `.env.local.example` como template
- Mantenha `.env.local` seguro (nunca compartilhe)

---

## 💡 Como Usar na Aplicação

### Exemplo: Salvar novo jogador

```typescript
import { criarJogador } from '../api';

const handleNomeSubmit = async (nome: string) => {
  const cartela = [1, 5, 12, 23, 34, ...]; // 25 números
  const jogador = await criarJogador(nome, cartela);
  
  if (jogador) {
    console.log('Jogador criado:', jogador.id);
  }
};
```

### Exemplo: Buscar jogadores

```typescript
import { listarJogadores } from '../api';

const jogadores = await listarJogadores();
console.log('Total de jogadores:', jogadores.length);
```

---

## 🚀 Próximos Passos

1. ✅ Estrutura criada
2. ✅ Dependências instaladas
3. ⏳ **Configure Supabase** (veja `SETUP_SUPABASE.md`)
4. ⏳ Atualize `BingoContext.tsx` para usar a API
5. ⏳ Atualize `CartelaJogador.tsx` para salvar no banco

---

## 📖 Referências

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Exemplos](https://github.com/supabase/supabase/tree/master/examples)
