# 🏗️ Arquitetura do Projeto

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                      main.tsx                               │
│              (Entry Point - Inicia App)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   BingoProvider                             │
│            (Fornece contexto React)                         │
│                                                             │
│  State Compartilhado:                                       │
│  - numbersDrawn: number[]                                   │
│  - currentNumber: number | null                             │
│  - isRolling: boolean                                       │
│  + setters para cada um                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx                                │
│              (Router Principal)                             │
│                                                             │
│  State: currentScreen ('home' | 'principal' | 'cartela')   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Renderiza Um Dos Três Componentes:                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────┬──────────────────────┬──────────────────┬──────────┘
         │                      │                  │
         ↓                      ↓                  ↓
    ┌────────┐          ┌──────────────┐    ┌───────────┐
    │  Home  │          │Principal     │    │ Cartela   │
    │        │          │Screen        │    │           │
    │- Botão│          │              │    │- Grid 5x5 │
    │ escolha│          │- Sorteio     │    │- Seleção  │
    │        │          │- Display #   │    │- Marca    │
    │        │          │- Histórico   │    │ sorteados │
    └────────┘          │- Buttons     │    └───────────┘
                        │- Audio       │
                        └──────────────┘
```

---

## Fluxo de Dados

### Quando um número é sorteado:

```
┌─────────────────────┐
│  drawNumber()       │
│  (PrincipalScreen)  │
└──────────┬──────────┘
           │ 1. Gera aleatório
           ↓
┌─────────────────────┐
│  setCurrentNumber   │
│  setNumbersDrawn    │
└──────────┬──────────┘
           │ 2. Atualiza Context
           ↓
┌─────────────────────────────────────────┐
│  BingoContext (re-renderiza)            │
│  - currentNumber: [47]                  │
│  - numbersDrawn: [..., 47]              │
└──────────┬──────────────────────────────┘
           │ 3. Notifica subscribers
           ↓
        ┌──────────────┐
        │  Cartela     │
        │  re-renders  │ ← Recebe número 47!
        └──────────────┘
```

---

## Estrutura de Arquivos Detalhada

```
bingo-barbosa/
│
├── src/
│   ├── components/               # Componentes React
│   │   ├── Home.tsx              # Tela de seleção inicial
│   │   ├── Home.css              # Estilos da Home
│   │   ├── PrincipalScreen.tsx    # Tela de sorteio
│   │   ├── PrincipalScreen.css    # Estilos da Principal
│   │   ├── Cartela.tsx            # Cartela 5x5
│   │   └── Cartela.css            # Estilos da Cartela
│   │
│   ├── context/                 # Estado Compartilhado
│   │   └── BingoContext.tsx      # Contexto e Provider
│   │
│   ├── types/                   # Tipos TypeScript
│   │   └── index.ts             # Interfaces
│   │
│   ├── assets/                  # Mídia (áudio, imagens)
│   │   ├── background.mp3       # Música de fundo
│   │   ├── roleta.mp3           # Som do sorteio
│   │   ├── win.mp3              # Som de vitória
│   │   └── bg.jpg               # Imagem de fundo
│   │
│   ├── App.tsx                  # Componente raiz (router)
│   ├── App.css                  # Estilos globais
│   ├── main.tsx                 # Entry point
│   └── index.css                # CSS global
│
├── public/                      # Arquivos estáticos
│
├── QUICK_START.md               # Guia rápido de uso
├── GUIA_COMPLETO.md             # Documentação completa
├── SINCRONIZACAO_AVANCADA.md    # Guia de sincronização
│
├── package.json                 # Dependências
├── tsconfig.json                # Configuração TypeScript
├── vite.config.ts               # Configuração Vite
├── eslint.config.js             # Configuração ESLint
└── index.html                   # HTML principal
```

---

## Fluxo de Estado (State Management)

### Componente: PrincipalScreen

```typescript
const { numbersDrawn, setNumbersDrawn, ... } = useBingo();

// Ao sortear:
const drawNumber = () => {
  // 1. Pega número aleatório
  const newNumber = ...
  
  // 2. Atualiza Context (sincroniza para todos!)
  setNumbersDrawn([...numbersDrawn, newNumber]);
};
```

### Componente: Cartela

```typescript
const { numbersDrawn } = useBingo();

// Observa mudanças
useEffect(() => {
  // Atualiza visual dos números sorteados
  setCartelaNumbers(prev =>
    prev.map(item => ({
      ...item,
      isDrawn: numbersDrawn.includes(item.number)
    }))
  );
}, [numbersDrawn]); // Reage às mudanças!
```

---

## Ciclo de Vida

### Na Inicialização:

1. `main.tsx` → Renderiza `App`
2. `App` → Renderizado dentro de `BingoProvider`
3. `BingoProvider` → Fornece estado inicial (vazio)
4. `App` → Mostra `Home`

### Ao Escolher "Tela Principal":

1. `Home` → Click em botão
2. `App` → Muda `currentScreen` para "principal"
3. `App` → Renderiza `PrincipalScreen`
4. `PrincipalScreen` → Conecta ao `useBingo()` hook
5. Pronto para sortear!

### Ao Sortear um Número:

1. `PrincipalScreen` → Click "Sortear"
2. `drawNumber()` → Gera número aleatório
3. `setNumbersDrawn()` → Atualiza Context
4. `BingoProvider` → Re-renderiza subscribers
5. `Cartela` → Recebe `numbersDrawn` atualizado
6. `Cartela` → useEffect() dispara
7. `Cartela` → Marca número como "sorteado"
8. Tela atualiza visualmente ✅

---

## Relações Entre Componentes

```
┌──────────────────────────────────────┐
│          BingoContext                │
│  (Source of Truth - Single Store)    │
└────────┬─────────────┬───────────────┘
         │ provide     │
         │ consume     │
    ┌────▼────┐    ┌───▼─────┐
    │Principal│    │ Cartela  │
    │Screen   │    │          │
    │(writer) │    │ (reader) │
    └─────────┘    └──────────┘
```

---

## Padrões Usados

### 1. **React Context API**
- Evita prop drilling
- Compartilha estado entre componentes desacoplados
- Perfeito para múltiplas abas do mesmo site

### 2. **Custom Hook (useBingo)**
- Encapsula lógica de acesso ao Context
- Reutilizável em múltiplos componentes

### 3. **Conditional Rendering**
- App mostra diferentes componentes baseado em state
- Simples e eficiente para roteamento básico

### 4. **Controlled Components**
- Cartela números são controlled (React gerencia state)
- Seleção sincronizada com eventos

---

## Como Estender?

### Adicionar Nova Tela:

1. Crie `src/components/NovaTelaScreen.tsx`
2. Use `useBingo()` se precisar de dados compartilhados
3. Em `App.tsx`, adicione:
   ```typescript
   if (currentScreen === 'novaTela') {
     return <NovaTelaScreen />;
   }
   ```
4. Adicione botão em `Home.tsx`

### Adicionar Novo Estado Global:

1. Edite `BingoContext.tsx`
2. Adicione novo state:
   ```typescript
   const [novoState, setNovoState] = useState(...);
   ```
3. Inclua nos values do Provider
4. Use em qualquer componente com `useBingo()`

---

## Performance

- ✅ Context atualiza apenas subscribers que usam valores alterados
- ✅ Cartela só re-renderiza quando `numbersDrawn` muda
- ✅ PrincipalScreen só re-renderiza quando necessário
- ✅ CSS otimizado com Vite
- ✅ Assets minimizados no build

---

**Sua arquitetura está pronta para escalar! 🚀**
