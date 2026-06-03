# 🌐 Guia: Sincronização Entre Dispositivos Diferentes

Por padrão, o projeto usa **React Context** que sincroniza apenas entre abas **no mesmo navegador**.

Para sincronizar entre **dispositivos diferentes** (celular, tablet, outro PC), você tem 2 opções:

---

## Opção 1: LocalStorage (Simples, sem servidor)

### Vantagens:
- Sem necessidade de servidor
- Rápido de implementar
- Funciona offline (até certo ponto)

### Desvantagens:
- Sincronização com delay (polling necessário)
- Ambos dispositivos precisam recarregar para ver mudanças

### Implementação:

#### 1. Atualize `BingoContext.tsx`:

```typescript
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface BingoContextType {
  numbersDrawn: number[];
  currentNumber: number | null;
  isRolling: boolean;
  setNumbersDrawn: (numbers: number[]) => void;
  setCurrentNumber: (number: number | null) => void;
  setIsRolling: (isRolling: boolean) => void;
}

const STORAGE_KEY = 'bingo_state';

export const BingoContext = createContext<BingoContextType | undefined>(undefined);

export function BingoProvider({ children }: { children: ReactNode }) {
  const [numbersDrawn, setNumbersDrawn] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Salvar no localStorage
  useEffect(() => {
    const state = { numbersDrawn, currentNumber, isRolling };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [numbersDrawn, currentNumber, isRolling]);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      setNumbersDrawn(state.numbersDrawn);
      setCurrentNumber(state.currentNumber);
      setIsRolling(state.isRolling);
    }
  }, []);

  // Sincronizar quando outra aba muda localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const state = JSON.parse(e.newValue);
        setNumbersDrawn(state.numbersDrawn);
        setCurrentNumber(state.currentNumber);
        setIsRolling(state.isRolling);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BingoContext.Provider
      value={{
        numbersDrawn,
        currentNumber,
        isRolling,
        setNumbersDrawn,
        setCurrentNumber,
        setIsRolling,
      }}
    >
      {children}
    </BingoContext.Provider>
  );
}

export function useBingo() {
  const context = React.useContext(BingoContext);
  if (!context) {
    throw new Error('useBingo deve ser usado dentro de BingoProvider');
  }
  return context;
}
```

---

## Opção 2: WebSocket (Tempo real, com servidor)

### Vantagens:
- Sincronização em tempo real
- Funciona entre dispositivos diferentes
- Múltiplos jogadores simultâneos

### Desvantagens:
- Requer servidor WebSocket
- Mais complexo de implementar
- Deploy mais complicado

### Implementação (usando Socket.io):

#### 1. Instale as dependências:
```bash
npm install socket.io-client
```

#### 2. Crie `services/socketService.ts`:

```typescript
import io, { Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = (serverUrl: string) => {
  socket = io(serverUrl);
  return socket;
};

export const getSocket = () => socket;

export const emitNumberDrawn = (number: number, numbersDrawn: number[]) => {
  socket?.emit('numberDrawn', { number, numbersDrawn });
};

export const onNumberDrawn = (callback: (data: any) => void) => {
  socket?.on('numberDrawn', callback);
};
```

#### 3. Atualize `BingoContext.tsx`:

```typescript
import { useEffect } from 'react';
import { getSocket, onNumberDrawn, emitNumberDrawn } from '../services/socketService';

export function BingoProvider({ children }: { children: ReactNode }) {
  const [numbersDrawn, setNumbersDrawn] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    
    // Receber números sorteados de outros clients
    onNumberDrawn((data) => {
      setNumbersDrawn(data.numbersDrawn);
      setCurrentNumber(data.number);
    });

    return () => {
      socket?.off('numberDrawn');
    };
  }, []);

  const setNumbersDrawnWithEmit = (numbers: number[]) => {
    setNumbersDrawn(numbers);
    const lastNumber = numbers[numbers.length - 1];
    emitNumberDrawn(lastNumber, numbers);
  };

  // ... resto do código
}
```

#### 4. Instale o servidor Node.js com Socket.io

Crie um arquivo `server.js`:
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

let gameState = {
  numbersDrawn: [],
  currentNumber: null
};

io.on('connection', (socket) => {
  console.log('Novo client conectado:', socket.id);
  
  // Enviar estado atual ao novo client
  socket.emit('initialState', gameState);

  socket.on('numberDrawn', (data) => {
    gameState = data;
    // Broadcast para todos os clients
    io.emit('numberDrawn', data);
  });

  socket.on('disconnect', () => {
    console.log('Client desconectado:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Servidor WebSocket rodando na porta 3001');
});
```

Instale dependências:
```bash
npm install express socket.io cors
```

Execute:
```bash
node server.js
```

---

## Comparação das Opções

| Critério | LocalStorage | WebSocket |
|----------|-------------|-----------|
| **Setup** | Muito fácil | Moderado |
| **Sincronização** | Com delay | Tempo real |
| **Entre dispositivos** | Não | Sim |
| **Escalabilidade** | Limitada | Excelente |
| **Servidor** | Não precisa | Precisa |
| **Offline** | Parcial | Não |
| **Complexidade** | Baixa | Alta |

---

## Recomendação

- **Para uso local/mesmo PC**: Usar o Context padrão (já implementado)
- **Para pequeno grupo (até 10 pessoas)**: LocalStorage é suficiente
- **Para produção/muitos usuários**: Use WebSocket

---

## Próximos Passos

1. Escolha uma abordagem
2. Implemente conforme o guia acima
3. Teste com múltiplos dispositivos
4. Ajuste conforme necessário

Boa sorte! 🎉
