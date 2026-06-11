export type Player = 1 | 2;
export type TokenState = { id: number; position: number; home: boolean; won: boolean; player: Player };

// Path definitions for Chaupar
// The board is a cross. We can represent the path as a linear track from 0 to 83.
// Each arm is 3x8 squares. 
// For simplicity in UI logic:
// Safe squares: 11, 28, 45, 62, 79... Let's just use indices.
// Start positions: Player 1 starts at index 0, Player 2 starts at index 42 (opposite).

export const SAFE_SQUARES = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80];

export const INITIAL_TOKENS: TokenState[] = [
  { id: 1, position: -1, home: true, won: false, player: 1 },
  { id: 2, position: -1, home: true, won: false, player: 1 },
  { id: 3, position: -1, home: true, won: false, player: 1 },
  { id: 4, position: -1, home: true, won: false, player: 1 },
  { id: 5, position: -1, home: true, won: false, player: 2 },
  { id: 6, position: -1, home: true, won: false, player: 2 },
  { id: 7, position: -1, home: true, won: false, player: 2 },
  { id: 8, position: -1, home: true, won: false, player: 2 },
];

export const rollCowries = (): number => {
  let ones = 0;
  for (let i = 0; i < 3; i++) {
    ones += Math.random() > 0.5 ? 1 : 0;
  }
  return ones === 0 ? 6 : ones;
};

// Returns tokens that can be moved
export const getValidMoves = (tokens: TokenState[], player: Player, roll: number): TokenState[] => {
  return tokens.filter(t => {
    if (t.player !== player || t.won) return false;
    if (t.home) {
      return roll === 1 || roll === 6; // Needs 1 or 6 to enter
    }
    // Check if move exceeds end
    return t.position + roll <= 84; 
  });
};

export const executeMove = (tokens: TokenState[], tokenId: number, roll: number): { tokens: TokenState[], capture: boolean, won: boolean } => {
  let newTokens = [...tokens.map(t => ({...t}))];
  const tokenIndex = newTokens.findIndex(t => t.id === tokenId);
  const token = newTokens[tokenIndex];
  let capture = false;
  let won = false;

  if (token.home) {
    // Enter board. Player 1 enters at 0, Player 2 at 42
    token.home = false;
    token.position = token.player === 1 ? 0 : 42;
  } else {
    token.position += roll;
    if (token.position >= 84) {
      token.won = true;
      token.position = 84;
      won = true;
    }
  }

  // Check captures
  if (!token.home && !token.won && !SAFE_SQUARES.includes(token.position)) {
    // Check if opponent token is here
    for (let t of newTokens) {
      if (t.player !== token.player && !t.home && !t.won && t.position === token.position) {
        t.home = true;
        t.position = -1;
        capture = true;
      }
    }
  }

  return { tokens: newTokens, capture, won };
};

export const getAIAction = (tokens: TokenState[], roll: number): number | null => {
  const validMoves = getValidMoves(tokens, 2, roll);
  if (validMoves.length === 0) return null;

  // Simple heuristic: 
  // 1. Capture opponent if possible
  // 2. Enter token if at home
  // 3. Move token closest to win
  
  for (const t of validMoves) {
    if (t.home) return t.id; // Prefer entering

    const hypotheticalPos = t.position + roll;
    if (!SAFE_SQUARES.includes(hypotheticalPos)) {
      const captures = tokens.some(tok => tok.player === 1 && !tok.home && !tok.won && tok.position === hypotheticalPos);
      if (captures) return t.id;
    }
  }
  
  // Pick token closest to win
  return validMoves.sort((a, b) => b.position - a.position)[0].id;
};
