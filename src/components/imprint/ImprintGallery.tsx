import { useAppStore } from "@/lib/stores/appStore";
import GlassCard from "@/components/ui/GlassCard";
import SignalBadge from "./SignalBadge";
import { formatPrice } from "@/lib/utils/format";

export default function ImprintGallery() {
  const imprintHistory = useAppStore((s) => s.imprintHistory);

  if (imprintHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/30">
        <div className="h-16 w-16 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
          <span className="text-2xl opacity-40">◎</span>
        </div>
        <p className="text-sm">No imprints yet. Generate your first one above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {imprintHistory.map((imprint) => (
        <GlassCard
          key={imprint.timestamp}
          className="group cursor-pointer overflow-hidden transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.06]"
        >
          {/* preview */}
          <div className="relative aspect-square w-full overflow-hidden bg-black">
            {imprint.imageUrl ? (
              <img
                src={imprint.imageUrl}
                alt={`${imprint.token} imprint`}
                className="h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-100"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div
                  className="h-12 w-12 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${imprint.state.colorPalette[0]}40, transparent)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* info */}
          <div className="flex flex-col gap-1 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white truncate">{imprint.token}</span>
              <SignalBadge
                classification={imprint.state.marketClassification}
                confidence={imprint.state.confidence}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span className="font-mono">{formatPrice(imprint.state.price)}</span>
              <span>
                {new Date(imprint.timestamp).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
