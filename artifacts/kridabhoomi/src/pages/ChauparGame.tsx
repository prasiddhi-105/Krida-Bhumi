import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/hooks/useAchievements";
import { INITIAL_TOKENS, TokenState, rollCowries, getValidMoves, executeMove, getAIAction } from "@/lib/chauparLogic";
import { Dices, Trophy, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function ChauparGame() {
  const { visitPage, playGame, rollChaupar, winChaupar, winGame } = useAchievements();
  
  const [tokens, setTokens] = useState<TokenState[]>(INITIAL_TOKENS);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [roll, setRoll] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [message, setMessage] = useState("Roll the cowrie shells to start!");

  useEffect(() => {
    visitPage("/games/chaupar");
    playGame();
  }, [visitPage, playGame]);

  const handleRoll = () => {
    if (turn !== 1 || winner || rolling || roll !== null) return;
    
    setRolling(true);
    rollChaupar();
    setMessage("Rolling...");
    
    setTimeout(() => {
      const result = rollCowries();
      setRoll(result);
      setRolling(false);
      
      const validMoves = getValidMoves(tokens, 1, result);
      if (validMoves.length === 0) {
        setMessage(`Rolled a ${result}. No valid moves. AI's turn.`);
        setTimeout(() => endTurn(1), 2000);
      } else {
        setMessage(`Rolled a ${result}. Select a token to move.`);
      }
    }, 1000);
  };

  const handleTokenClick = (tokenId: number) => {
    if (turn !== 1 || roll === null || winner) return;
    
    const validMoves = getValidMoves(tokens, 1, roll);
    if (!validMoves.find(t => t.id === tokenId)) {
      // Invalid token clicked
      return;
    }

    executePlayerMove(tokenId, roll);
  };

  const executePlayerMove = (tokenId: number, moveRoll: number) => {
    const { tokens: newTokens, capture, won } = executeMove(tokens, tokenId, moveRoll);
    setTokens(newTokens);
    
    if (checkWin(newTokens, 1)) return;
    
    if (capture || moveRoll === 6) {
      setMessage("Bonus turn!");
      setRoll(null); // Player rolls again
    } else {
      setMessage("AI's turn...");
      endTurn(1);
    }
  };

  const endTurn = (currentPlayer: 1 | 2) => {
    setRoll(null);
    setTurn(currentPlayer === 1 ? 2 : 1);
  };

  // AI Turn Logic
  useEffect(() => {
    if (turn === 2 && !winner) {
      const aiPlay = async () => {
        setRolling(true);
        setMessage("AI is rolling...");
        await new Promise(r => setTimeout(r, 1000));
        
        const result = rollCowries();
        setRoll(result);
        setRolling(false);
        
        const action = getAIAction(tokens, result);
        
        if (action === null) {
          setMessage(`AI rolled a ${result}. No valid moves.`);
          await new Promise(r => setTimeout(r, 2000));
          endTurn(2);
        } else {
          setMessage(`AI rolled a ${result}. Moving...`);
          await new Promise(r => setTimeout(r, 1000));
          
          const { tokens: newTokens, capture } = executeMove(tokens, action, result);
          setTokens(newTokens);
          
          if (checkWin(newTokens, 2)) return;
          
          if (capture || result === 6) {
            setMessage("AI gets a bonus turn!");
            await new Promise(r => setTimeout(r, 2000));
            setRoll(null);
            // Re-trigger AI play is handled by effect dependencies
          } else {
            setMessage("Your turn! Roll the shells.");
            endTurn(2);
          }
        }
      };
      
      aiPlay();
    }
  }, [turn, roll]); // Deliberate deps

  const checkWin = (currentTokens: TokenState[], player: 1 | 2) => {
    const pTokens = currentTokens.filter(t => t.player === player);
    if (pTokens.every(t => t.won)) {
      setWinner(player);
      if (player === 1) {
        winChaupar();
        winGame('chaupar');
      }
      return true;
    }
    return false;
  };

  const resetGame = () => {
    setTokens(INITIAL_TOKENS);
    setTurn(1);
    setRoll(null);
    setWinner(null);
    setMessage("Roll the cowrie shells to start!");
    playGame();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-['Cinzel_Decorative'] font-bold text-primary mb-6 text-center">Chaupar</h1>
      
      <Tabs defaultValue="play" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-border">
          <TabsTrigger value="play" className="font-['Cinzel_Decorative'] text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Play</TabsTrigger>
          <TabsTrigger value="learn" className="font-['Cinzel_Decorative'] text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Learn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="play" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Board Area */}
            <div className="w-full md:w-2/3 bg-card rounded-xl border-2 border-primary/40 p-4 md:p-8 flex items-center justify-center shadow-[0_0_30px_rgba(232,146,46,0.1)]">
              <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                {/* Simplified Cross Board representation */}
                {/* Vertical Arm */}
                <div className="absolute top-0 bottom-0 left-1/3 right-1/3 bg-background border border-primary/30 flex flex-col justify-between p-2">
                  <div className="text-center text-xs font-serif opacity-50">AI Base</div>
                  <div className="text-center text-xs font-serif opacity-50">Player Base</div>
                </div>
                {/* Horizontal Arm */}
                <div className="absolute left-0 right-0 top-1/3 bottom-1/3 bg-background border border-primary/30 flex justify-between items-center p-2">
                   <div className="text-xs font-serif opacity-50 rotate-[-90deg]">Path</div>
                   <div className="text-xs font-serif opacity-50 rotate-90">Path</div>
                </div>
                {/* Center Home */}
                <div className="absolute top-1/3 bottom-1/3 left-1/3 right-1/3 bg-card border-2 border-primary flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-['Cinzel_Decorative'] shadow-inner">Home</div>
                </div>

                {/* Tokens visualization - Simplified placement for abstract board */}
                {tokens.map(t => {
                  if (t.won) return null;
                  
                  // Compute abstract positions
                  let x = "50%"; let y = "50%";
                  if (t.home) {
                    if (t.player === 1) { x = "50%"; y = "90%"; } // Player base (bottom)
                    else { x = "50%"; y = "10%"; } // AI base (top)
                  } else {
                    // map 0-83 to the cross roughly
                    // Just a visual approximation
                    const p = t.position;
                    if (p < 21) { x = "80%"; y = `${80 - (p*3)}%`; } // Right arm going up
                    else if (p < 42) { x = `${80 - ((p-21)*3)}%`; y = "20%"; } // Top arm going left
                    else if (p < 63) { x = "20%"; y = `${20 + ((p-42)*3)}%`; } // Left arm going down
                    else { x = `${20 + ((p-63)*3)}%`; y = "80%"; } // Bottom arm going right
                  }

                  const isPlayable = turn === 1 && roll !== null && t.player === 1 && getValidMoves(tokens, 1, roll).find(v => v.id === t.id);

                  return (
                    <motion.div
                      key={t.id}
                      className={`absolute w-6 h-6 rounded-full -ml-3 -mt-3 shadow-md z-10 flex items-center justify-center
                        ${t.player === 1 ? 'bg-secondary' : 'bg-primary'}
                        ${isPlayable ? 'ring-4 ring-green-400 ring-opacity-50 cursor-pointer hover:scale-110' : ''}
                      `}
                      animate={{ left: x, top: y }}
                      transition={{ type: "spring", stiffness: 100 }}
                      onClick={() => isPlayable && handleTokenClick(t.id)}
                    >
                      <div className="w-2 h-2 rounded-full bg-white/50" />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Controls Area */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
              <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                <h3 className="font-['Cinzel_Decorative'] text-xl text-primary mb-2 border-b border-border pb-2">Status</h3>
                <p className="font-serif font-semibold text-lg mb-4 h-12 flex items-center">{message}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-2 rounded ${turn === 1 ? 'bg-secondary/10 border border-secondary/30' : ''}`}>
                    <div className="w-4 h-4 rounded-full bg-secondary inline-block mr-2" />
                    <span className="font-semibold text-sm">Player (You)</span>
                  </div>
                  <div className={`p-2 rounded ${turn === 2 ? 'bg-primary/10 border border-primary/30' : ''}`}>
                    <div className="w-4 h-4 rounded-full bg-primary inline-block mr-2" />
                    <span className="font-semibold text-sm">Opponent (AI)</span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <motion.div 
                    className="w-24 h-24 bg-background border-2 border-primary/50 rounded-lg flex flex-col items-center justify-center mb-4 shadow-inner"
                    animate={rolling ? { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {roll !== null && !rolling ? (
                      <span className="text-4xl font-bold text-primary">{roll}</span>
                    ) : (
                      <Dices className="w-10 h-10 text-muted-foreground opacity-50" />
                    )}
                    <span className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold">Roll</span>
                  </motion.div>

                  <Button 
                    size="lg" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-wide"
                    onClick={handleRoll}
                    disabled={turn !== 1 || roll !== null || rolling || winner !== null}
                  >
                    Throw Cowries
                  </Button>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-xl border border-border text-sm font-serif text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Quick Rules:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Roll 1 or 6 to enter a token.</li>
                  <li>Land on opponent to capture them.</li>
                  <li>Get all 4 tokens home to win.</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="learn" className="bg-card p-8 rounded-xl border border-border mt-6">
          <div className="max-w-3xl mx-auto space-y-8 font-serif">
            <h2 className="text-3xl font-['Cinzel_Decorative'] text-primary">The Epic Game of Kings</h2>
            
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Origin:</strong> Dating back over 4000 years, Chaupar is one of the oldest board games in existence. It is famously mentioned in the ancient Indian epic, the Mahabharata.
              </p>
              <p>
                <strong className="text-foreground">Cultural Significance:</strong> It was the game played between the Pandavas (Yudhishthira) and the Kauravas (Duryodhana), which ultimately led to the great Kurukshetra war. In later centuries, Mughal Emperor Akbar was so fond of the game that he built life-sized boards in his palaces at Fatehpur Sikri and Agra, using harem servants as playing pieces.
              </p>
              <p>
                <strong className="text-foreground">Equipment:</strong> Traditionally played on a cloth board shaped like a cross. The dice used were cowrie shells, where the number of shells landing with their opening facing up determined the move.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Win Modal */}
      <Dialog open={winner !== null} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md bg-card border-primary">
          <DialogHeader>
            <DialogTitle className="text-center font-['Cinzel_Decorative'] text-3xl text-primary flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8" />
              {winner === 1 ? "Victory!" : "Defeat"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center font-serif text-lg">
            {winner === 1 
              ? "You have claimed the royal throne. A true master of Chaupar!" 
              : "The AI has outmaneuvered you. The kingdom is lost."}
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={resetGame} className="gap-2 bg-primary">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
}
