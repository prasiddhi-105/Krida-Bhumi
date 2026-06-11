import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAchievements } from "@/hooks/useAchievements";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function About() {
  const { visitPage } = useAchievements();

  useEffect(() => {
    visitPage("/about");
  }, [visitPage]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-['Cinzel_Decorative'] font-bold text-primary mb-4">
            About Kridaभूमि
          </h1>
          <p className="text-xl font-serif text-secondary font-medium">
            The Ancient Arcade Project
          </p>
        </div>

        <div className="bg-card border border-border p-8 rounded-2xl shadow-sm space-y-6 font-serif text-lg leading-relaxed text-foreground/90">
          <p>
            India possesses one of the richest and most diverse traditions of board games in the world. Long before video games or modern tabletop games, ancient Indians played complex strategy games etched onto temple floors, embroidered on cloth, or carved into wooden blocks.
          </p>
          
          <p>
            Games like Chaupar, Gyan Chauper (the original Snakes & Ladders), and Ashtapada were not merely pastimes—they were tools for teaching mathematics, military strategy, morality, and philosophy.
          </p>
          
          <p>
            <strong className="text-primary font-sans uppercase tracking-wider text-sm block mb-1 mt-6">The Mission</strong>
            Kridaभूमि (Sanskrit for "Playground") was built to digitally preserve these fading traditions. As physical artifacts decay and oral rules are forgotten, digital restoration offers a way to keep these games alive for new generations.
          </p>
          
          <p>
            <strong className="text-primary font-sans uppercase tracking-wider text-sm block mb-1 mt-6">Hackathon Submission</strong>
            This PWA was built with a focus on immersive design, functional gameplay, and cultural accuracy. It features complete game engines for Chaupar and Pallanguzhi, a custom aesthetic inspired by ancient Indian architecture, and an offline-capable architecture.
          </p>
        </div>
        
        <div className="flex justify-center pt-8">
          <Button asChild size="lg" className="bg-primary text-primary-foreground font-medium">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
