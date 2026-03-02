import { useState, useMemo } from "react";
import { useSpaces } from "../../modules/spaces/hooks/use-spaces";
import { SpaceList } from "../../modules/spaces/components/space-list";
import { SpaceMap } from "../../modules/spaces/components/space-map";

export function SpacesPage() {
  const [area, setArea] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | undefined>();
  const { spaces, isLoading, error } = useSpaces({ area: area || undefined });

  // All spaces (unfiltered) for map markers + area dropdown
  const { spaces: allSpaces } = useSpaces();
  const areas = useMemo(
    () => Array.from(new Set(allSpaces.map((s) => s.area))).sort(),
    [allSpaces],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[#C9D1D9]">Spaces</h1>
        <p className="text-xs text-[#6E7681] mt-0.5">
          Temukan tempat kerja bareng yang pas
        </p>
      </div>

      {/* Interactive map */}
      <div className="h-64 rounded overflow-hidden border border-[#30363D]">
        <SpaceMap
          spaces={allSpaces}
          selectedSpaceId={selectedSpaceId}
          onSpaceSelect={setSelectedSpaceId}
        />
      </div>

      {/* Filter + count */}
      <div className="flex items-center justify-between gap-3">
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="text-xs border border-[#30363D] rounded px-3 py-2 text-[#8B949E] bg-[#1C2128] focus:border-[#58A6FF] focus:outline-none"
        >
          <option value="">Semua Area</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        {!isLoading && !error && (
          <p className="text-xs text-[#6E7681]">{spaces.length} space ditemukan</p>
        )}
      </div>

      {/* Space list */}
      <SpaceList spaces={spaces} isLoading={isLoading} error={error} />
    </div>
  );
}
