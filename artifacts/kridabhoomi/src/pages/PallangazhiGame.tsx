import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAchievements } from "@/hooks/useAchievements";
import { INITIAL_BOARD, Player, executePallanguzhiMove, checkWin, getAIPallanguzhiMove } from "@/lib/pallangazhiLogic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trophy, RotateCcw } from "lucide-react";

export function PallangazhiGame() {
  const { visitPage, visitPallangazhiLearn, playGame, winGame } = useAchievements();
  
  const [board, setBoard] = useState<number[]>(INITIAL_BOARD);
  const [turn, setTurn] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 0 | null>(null);
  const [animating, setAnimating] = useState(false);
  const [message, setMessage] = useState("Your turn! Select a pit on your side (bottom).");

  useEffect(() => {
    visitPage("/games/pallanguzhi");
    playGame();
  }, [visitPage, playGame]);

  const handlePitClick = (index: number) => {
    if (turn !== 1 || winner !== null || animating) return;
    if (index < 0 || index > 6) return; // Player 1 can only click 0-6
    if (board[index] === 0) return;

    executeMove(index, 1);
  };

  const executeMove = async (index: number, player: Player) => {
    setAnimating(true);
    setMessage(player === 1 ? "Sowing seeds..." : "Opponent is sowing seeds...");
    
    // Slight delay for UX
    await new Promise(r => setTimeout(r, 500));
    
    const { newBoard, nextTurn } = executePallanguzhiMove(board, index, player);
    setBoard(newBoard);
    
    const { winner: winState, over } = checkWin(newBoard);
    if (over) {
      setWinner(winState);
      if (winState === 1) winGame('pallanguzhi');
      setAnimating(false);
      return;
    }
    
    setTurn(nextTurn);
    setAnimating(false);
    
    if (nextTurn === 1) {
      setMessage("Your turn! Select a pit.");
    } else {
      setMessage("AI's turn...");
    }
  };

  // AI Turn
  useEffect(() => {
    if (turn === 2 && winner === null && !animating) {
      const aiPlay = async () => {
        await new Promise(r => setTimeout(r, 1000));
        const move = getAIPallanguzhiMove(board);
        if (move !== null) {
          executeMove(move, 2);
        }
      };
      aiPlay();
    }
  }, [turn, winner, animating]); // intentional deps

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setTurn(1);
    setWinner(null);
    setMessage("Your turn! Select a pit on your side.");
    playGame();
  };

  const renderSeeds = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-secondary/80 absolute shadow-sm"
        style={{
          left: `${50 + (Math.random() * 40 - 20)}%`,
          top: `${50 + (Math.random() * 40 - 20)}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    ));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-['Cinzel_Decorative'] font-bold text-primary mb-6 text-center">Pallanguzhi</h1>
      
      <Tabs defaultValue="play" className="max-w-5xl mx-auto" onValueChange={(v) => { if(v === 'learn') visitPallangazhiLearn(); }}>
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-border">
          <TabsTrigger value="play" className="font-['Cinzel_Decorative'] text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Play</TabsTrigger>
          <TabsTrigger value="learn" className="font-['Cinzel_Decorative'] text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Learn</TabsTrigger>
        </TabsList>
        
        <TabsContent value="play" className="space-y-6">
          <div className="text-center mb-4">
            <p className="font-serif text-lg font-semibold text-foreground h-8">{message}</p>
          </div>

          <div className="bg-card rounded-[3rem] border-8 border-primary/20 p-6 md:p-12 shadow-[0_10px_30px_rgba(80,18,4,0.1)] relative">
            {/* The Wooden Board */}
            <div className="absolute inset-0 bg-[#8B4513] opacity-5 rounded-[2.5rem] pointer-events-none" />
            
            <div className="flex items-center justify-between gap-4">
              {/* P2 Store (Left) */}
              <div className="w-16 h-32 md:w-24 md:h-48 rounded-full bg-background border-4 border-primary/30 flex items-center justify-center relative shadow-inner overflow-hidden">
                {renderSeeds(board[15])}
                <div className="absolute top-2 text-xs font-bold text-muted-foreground">AI</div>
                <div className="absolute bottom-2 text-sm font-bold text-primary">{board[15]}</div>
              </div>

              {/* Middle Pits */}
              <div className="flex-1 flex flex-col gap-4">
                {/* P2 Pits (Top row, indices 13 down to 7) */}
                <div className="flex justify-between gap-2">
                  {[13, 12, 11, 10, 9, 8, 7].map(i => (
                    <div key={`p2-${i}`} className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center relative shadow-inner overflow-hidden">
                        {renderSeeds(board[i])}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{board[i]}</span>
                    </div>
                  ))}
                </div>
                
                {/* Center Divider line */}
                <div className="w-full h-px bg-primary/20" />

                {/* P1 Pits (Bottom row, indices 0 to 6) */}
                <div className="flex justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <div key={`p1-${i}`} className="flex flex-col items-center gap-1">
                      <span className="text-xs font-bold text-primary">{board[i]}</span>
                      <button 
                        className={`w-10 h-10 md:w-16 md:h-16 rounded-full bg-background border-2 flex items-center justify-center relative shadow-inner overflow-hidden transition-all
                          ${turn === 1 && !animating && board[i] > 0 ? 'border-primary ring-2 ring-primary/50 cursor-pointer hover:scale-105 hover:bg-primary/5' : 'border-primary/30 cursor-default'}`}
                        onClick={() => handlePitClick(i)}
                        disabled={turn !== 1 || animating || board[i] === 0}
                      >
                        {renderSeeds(board[i])}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* P1 Store (Right) */}
              <div className="w-16 h-32 md:w-24 md:h-48 rounded-full bg-background border-4 border-primary/30 flex items-center justify-center relative shadow-inner overflow-hidden">
                {renderSeeds(board[14])}
                <div className="absolute top-2 text-xs font-bold text-muted-foreground">P1</div>
                <div className="absolute bottom-2 text-sm font-bold text-primary">{board[14]}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
             <Button variant="outline" onClick={resetGame} className="border-primary text-primary">Restart Game</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="learn" className="bg-card p-8 rounded-xl border border-border mt-6">
          <div className="max-w-3xl mx-auto space-y-8 font-serif">
            <h2 className="text-3xl font-['Cinzel_Decorative'] text-primary">The Game of Seeds</h2>
            
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Origin:</strong> Originating in South India, particularly Tamil Nadu and Kerala, Pallanguzhi is a traditional mancala game.
              </p>
              <p>
                <strong className="text-foreground">Educational Value:</strong> Traditionally played by women and children, it served as an excellent tool to teach children counting, arithmetic, and hand-eye coordination. It enhances strategic thinking and concentration.
              </p>
              <p>
                <strong className="text-foreground">Cultural Role:</strong> Often played using cowrie shells, tamarind seeds, or small pebbles on beautifully carved wooden boards that were passed down through generations as family heirlooms.
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
              {winner === 0 ? "It's a Draw!" : winner === 1 ? "Victory!" : "Defeat"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center font-serif text-lg space-y-2">
            <p>{winner === 1 ? "You have mastered the seeds!" : winner === 2 ? "The AI collected more seeds." : "An equal harvest."}</p>
            <p className="text-sm text-muted-foreground">Final Score: You {board[14]} - {board[15]} AI</p>
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
