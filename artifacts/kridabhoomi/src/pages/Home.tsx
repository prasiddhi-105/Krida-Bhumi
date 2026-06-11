import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FloatingSymbols } from "@/components/FloatingSymbols";
import { GameCard } from "@/components/GameCard";
import { gamesData } from "@/lib/gameData";
import { useAchievements } from "@/hooks/useAchievements";

export function Home() {
  const { visitPage } = useAchievements();

  useEffect(() => {
    visitPage("/");
  }, [visitPage]);

  const featuredGames = gamesData.filter((g) => g.playable);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-full"
    >
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        <FloatingSymbols />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />
        
        <div className="container px-4 z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-['Cinzel_Decorative'] font-bold text-primary mb-4 drop-shadow-[0_0_15px_rgba(232,146,46,0.3)]">
              Kridaभूमि
            </h1>
            <p className="text-xl md:text-2xl font-serif text-secondary font-semibold tracking-wide">
              Where Ancient Wisdom Meets Modern Play
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-2xl text-muted-foreground font-serif text-lg mb-10"
          >
            Step into the royal courts and temple corridors of ancient India. 
            Rediscover the forgotten board games that shaped empires, taught philosophy, and entertained generations.
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg h-14 px-8 shadow-[0_0_20px_rgba(232,146,46,0.4)]">
              <Link href="/games">Explore Games</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10 font-medium text-lg h-14 px-8">
              <Link href="/heritage">Learn Heritage</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 bg-card/30 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-['Cinzel_Decorative'] font-bold text-primary mb-4">
              Featured Classics
            </h2>
            <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
              Experience our fully restored digital adaptations of these legendary games.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredGames.map((game, i) => (
              <GameCard key={game.id} game={game} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border/40 bg-background text-center">
        <p className="font-['Cinzel_Decorative'] text-primary font-bold text-xl mb-2">Kridaभूमि</p>
        <p className="text-muted-foreground text-sm font-serif">Hackathon Submission • Preserving Ancient Indian Heritage</p>
      </footer>
    </motion.div>
  );
}
