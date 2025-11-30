import { useEffect } from "react";

interface CelebrationProps {
  onFinish: () => void;
  durationMs?: number;
}

const Celebration = ({ onFinish, durationMs = 4000 }: CelebrationProps) => {
  useEffect(() => {
    const t = setTimeout(onFinish, durationMs);
    return () => clearTimeout(t);
  }, [onFinish, durationMs]);

  const confettiColors = [
    "#D0193E",
    "#FF9348",
    "#5F237B",
    "#FFC700",
    "#34D399",
    "#3B82F6",
    "#F472B6",
  ];

  return (
    <div className="p-8">
      <main className="h-[90vh] bg-[#F8F1E7] rounded-[24px] flex items-center justify-center relative overflow-hidden">
        {/* Foreground celebration image */}
        <div className="relative z-10 flex flex-col items-center">
          <img src="/celeb.png" alt="Celebration" className="w-[320px]" />
        </div>
        {/* Confetti background */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 70 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 1.5;
            const duration = 2.5 + Math.random() * 2.5;
            const size = 5 + Math.random() * 7;
            const color = confettiColors[i % confettiColors.length];
            const rotate = Math.random() * 360;
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: "2px",
                  transform: `rotate(${rotate}deg)`,
                  animation: `confettiFall ${duration}s linear ${delay}s forwards`,
                }}
              />
            );
          })}
        </div>
        <style>{`
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `}</style>
      </main>
    </div>
  );
};

export default Celebration;
