import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gamesData } from "@/lib/gameData";
import { useAchievements } from "@/hooks/useAchievements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function Heritage() {
  const { visitPage, viewHeritage } = useAchievements();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  useEffect(() => {
    visitPage("/heritage");
    
    // Check if opened via URL param
    const params = new URLSearchParams(window.location.search);
    const gameParam = params.get('game');
    if (gameParam && gamesData.find(g => g.id === gameParam)) {
      handleOpenArticle(gameParam);
    }
  }, [visitPage]);

  const handleOpenArticle = (id: string) => {
    setSelectedGame(id);
    viewHeritage(id);
  };

  const activeData = gamesData.find(g => g.id === selectedGame);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container px-4 py-12 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-['Cinzel_Decorative'] font-bold text-primary mb-4">
          Cultural Archive
        </h1>
        <p className="text-muted-foreground font-serif max-w-2xl mx-auto text-lg">
          Delve into the rich history, philosophy, and origins of India's ancient board games.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gamesData.map((game, i) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleOpenArticle(game.id)}
            className="cursor-pointer h-full"
          >
            <Card className="h-full border-border/50 hover:border-primary/50 transition-colors bg-card/50 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="font-['Cinzel_Decorative'] text-xl text-primary">{game.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{game.region}</Badge>
                  <Badge variant="secondary">{game.era}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-serif text-sm line-clamp-3">
                  {game.description}
                </p>
                <p className="text-primary text-sm mt-4 font-medium hover:underline">Read Full Article →</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={selectedGame !== null} onOpenChange={(open) => !open && setSelectedGame(null)}>
        <DialogContent className="max-w-2xl bg-[#FFF8E7] dark:bg-[#2D1200] border-primary/30 p-0 overflow-hidden">
          {activeData && (
            <motion.div 
              initial={{ scaleY: 0, transformOrigin: "top" }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-8"
            >
              <DialogHeader className="mb-6 border-b border-primary/20 pb-4">
                <DialogTitle className="font-['Cinzel_Decorative'] text-3xl text-primary">
                  {activeData.name}
                </DialogTitle>
                <p className="text-secondary font-serif italic text-lg">{activeData.tagline}</p>
                <div className="flex gap-2 mt-4">
                  <Badge className="bg-primary/20 text-primary border-none">{activeData.era}</Badge>
                  <Badge className="bg-secondary/20 text-secondary border-none">{activeData.region}</Badge>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 font-serif text-foreground/90 leading-relaxed text-lg">
                <p>{activeData.description}</p>
                
                {activeData.learnContent ? (
                  <>
                    <div>
                      <h4 className="font-bold text-primary font-sans uppercase tracking-wider text-sm mb-2">Origins</h4>
                      <p>{activeData.learnContent.origin}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary font-sans uppercase tracking-wider text-sm mb-2">Cultural Significance</h4>
                      <p>{activeData.learnContent.significance}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary font-sans uppercase tracking-wider text-sm mb-2">Traditional Play</h4>
                      <p>{activeData.learnContent.rules}</p>
                    </div>
                  </>
                ) : (
                  <div className="p-6 bg-primary/5 rounded-lg border border-primary/10 text-center italic">
                    Detailed archival data for this game is currently being compiled by historians. Check back later.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
