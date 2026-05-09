import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ModelCard } from "./ModelCard";
import type { Model } from "../types";

interface ModelGridProps {
  models: Model[];
  favorites: string[];
  compareList: string[];
  onFavorite: (id: string) => void;
  onCompare: (id: string) => void;
  onSelect: (model: Model) => void;
}

const ITEM_HEIGHT = 200; // Approximate card height

export default function ModelGrid({
  models,
  favorites,
  compareList,
  onFavorite,
  onCompare,
  onSelect,
}: ModelGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="h-[calc(100vh-280px)] overflow-auto"
      role="list"
      aria-label="AI Models"
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{ height: `${virtualizer.getTotalSize()}px`, position: "relative" }}
      >
        {virtualItems.map((virtualItem) => {
          const model = models[virtualItem.index];
          return (
            <div
              key={model.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
              role="listitem"
            >
              <ModelCard
                model={model}
                isFavorite={favorites.includes(model.id)}
                isCompared={compareList.includes(model.id)}
                onFavorite={() => onFavorite(model.id)}
                onCompare={() => onCompare(model.id)}
                onClick={() => onSelect(model)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
