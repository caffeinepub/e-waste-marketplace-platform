import { Factory, Home, Truck } from "lucide-react";

interface PickupMapTrackerProps {
  status: string;
}

export default function PickupMapTracker({ status }: PickupMapTrackerProps) {
  const isInTransit = status === "confirmed";
  const isCompleted = status === "completed";

  // Progress: confirmed = 40%, completed = 100%
  const progress = isCompleted ? 100 : isInTransit ? 40 : 0;

  return (
    <div className="mt-3 rounded-xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-primary/20 p-4">
      <p className="text-xs font-semibold text-primary mb-3 uppercase tracking-wide">
        🗺️ Pickup Route Tracker
      </p>

      {/* Route visualization */}
      <div className="relative h-16 flex items-center">
        {/* Road line */}
        <div className="absolute left-8 right-8 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dashed road overlay */}
        <div className="absolute left-8 right-8 h-0.5 top-1/2 -translate-y-1/2 flex gap-2 opacity-30 pointer-events-none">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map(
            (k) => (
              <div key={k} className="flex-1 h-full bg-white rounded" />
            ),
          )}
        </div>

        {/* Seller house icon */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div
            className={`rounded-full p-2 border-2 shadow-md transition-colors ${
              progress >= 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            <Home className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
            Seller
          </span>
        </div>

        {/* Animated truck */}
        <div
          className="absolute z-20 flex flex-col items-center gap-1 transition-all duration-1000"
          style={{
            left: `calc(${Math.min(progress, 75)}% + 1.5rem)`,
            transform: "translateX(-50%)",
          }}
        >
          <div
            className={`rounded-full p-2 border-2 shadow-lg transition-all ${
              isInTransit || isCompleted
                ? "bg-accent text-accent-foreground border-accent scale-110"
                : "bg-muted text-muted-foreground border-border scale-90 opacity-60"
            } ${isInTransit ? "pulse-dot" : ""}`}
          >
            <Truck className="h-4 w-4" />
          </div>
          {isInTransit && (
            <span className="text-[10px] text-accent font-semibold whitespace-nowrap animate-pulse">
              En Route
            </span>
          )}
        </div>

        {/* Recycling centre factory icon */}
        <div className="relative z-10 ml-auto flex flex-col items-center gap-1">
          <div
            className={`rounded-full p-2 border-2 shadow-md transition-colors ${
              isCompleted
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            <Factory className="h-4 w-4" />
          </div>
          <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
            Recycler
          </span>
        </div>
      </div>

      {/* Status text */}
      <div className="mt-2 text-center">
        {isCompleted ? (
          <p className="text-xs text-primary font-semibold">
            ✅ Pickup completed — materials recycled!
          </p>
        ) : isInTransit ? (
          <p className="text-xs text-accent font-semibold">
            🚛 Pickup confirmed — collection in progress
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            ⏳ Awaiting pickup confirmation
          </p>
        )}
      </div>
    </div>
  );
}
