import { useEffect } from "react";
import { motion } from "framer-motion";
import { GameCard } from "@/components/GameCard";
import { gamesData } from "@/lib/gameData";
import { useAchievements } from "@/hooks/useAchievements";

export function Games() {
  const { visitPage } = useAchievements();

  useEffect(() => {
    visitPage("/games");
  }, [visitPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container px-4 py-12 min-h-screen"
    >
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-['Cinzel_Decorative'] font-bold text-primary mb-4"
        >
          The Royal Arcade
        </motion.h1>
        <p className="text-muted-foreground font-serif max-w-2xl mx-auto text-lg">
          Choose a game to play or learn about its history. The playable games have been fully recreated with traditional rules.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-['Cinzel_Decorative'] text-secondary mb-6 border-b border-border/50 pb-2">
          Playable Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesData.filter(g => g.playable).map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-['Cinzel_Decorative'] text-secondary/70 mb-6 border-b border-border/50 pb-2">
          Historical Archives (Coming Soon)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
          {gamesData.filter(g => !g.playable).map((game, i) => (
            <GameCard key={game.id} game={game} index={i + 2} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
