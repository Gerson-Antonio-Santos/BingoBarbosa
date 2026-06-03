# 🎮 Guia de URLs - Bingo Família Barbosa

## 📍 URLs Disponíveis

Após iniciar `npm run dev`, acesse:

### **🏠 Home (Tela Inicial)**
```
http://localhost:5173/
```
Escolha entre as duas opções de telas.

### **🎲 Tela Principal (Sorteio)**
```
http://localhost:5173/TelaPrincipal
```
- Sorteie números até 80
- Veja lista de todos os jogadores conectados à esquerda
- Visualize histórico de números sorteados
- Compartilhe essa URL com o sorteador

### **🎫 Cartela do Jogador**
```
http://localhost:5173/CartelaJogador
```
- Um modal pedirá seu nome
- Após inserir o nome, ele aparece na lista da TelaPrincipal
- Receba a cartela 5x5 com números
- Clique nos números para marcar
- Compartilhe essa URL com cada jogador

---

## 🎯 Como Jogar com Múltiplos Dispositivos

### **Configuração**

**Dispositivo 1 (Sorteador):**
1. Acesse: `http://localhost:5173/TelaPrincipal`
2. Mantenha essa tela aberta
3. Verá a lista de jogadores à esquerda se preenchendo

**Dispositivo 2+ (Jogadores):**
1. Acesse: `http://localhost:5173/CartelaJogador`
2. Digite seu nome no popup
3. Receba sua cartela 5x5
4. Aguarde pelos números a serem sorteados

### **Durante o Jogo**

**No Sorteador (TelaPrincipal):**
- Clique "Sortear" para gerar números aleatórios
- Veja os nomes dos jogadores conectados à esquerda
- Histórico de sorteados aparece embaixo

**Nos Jogadores (CartelaJogador):**
- Números aparecem automaticamente conforme sorteados
- Clique nos números para marcar (muda cor para rosa/magenta)
- Veja os números sorteados na parte inferior

---

## 🌐 Para Múltiplos Dispositivos Físicos

Se quiser jogar em dispositivos diferentes (celulares, tablets, notebooks):

### **1. Descubra o IP da máquina (Windows)**
```powershell
ipconfig
```
Procure por "IPv4 Address" (algo como: `192.168.x.x`)

### **2. Substitua localhost pelo IP**

**Tela Principal:**
```
http://192.168.1.100:5173/TelaPrincipal
```

**Cartela Jogador:**
```
http://192.168.1.100:5173/CartelaJogador
```

### **3. Compartilhe as URLs**
- Envie por WhatsApp, email, etc.
- Todos acessam as URLs no IP da sua máquina
- Sincronização automática!

---

## 🎨 Fluxo Visual

```
http://localhost:5173/
         ↓
    ┌─────┴─────┐
    ↓           ↓
TelaPrincipal  CartelaJogador
(Sorteio)      (Cada Jogador)
    ↓           ↓
    └─────┬─────┘
        Sincronizam automaticamente!
```

---

## 📱 Funcionalidades das URLs

### TelaPrincipal
| Funcionalidade | Status |
|---|---|
| Sortear números | ✅ |
| Ver lista de jogadores | ✅ |
| Histórico de sorteados | ✅ |
| Botão Bingou! | ✅ |
| Botão Reiniciar | ✅ |
| Voltar para Home | ✅ |

### CartelaJogador
| Funcionalidade | Status |
|---|---|
| Modal para inserir nome | ✅ |
| Cartela 5x5 | ✅ |
| Clique para marcar | ✅ |
| Sincronização em tempo real | ✅ |
| Cores diferenciadas | ✅ |
| Botão Nova Cartela | ✅ |
| Visualizar sorteados | ✅ |
| Voltar para Home | ✅ |

---

## 🔄 Sincronização

### Como Funciona
1. **TelaPrincipal** sorteio um número
2. Atualiza no `BingoContext` (React Context)
3. **CartelaJogador** recebe a atualização
4. Marca o número automaticamente
5. Tudo acontece **em tempo real** (sem delay)

### Estado Compartilhado
```
numbersDrawn = [3, 15, 28, 42, ...]
currentNumber = 42
jogadores = [
  { id: "jogador_123", nome: "João", cartela: [...], ... },
  { id: "jogador_456", nome: "Maria", cartela: [...], ... }
]
```

---

## 🆚 Diferenças Entre as URLs

| Aspecto | TelaPrincipal | CartelaJogador |
|--------|---|---|
| **Função** | Sorteia números | Marca cartela |
| **Acesso** | Uma única instância | Múltiplas instâncias |
| **Modal de Nome** | Não | Sim (ao abrir) |
| **Botões** | Sortear, Bingou!, Reiniciar | Nova Cartela |
| **Lista de Jogadores** | Visível (esquerda) | Não visível |
| **Números Sorteados** | Na tela principal | Na parte inferior |

---

## 💡 Dicas

### Melhor Experiência
- Use **TelaPrincipal** em uma TV/monitor grande para todos verem
- Use **CartelaJogador** em celulares/tablets para cada jogador
- Mantenha todos conectados à mesma rede WiFi

### Expandir Jogadores
- Cada nova instância de **CartelaJogador** adiciona um novo jogador
- O nome aparece automaticamente na lista da **TelaPrincipal**
- Pode ter até o limite de navegadores abertos!

### Reiniciar Jogo
- Clique "Reiniciar" na **TelaPrincipal**
- Todos os números sorteados são apagados
- As cartelas continuam ativas (números não mudam)

---

## 🐛 Problemas Comuns

### "Não vejo a lista de jogadores atualizar"
→ Abra **TelaPrincipal** antes de abrir **CartelaJogador**

### "Meu nome não aparece"
→ Digite o nome e clique "Começar a Jogar" no modal

### "A sincronização demora"
→ Verifique a conexão de rede
→ Recarregue a página (F5)

### "Cartela não sincroniza entre dispositivos"
→ **Esta é uma limitação atual** (usa React Context local)
→ Veja o guia `SINCRONIZACAO_AVANCADA.md` para WebSocket

---

## 🚀 URLs de Exemplo Rápido

**Para anotar e compartilhar:**

```
Sorteador:
http://localhost:5173/TelaPrincipal

Jogador 1:
http://localhost:5173/CartelaJogador

Jogador 2:
http://localhost:5173/CartelaJogador
```

Copie e cole nos navegadores dos seus amigos!

---

**Tudo pronto para jogar! 🎉**
