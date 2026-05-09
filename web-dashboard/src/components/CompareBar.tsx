import { useStore } from "../store/useStore";

export default function CompareBar() {
  const { compareList, models, clearCompare, toggleCompare } = useStore();
  const compareModels = models.filter((m) => compareList.includes(m.id));

  if (compareModels.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="text-sm font-medium whitespace-nowrap">
            Compare ({compareModels.length}/5):
          </span>
          {compareModels.map((model) => (
            <div
              key={model.id}
              className="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 rounded-full text-sm whitespace-nowrap"
            >
              <span>{model.name}</span>
              <button
                onClick={() => toggleCompare(model.id)}
                className="text-slate-400 hover:text-red-500"
                aria-label={`Remove ${model.name} from compare`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={clearCompare}
            className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
