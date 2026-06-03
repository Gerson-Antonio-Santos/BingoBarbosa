# 🎮 Quick Start - Bingo Família Barbosa

## 5 Passos Rápidos

### 1️⃣ Instale as dependências
```bash
npm install
```

### 2️⃣ Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 3️⃣ Abra duas abas no navegador
- **Aba 1**: `http://localhost:5173` → Clique em "Tela Principal"
- **Aba 2**: `http://localhost:5173` → Clique em "Sua Cartela"

### 4️⃣ Comece a jogar
- **Aba 1** (Principal): Clique "Sortear" para sortear números
- **Aba 2** (Cartela): Os números aparecem na cartela automaticamente
- Clique nos números para selecioná-los

### 5️⃣ Quando alguém completa uma sequência
- Clique em "Bingou!" na Aba 1
- Ou reinicie o jogo com "Reiniciar"

---

## 🎨 Interface

### **Tela Home** (Escolha)
```
┌─────────────────────────────────┐
│   🎰 Bingo Família Barbosa 🎰   │
│                                 │
│  ┌──────────────┐ ┌──────────┐ │
│  │    🎲        │ │   🎫     │ │
│  │ Tela Principal│ │Sua Cartela│
│  │  Sortear     │ │ Marcar   │ │
│  │  números     │ │ números  │ │
│  └──────────────┘ └──────────┘ │
└─────────────────────────────────┘
```

### **Tela Principal** (Sorteio)
```
┌──────────────────────────────┐
│ ← Voltar                     │
│                              │
│   Bingo Família Barbosa      │
│                              │
│          [ 47 ]              │
│   (Grande número sorteado)   │
│                              │
│  [Sortear] [Bingou!] [Reset] │
│                              │
│  Números Sorteados:          │
│  🔴 3  🔴 15 🔴 28 🔴 42 ...  │
└──────────────────────────────┘
```

### **Tela de Cartela** (5x5)
```
┌──────────────────────────────┐
│ ← Voltar                     │
│                              │
│        Sua Cartela           │
│                              │
│  ┌─┬─┬─┬─┬─┐                  │
│  │1│2│3│4│5│                  │
│  ├─┼─┼─┼─┼─┤ 🟦 = Sorteado   │
│  │6│7│8│9│0│ 🟪 = Selecionado│
│  ├─┼─┼─┼─┼─┤ 🟩 = Sorteado + │
│  │...      │   Selecionado   │
│  │...      │                 │
│  └─┴─┴─┴─┴─┘                 │
│                              │
│    [Nova Cartela]            │
└──────────────────────────────┘
```

---

## 📊 Fluxo de Sincronização

```
┌──────────────────────────────────────────────────┐
│            App (BingoProvider)                   │
│  ┌──────────────────────────────────────────┐   │
│  │     BingoContext                         │   │
│  │  - numbersDrawn: number[]               │   │
│  │  - currentNumber: number | null         │   │
│  │  - isRolling: boolean                   │   │
│  └──────────────────────────────────────────┘   │
│                    ↓                             │
│     ┌──────────────┴──────────────┐            │
│     ↓                             ↓            │
│ PrincipalScreen            Cartela           │
│ (Atualiza state)          (Lê state)          │
│                                                │
│ drawNumber() ─→ setNumbersDrawn()             │
│     ↓                                          │
│  Context atualiza                            │
│     ↓                                          │
│  Cartela re-renderiza ✅                       │
└──────────────────────────────────────────────────┘
```

---

## 🔧 Comandos Principais

```bash
# Desenvolvimento
npm run dev      # Inicia servidor local

# Build
npm run build    # Cria versão otimizada
npm run preview  # Visualiza o build

# Qualidade
npm run lint     # Verifica código
```

---

## 📦 O Que Cada Arquivo Faz

| Arquivo | Função |
|---------|--------|
| `App.tsx` | Roteador entre Home/Principal/Cartela |
| `BingoContext.tsx` | Gerencia estado compartilhado |
| `PrincipalScreen.tsx` | Sorteio de números |
| `Cartela.tsx` | Grid 5x5 com seleção |
| `Home.tsx` | Tela inicial |
| `*.css` | Estilos e responsividade |

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Cartela não sincroniza | Verifique se está no mesmo navegador |
| Números não aparecem | Recarregue a página (F5) |
| Sem som | Verifique `src/assets/` tem os áudios |
| Lento | Tente `npm run build` para produção |

---

## 🎯 Próximas Melhorias

- [ ] Sincronizar entre dispositivos diferentes (WebSocket)
- [ ] Salvar histórico de partidas
- [ ] Temas escuro/claro
- [ ] Leitura de números em voz alta
- [ ] Multiplayer avançado

---

## 📞 Dúvidas?

Consulte:
- `GUIA_COMPLETO.md` - Documentação detalhada
- `SINCRONIZACAO_AVANCADA.md` - Como expandir para múltiplos dispositivos

**Aproveite o jogo! 🎉**
