import { GraduationCap } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "hsl(var(--background))" }}>
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4"
          style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
        >
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-500"
              style={{
                animation: "bounce 1.2s infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
