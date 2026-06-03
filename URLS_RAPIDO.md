# 🎬 COMECE AQUI - URLs do Bingo!

## ⚡ As 2 URLs que você Precisa

### 1️⃣ Tela Principal (SORTEIO)
```
http://localhost:5173/TelaPrincipal
```
👉 **Abra EM APENAS UM dispositivo/navegador**
- Clique "Sortear" para gerar números
- Veja lista de jogadores conectados
- Histórico dos números sorteados

### 2️⃣ Cartela do Jogador (CADA PESSOA)
```
http://localhost:5173/CartelaJogador
```
👉 **Cada jogador abre EM SEU dispositivo/aba**
- Digitará seu nome no popup
- Receberá cartela 5x5
- Verá números sincronizados automaticamente

---

## 🚀 Como Começar Agora

### PASSO 1: Instale
```bash
npm install
```

### PASSO 2: Execute
```bash
npm run dev
```

### PASSO 3: Abra URLs
| Quem | URL |
|-----|-----|
| **Sorteador** | http://localhost:5173/TelaPrincipal |
| **Jogador 1** | http://localhost:5173/CartelaJogador |
| **Jogador 2** | http://localhost:5173/CartelaJogador |
| **Jogador N** | http://localhost:5173/CartelaJogador |

---

## 👥 Exemplo com Nomes

```
Sorteador (João):
http://localhost:5173/TelaPrincipal

Jogadora 1 (Maria):
http://localhost:5173/CartelaJogador
└─ Popup: Digite "Maria" → Começar

Jogador 2 (Pedro):
http://localhost:5173/CartelaJogador
└─ Popup: Digite "Pedro" → Começar

Resultado na TelaPrincipal:
👥 Jogadores:
- Maria ✅
- Pedro ✅
```

---

## 🎮 Fluxo Rápido

1. **TelaPrincipal**: Clique "Sortear"
2. **CartelaJogador**: Vê número aparecer automaticamente
3. **CartelaJogador**: Clica no número para marcar
4. Repita até alguém completar uma linha
5. **TelaPrincipal**: Clique "Bingou!"

---

## 🌐 Para Múltiplos Dispositivos

Se quiser em **celular, tablet, outro PC:**

### 1. Descubra seu IP (Windows):
```cmd
ipconfig
```
Procure `IPv4 Address`: `192.168.X.X`

### 2. Use no lugar de localhost:
```
Sorteador: http://192.168.X.X:5173/TelaPrincipal
Jogadores: http://192.168.X.X:5173/CartelaJogador
```

### 3. Acesse em outros dispositivos (mesma rede WiFi)

---

## ❓ FAQ Rápido

**P: Posso abrir ambas as URLs no mesmo navegador?**  
R: Sim! Mas para sincronizar entre dispositivos diferentes, veja a seção acima.

**P: E se esquecer de digitar o nome?**  
R: Um popup aparece toda vez que abre CartelaJogador.

**P: Como fazer nova cartela?**  
R: Clique o botão "Nova Cartela" na CartelaJogador.

**P: Como reiniciar o jogo?**  
R: Clique "Reiniciar" na TelaPrincipal.

---

## 📚 Guias Completos

- **GUIA_URLS.md** - Todas as URLs explicadas
- **QUICK_START.md** - Guia completo em 5 passos
- **GUIA_COMPLETO.md** - Documentação detalhada
- **START_HERE.md** - Guia anterior (mais detalhado)

---

**Pronto! Bom jogo! 🎉**
