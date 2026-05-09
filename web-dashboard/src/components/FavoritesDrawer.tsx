import { useStore } from "../store/useStore";

export default function FavoritesDrawer() {
  const { favorites, models, toggleFavorite, isDarkMode } = useStore();
  const favoriteModels = models.filter((m) => favorites.includes(m.id));

  if (favoriteModels.length === 0) return null;

  return (
    <aside
      className={`fixed right-0 top-16 w-80 h-[calc(100vh-4rem)] overflow-y-auto shadow-xl transform transition-transform duration-200 z-40 ${
        isDarkMode ? "bg-slate-800 border-l border-slate-700" : "bg-white border-l border-slate-200"
      }`}
      aria-label="Favorites"
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Favorites</h2>
        <div className="space-y-3">
          {favoriteModels.map((model) => (
            <div
              key={model.id}
              className={`p-3 rounded-lg border ${
                isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-sm text-slate-500">{model.provider}</p>
                </div>
                <button
                  onClick={() => toggleFavorite(model.id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label={`Remove ${model.name} from favorites`}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
