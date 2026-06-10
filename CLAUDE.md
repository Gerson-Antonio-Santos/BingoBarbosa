# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, default port 5173)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

No test suite is configured.

## Environment

Requires a `.env.local` file with:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Architecture

This is a **real-time multiplayer bingo app** built with React + TypeScript + Vite. Two distinct browser views communicate through a shared Supabase backend:

- **Tela Principal** (`/TelaPrincipal`) — the host screen: draws numbers, shows all drawn numbers, lists players, validates bingo claims, and manages player cards.
- **Cartela Jogador** (`/CartelaJogador`) — the player screen: shows a 5×5 card for the player to mark off drawn numbers. Opens a name-entry modal on first visit; persists `jogador-id` in `localStorage`.
- **Home** (`/`) — landing page with navigation and shareable URLs for both screens.

### State management

`BingoContext` (`src/context/BingoContext.tsx`) is the single source of truth, wrapping the entire app via `BingoProvider` in `src/main.tsx`. It holds:

- Draw state (`numbersDrawn`, `currentNumber`, `isRolling`) — persisted in `localStorage` and synced across browser tabs via the `storage` event.
- Player state (`jogadores`, `jogadorComPoder`, `carregandoJogadores`) — sourced from Supabase.

Supabase sync uses **two parallel strategies** for player data: a `setInterval` polling every 1 second AND a Supabase realtime channel (`postgres_changes` on the `jogadores` table). Both call the same `carregarJogadores` function.

The player card view (`CartelaJogador`) also polls independently every 3 seconds to keep in sync.

### Data layer

All Supabase operations go through `src/api/jogadoresController.ts`, which wraps the `jogadores` table. The `Jogador` interface used throughout the app maps from the DB shape (`numeros_selecionados`) to the context shape (`numerosSelecionados`).

### Bingo validation

Validation logic lives in `TelaPrincipalPage.temLinhaOuColunaCompleta()`. A valid bingo requires 5 numbers in the same row or column of the 5×5 card (25 positions, indexed 0–24). The cartela is stored as a flat `number[]` of 25 elements drawn from 1–80.

### Audio

Uses `howler.js`. Background music loops in `TelaPrincipal` (mounted/unmounted with the component). Sound effects play on number draw and bingo validation.
