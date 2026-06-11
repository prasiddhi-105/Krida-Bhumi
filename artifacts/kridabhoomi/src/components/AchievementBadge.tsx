import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AchievementBadgeProps {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export function AchievementBadge({ title, description, unlocked }: AchievementBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center p-2 border-[3px] mx-auto cursor-help
            ${unlocked 
              ? "bg-card border-primary shadow-[0_0_15px_rgba(232,146,46,0.4)] text-primary" 
              : "bg-muted border-muted-foreground/30 text-muted-foreground/50 opacity-60"
            }`}
          whileHover={{ scale: 1.05 }}
          animate={unlocked ? {
            boxShadow: ["0px 0px 0px rgba(232,146,46,0)", "0px 0px 20px rgba(232,146,46,0.6)", "0px 0px 0px rgba(232,146,46,0)"]
          } : {}}
          transition={{ duration: 2, repeat: unlocked ? Infinity : 0 }}
        >
          {/* Inner decorative circle */}
          <div className={`absolute inset-1 rounded-full border border-dashed ${unlocked ? 'border-primary/50' : 'border-muted-foreground/20'}`} />
          
          {unlocked && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
              <Check className="w-4 h-4" />
            </div>
          )}
          
          <span className="font-['Cinzel_Decorative'] text-[10px] md:text-xs text-center font-bold leading-tight z-10 px-1">
            {title}
          </span>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent className="bg-popover border-border text-foreground">
        <p className="font-semibold text-primary">{title}</p>
        <p className="text-sm">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
