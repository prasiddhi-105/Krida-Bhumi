import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementBadge } from "@/components/AchievementBadge";

const achievementList = [
  {
    id: "heritage_explorer",
    title: "Heritage Explorer",
    description: "Visit all 5 main pages of the arcade.",
  },
  {
    id: "chaupar_apprentice",
    title: "Chaupar Apprentice",
    description: "Play your first game of Chaupar.",
  },
  {
    id: "chaupar_master",
    title: "Chaupar Master",
    description: "Win a game of Chaupar against the AI.",
  },
  {
    id: "pallanguzhi_scholar",
    title: "Pallanguzhi Scholar",
    description: "Visit the Learn tab of Pallanguzhi.",
  },
  {
    id: "ancient_strategist",
    title: "Ancient Strategist",
    description: "Win at least one game of both Chaupar and Pallanguzhi.",
  },
  {
    id: "game_historian",
    title: "Game Historian",
    description: "View all heritage articles in the archive.",
  },
  {
    id: "royal_gamer",
    title: "Royal Gamer",
    description: "Play a total of 5 games across any board.",
  }
];

export function Achievements() {
  const { visitPage, unlocked, gamesPlayed, chauparWins, heritageViews } = useAchievements();

  useEffect(() => {
    visitPage("/achievements");
  }, [visitPage]);

  const unlockedCount = unlocked.length;
  const totalCount = achievementList.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-['Cinzel_Decorative'] font-bold text-primary mb-4">
            Royal Decrees & Honors
          </h1>
          <p className="text-muted-foreground font-serif text-lg">
            Unlock achievements by exploring history and mastering the games of old.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-12 shadow-sm">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold font-['Cinzel_Decorative'] text-foreground">Your Progress</h2>
              <p className="text-sm text-muted-foreground">{unlockedCount} of {totalCount} Unlocked</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Games Played: {gamesPlayed}</p>
              <p className="text-sm text-muted-foreground">Articles Read: {heritageViews.length}/7</p>
            </div>
          </div>
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-secondary to-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12">
          {achievementList.map((ach, i) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <AchievementBadge 
                id={ach.id}
                title={ach.title}
                description={ach.description}
                unlocked={unlocked.includes(ach.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
