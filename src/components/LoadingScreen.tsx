import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-primary via-primary-glow to-accent overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-glow rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-glow delay-1000" />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        {/* Spinner */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl opacity-50">
            <Loader2 className="w-20 h-20 text-white animate-spin-slow" />
          </div>
          <Loader2 className="w-20 h-20 text-white animate-spin-slow relative z-10" />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Loading
          </h2>
          <p className="text-white/80 text-lg animate-pulse-glow">
            Please wait...
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse-glow" style={{ animationDelay: "0s" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-pulse-glow" style={{ animationDelay: "0.3s" }} />
          <div className="w-2 h-2 bg-white rounded-full animate-pulse-glow" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
