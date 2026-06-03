# 🎰 Bingo Família Barbosa - Guia Completo

## 📋 O Que Foi Criado

Seu projeto agora tem uma arquitetura completa com múltiplas telas sincronizadas:

### **1. Tela Inicial (Home)**
- Permite escolher entre "Tela Principal" ou "Sua Cartela"
- Interface intuitiva com emojis e descrições
- Design responsivo para mobile

### **2. Tela Principal** 🎲
- **Sorteio de números**: Números aleatórios de 1 a 80
- **Display grande**: Mostra o número atual sorteado
- **Histórico**: Lista todos os números já sorteados em uma grid
- **Controles**: Sortear, Bingou!, Reiniciar
- **Música**: Toque de fundo e sons de sorteio
- **Sincronização**: Compartilha números com todas as cartelas conectadas

### **3. Tela de Cartela** 🎫
- **Grid 5x5**: 25 números aleatórios (1-80)
- **Seleção de números**: Clique para selecionar/desselecionar
- **Cores diferentes**:
  - **Roxo/Magenta**: Número selecionado por você
  - **Azul/Ciano**: Número sorteado
  - **Verde**: Número sorteado E selecionado
- **Nova cartela**: Botão para gerar novos números
- **Legenda**: Mostra o significado das cores
- **Sincronização**: Recebe números sorteados em tempo real

---

## 🚀 Como Usar

### **Usando em Múltiplos Dispositivos**

1. **Dispositivo 1 (Tela Principal)**
   - Abra `http://localhost:5173`
   - Clique em "Tela Principal"
   - Este será o sorteador de números

2. **Dispositivo 2+ (Cartelas)**
   - Abra `http://localhost:5173` em outro navegador/dispositivo
   - Clique em "Sua Cartela"
   - Receberá os números sorteados automaticamente
   - Pode selecionar números da sua cartela
   - Pode gerar novas cartelas quantas vezes quiser

### **Fluxo de Jogo**
1. Uma pessoa sorteios números na Tela Principal
2. Outras pessoas marcam os números em suas Cartelas
3. Quando completar uma sequência, clica em "Bingou!"
4. Para novo jogo, clica "Reiniciar" na Tela Principal

---

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── Home.tsx           # Tela inicial
│   ├── Home.css           # Estilos da Home
│   ├── PrincipalScreen.tsx # Tela de sorteio
│   ├── PrincipalScreen.css # Estilos da Principal
│   ├── Cartela.tsx        # Cartela 5x5
│   └── Cartela.css        # Estilos da Cartela
├── context/
│   └── BingoContext.tsx   # Contexto React para sincronização
├── types/
│   └── index.ts           # Tipos TypeScript
├── App.tsx                # Roteador principal
├── App.css                # Estilos globais
├── main.tsx               # Entry point
└── index.css              # CSS global
```

---

## 🔄 Como Funciona a Sincronização

O projeto usa **React Context** para sincronizar o estado entre as telas:

```typescript
// BingoContext.tsx
- numbersDrawn: Array de números já sorteados
- currentNumber: Número atual sorteado
- isRolling: Se está animando o sorteio
```

Quando a Tela Principal sorteios um número:
1. Atualiza o contexto com `setNumbersDrawn(...)`
2. Todas as Cartelas recebem a atualização automaticamente
3. As Cartelas marcam o número com cor de "Sorteado"

---

## 🎨 Customizações Possíveis

### **Cores Gradientes**
Edite as classes CSS `.cartela-number`, `.buttons button`, etc. para mudar cores.

### **Tamanho da Cartela**
Para mudar de 5x5 para outro tamanho, edite em `Cartela.tsx`:
```typescript
const selected = shuffled.slice(0, 25); // Mudar para 36 (6x6) ou 16 (4x4)
```

E em `Cartela.css`:
```css
grid-template-columns: repeat(5, 1fr); /* Mudar 5 para 6 ou 4 */
```

### **Número Máximo**
Altere em `PrincipalScreen.tsx` e `Cartela.tsx`:
```typescript
const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1); // Mudar 80
```

---

## 🐛 Solução de Problemas

### **As cartelas não sincronizam**
- Abra as duas abas **no mesmo navegador** (requisito do contexto React)
- Ou use localStorage/WebSocket para sincronizar entre dispositivos diferentes

### **Números não aparecem na cartela**
- A cartela é gerada com 25 números aleatórios ao abrir
- Se quiser novos números, clique em "Nova Cartela"

### **Música não toca**
- Verificar se os arquivos de áudio existem em `src/assets/`
- Chrome/Safari podem requerer interação do usuário antes de tocar áudio

---

## 📱 Responsividade

O projeto é **totalmente responsivo** para:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

Todas as telas se adaptam automaticamente ao tamanho da tela.

---

## ⚙️ Tecnologias Usadas

- **React 19**: Framework UI
- **TypeScript**: Tipagem estática
- **Vite**: Build tool rápido
- **Howler.js**: Gerenciamento de áudio
- **CSS3**: Gradientes, animações e responsividade

---

## 🎯 Próximas Ideias para Melhorias

1. **WebSocket**: Sincronizar entre diferentes navegadores/dispositivos
2. **LocalStorage**: Salvar histórico de cartelas
3. **Multiplayer**: Acompanhar múltiplos jogadores
4. **Leaderboard**: Ranking de quem faz bingo primeiro
5. **Themes**: Temas claros/escuros personalizáveis
6. **Voice**: Ler números em voz alta

---

**Aproveite o jogo! 🎉**
