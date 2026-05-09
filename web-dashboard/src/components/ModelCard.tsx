import React from 'react';
import type { Model } from '../types';

interface ModelCardProps {
  model: Model;
  isFavorite: boolean;
  isCompared: boolean;
  compareLimitReached?: boolean;
  onFavorite: (id: string) => void;
  onCompare: (id: string) => void;
  onClick: (model: Model) => void;
}

const getProviderColor = (provider: string) => {
  const map: Record<string, string> = {
    OpenAI: 'bg-emerald-500',
    Anthropic: 'bg-orange-500',
    Google: 'bg-blue-500',
    Meta: 'bg-indigo-500',
    Mistral: 'bg-cyan-500',
    Cohere: 'bg-yellow-500',
  };
  return map[provider] || 'bg-gray-500';
};

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isFavorite,
  isCompared,
  compareLimitReached = false,
  onFavorite,
  onCompare,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(model)}
      className="relative group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      tabIndex={0}
      role="button"
      aria-label={`View details for ${model.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(model);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${getProviderColor(
              model.provider
            )}`}
          >
            {model.provider.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {model.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {model.provider}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {model.free_tier && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Free
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(model.id);
            }}
            className={`p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFavorite
                ? 'text-red-500'
                : 'text-gray-400 hover:text-red-400'
            }`}
            aria-label={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            {isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Input</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            ${model.pricing?.input_cost_per_1k ?? 0}
            <span className="text-xs text-gray-500">/1M</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Output</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            ${model.pricing?.output_cost_per_1k ?? 0}
            <span className="text-xs text-gray-500">/1M</span>
          </p>
        </div>
      </div>

      {model.capabilities && model.capabilities.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {model.capabilities.slice(0, 3).map((cap) => (
          <span
            key={cap}
            className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          >
            {cap}
          </span>
        ))}
        {model.capabilities.length > 3 && (
          <span className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
            +{model.capabilities.length - 3}
          </span>
        )}
      </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <label
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => onCompare(model.id)}
            disabled={!isCompared && compareLimitReached}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 disabled:opacity-50"
            aria-label={`Compare ${model.name}`}
          />
          <span
            className={`text-sm ${
              !isCompared && compareLimitReached
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Compare
          </span>
        </label>
      </div>
    </div>
  );
};
