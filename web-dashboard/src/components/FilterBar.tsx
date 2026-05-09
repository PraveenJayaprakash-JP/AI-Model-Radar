import React from 'react';

interface FilterBarProps {
  providers: string[];
  capabilities: string[];
  activeProviders: string[];
  activeCapabilities: string[];
  sortBy: 'newest' | 'name' | 'price_low' | 'price_high' | 'context';
  showFreeOnly: boolean;
  onToggleProvider: (provider: string) => void;
  onToggleCapability: (capability: string) => void;
  onSort: (sort: 'newest' | 'name' | 'price_low' | 'price_high' | 'context') => void;
  onToggleFree: () => void;
  onClear: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  providers,
  capabilities,
  activeProviders,
  activeCapabilities,
  sortBy,
  showFreeOnly,
  onToggleProvider,
  onToggleCapability,
  onSort,
  onToggleFree,
  onClear,
}) => {
  const activeCount =
    activeProviders.length +
    activeCapabilities.length +
    (showFreeOnly ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Providers
            </h3>
            <div className="flex flex-wrap gap-2">
              {providers.map((provider) => (
                <button
                  key={provider}
                  onClick={() => onToggleProvider(provider)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeProviders.includes(provider)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={activeProviders.includes(provider)}
                >
                  {provider}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Capabilities
            </h3>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap) => (
                <button
                  key={cap}
                  onClick={() => onToggleCapability(cap)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeCapabilities.includes(cap)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={activeCapabilities.includes(cap)}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
          <div>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) =>
                onSort(e.target.value as FilterBarProps['sortBy'])
              }
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="name">Name</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="context">Context Window</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showFreeOnly}
              onChange={onToggleFree}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Free tier only
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
            >
              Clear filters
            </button>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
