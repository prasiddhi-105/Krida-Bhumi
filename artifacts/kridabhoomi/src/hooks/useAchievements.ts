import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AchievementsState {
  unlocked: string[];
  pageVisits: string[];
  gamesPlayed: number;
  chauparRolls: number;
  chauparWins: number;
  pallangazhiVisits: boolean;
  gamesWon: string[];
  heritageViews: string[];

  unlock: (id: string) => void;
  visitPage: (path: string) => void;
  playGame: () => void;
  rollChaupar: () => void;
  winChaupar: () => void;
  visitPallangazhiLearn: () => void;
  winGame: (game: string) => void;
  viewHeritage: (game: string) => void;
  checkAchievements: () => void;
}

export const useAchievements = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: [],
      pageVisits: [],
      gamesPlayed: 0,
      chauparRolls: 0,
      chauparWins: 0,
      pallangazhiVisits: false,
      gamesWon: [],
      heritageViews: [],

      unlock: (id: string) => set((state) => {
        if (!state.unlocked.includes(id)) {
          return { unlocked: [...state.unlocked, id] };
        }
        return state;
      }),

      visitPage: (path: string) => {
        set((state) => {
          if (!state.pageVisits.includes(path)) {
            const newVisits = [...state.pageVisits, path];
            return { pageVisits: newVisits };
          }
          return state;
        });
        get().checkAchievements();
      },

      playGame: () => {
        set((state) => ({ gamesPlayed: state.gamesPlayed + 1 }));
        get().checkAchievements();
      },

      rollChaupar: () => {
        set((state) => ({ chauparRolls: state.chauparRolls + 1 }));
        get().checkAchievements();
      },

      winChaupar: () => {
        set((state) => ({ chauparWins: state.chauparWins + 1 }));
        get().checkAchievements();
      },

      visitPallangazhiLearn: () => {
        set({ pallangazhiVisits: true });
        get().checkAchievements();
      },

      winGame: (game: string) => {
        set((state) => {
          if (!state.gamesWon.includes(game)) {
            return { gamesWon: [...state.gamesWon, game] };
          }
          return state;
        });
        get().checkAchievements();
      },

      viewHeritage: (game: string) => {
        set((state) => {
          if (!state.heritageViews.includes(game)) {
            return { heritageViews: [...state.heritageViews, game] };
          }
          return state;
        });
        get().checkAchievements();
      },

      checkAchievements: () => {
        const state = get();
        const { unlock } = state;

        if (state.pageVisits.length >= 5) {
          unlock('heritage_explorer');
        }
        if (state.chauparRolls >= 1) {
          unlock('chaupar_apprentice');
        }
        if (state.chauparWins >= 1) {
          unlock('chaupar_master');
        }
        if (state.pallangazhiVisits) {
          unlock('pallanguzhi_scholar');
        }
        if (state.gamesWon.includes('chaupar') && state.gamesWon.includes('pallanguzhi')) {
          unlock('ancient_strategist');
        }
        if (state.heritageViews.length >= 7) {
          unlock('game_historian');
        }
        if (state.gamesPlayed >= 5) {
          unlock('royal_gamer');
        }
      }
    }),
    {
      name: 'kridabhoomi-achievements',
    }
  )
);
