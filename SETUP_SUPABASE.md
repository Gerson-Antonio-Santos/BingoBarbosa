# 🚀 Configurar Supabase em 5 Minutos

## Passo 1: Criar Conta Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project" ou "Sign up"
3. Use GitHub, Google ou Email
4. Confirme email

## Passo 2: Criar um Novo Projeto

1. Clique em "New project"
2. Nome: `bingo-barbosa`
3. Region: `America (South America - São Paulo)` 
4. Database Password: **Salve isso em um lugar seguro!**
5. Clique "Create new project" (espere ~2 min)

## Passo 3: Criar Tabela de Jogadores

1. Na esquerda, clique em **SQL Editor**
2. Cole este SQL:

```sql
CREATE TABLE jogadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  cartela BIGINT[] NOT NULL,
  numerosSelecionados BIGINT[] DEFAULT ARRAY[]::bigint[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para buscar rápido
CREATE INDEX idx_jogadores_nome ON jogadores(nome);
```

3. Clique "Run" (deve aparecer "Success!")

## Passo 4: Obter Credenciais

1. Clique em **Settings** (engrenagem na esquerda)
2. Clique em **API**
3. Copie estas 2 linhas:

```
Project URL: https://xxxxxxxxx.supabase.co
anon public key: eyJ...
```

## Passo 5: Criar Arquivo .env

Na raiz do projeto (`bingo-barbosa`), crie arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

## Passo 6: Permitir Acesso Público (RLS Policy)

1. Volte para Supabase
2. Clique **SQL Editor**
3. Cole:

```sql
ALTER TABLE jogadores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON jogadores
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON jogadores
  FOR SELECT USING (true);

CREATE POLICY "Allow public update" ON jogadores
  FOR UPDATE USING (true);
```

4. Clique "Run"

---

## ✅ Pronto!

Agora você tem:
- ✅ Tabela `jogadores` criada
- ✅ Supabase URL e API Key
- ✅ Arquivo `.env.local` com credenciais
- ✅ RLS liberado para INSERT, SELECT, UPDATE

**Próximo passo:** Instalar dependências e criar a API!

---

## 📝 Dúvidas?

- **Não recebi email de confirmação?** Aguarde 5 min ou vá diretamente em supabase.com e faça login
- **Projeto não quer criar?** Tente outra região (us-east-1)
- **SQL deu erro?** Copie e cole exatamente como está
- **Aonde acho as credenciais?** Settings → API (veja Passo 4)
