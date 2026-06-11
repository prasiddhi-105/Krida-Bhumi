import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";

// Components
import { Navbar } from "@/components/Navbar";

// Pages
import { Home } from "@/pages/Home";
import { Games } from "@/pages/Games";
import { ChauparGame } from "@/pages/ChauparGame";
import { PallangazhiGame } from "@/pages/PallangazhiGame";
import { Heritage } from "@/pages/Heritage";
import { Achievements } from "@/pages/Achievements";
import { About } from "@/pages/About";

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/games" component={Games} />
        <Route path="/games/chaupar" component={ChauparGame} />
        <Route path="/games/pallanguzhi" component={PallangazhiGame} />
        <Route path="/heritage" component={Heritage} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="min-h-[100dvh] flex flex-col bg-background text-foreground transition-colors duration-300">
              <Navbar />
              <main className="flex-1 w-full relative">
                <Router />
              </main>
            </div>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
