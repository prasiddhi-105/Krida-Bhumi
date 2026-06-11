export const INITIAL_BOARD = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0];
// Indices 0-6: Player 1 pits
// Indices 7-13: Player 2 pits
// Index 14: Player 1 store
// Index 15: Player 2 store

export type Player = 1 | 2;

export const executePallanguzhiMove = (
  board: number[],
  startIndex: number,
  player: Player
): { newBoard: number[], nextTurn: Player } => {
  let b = [...board];
  let seeds = b[startIndex];
  b[startIndex] = 0;
  
  let currentIndex = startIndex;
  
  while (seeds > 0) {
    currentIndex = (currentIndex + 1) % 14; // Skip stores during distribution
    
    b[currentIndex]++;
    seeds--;
    
    // Last seed placed
    if (seeds === 0) {
      let nextPitIndex = (currentIndex + 1) % 14;
      
      // If the next pit has seeds, continue relay
      if (b[nextPitIndex] > 0) {
        seeds = b[nextPitIndex];
        b[nextPitIndex] = 0;
        currentIndex = nextPitIndex;
      } else {
        // Next pit is empty -> CAPTURE
        let pitAfterEmpty = (nextPitIndex + 1) % 14;
        let oppositePit = 13 - pitAfterEmpty; // Simple opposite calculation
        
        let captured = 0;
        if (b[pitAfterEmpty] > 0) {
          captured += b[pitAfterEmpty];
          b[pitAfterEmpty] = 0;
        }
        if (b[oppositePit] > 0) {
          captured += b[oppositePit];
          b[oppositePit] = 0;
        }
        
        if (captured > 0) {
          if (player === 1) b[14] += captured;
          else b[15] += captured;
        }
        break; // Turn ends
      }
    }
  }
  
  return { newBoard: b, nextTurn: player === 1 ? 2 : 1 };
};

export const checkWin = (board: number[]): { winner: Player | 0, over: boolean } => {
  let p1Seeds = board.slice(0, 7).reduce((a, b) => a + b, 0);
  let p2Seeds = board.slice(7, 14).reduce((a, b) => a + b, 0);
  
  if (p1Seeds === 0 || p2Seeds === 0) {
    // Add remaining seeds to respective stores
    let p1Store = board[14] + p1Seeds;
    let p2Store = board[15] + p2Seeds;
    
    if (p1Store > p2Store) return { winner: 1, over: true };
    if (p2Store > p1Store) return { winner: 2, over: true };
    return { winner: 0, over: true }; // Draw
  }
  return { winner: 0, over: false };
};

export const getAIPallanguzhiMove = (board: number[]): number | null => {
  const validMoves = [];
  for (let i = 7; i <= 13; i++) {
    if (board[i] > 0) validMoves.push(i);
  }
  if (validMoves.length === 0) return null;
  return validMoves[Math.floor(Math.random() * validMoves.length)];
};
