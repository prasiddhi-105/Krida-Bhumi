import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    era: string;
    playable: boolean;
  };
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-primary/20 bg-card hover:shadow-[0_0_20px_rgba(232,146,46,0.15)] transition-all overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="font-['Cinzel_Decorative'] text-2xl text-primary">
              {game.name}
            </CardTitle>
            {!game.playable && (
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                Coming Soon
              </Badge>
            )}
          </div>
          <p className="text-sm font-semibold text-secondary">{game.tagline}</p>
        </CardHeader>
        
        <CardContent className="flex-1">
          <p className="text-muted-foreground font-serif leading-relaxed line-clamp-3 mb-4">
            {game.description}
          </p>
          <div className="flex gap-2 text-xs font-medium text-primary/70">
            <Badge variant="outline" className="border-primary/30">{game.era}</Badge>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t border-border/50 bg-background/50">
          <div className="flex gap-3 w-full">
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={!game.playable}
            >
              <Link href={game.playable ? `/games/${game.id}` : "#"}>
                {game.playable ? "Play Now" : "Locked"}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
            >
              <Link href={`/heritage?game=${game.id}`}>Learn More</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
