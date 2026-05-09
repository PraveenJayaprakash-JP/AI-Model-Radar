import React, { useEffect, useRef } from 'react';
import type { Model } from '../types';

interface DetailModalProps {
  model: Model | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onFavorite: (id: string) => void;
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

export const DetailModal: React.FC<DetailModalProps> = ({
  model,
  isOpen,
  onClose,
  isFavorite,
  onFavorite,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first?.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const handleShare = async () => {
    if (!model) return;
    const text = `Check out ${model.name} by ${model.provider}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: model.name,
          text,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${text} — ${window.location.href}`
        );
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen || !model) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto focus:outline-none"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getProviderColor(
                  model.provider
                )}`}
              >
                {model.provider.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  {model.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {model.provider}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {model.free_tier && (
            <span className="inline-block mb-4 px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Free Tier Available
            </span>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Input Cost
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                ${model.pricing?.input_cost_per_1k ?? 0}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /1M
                </span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Output Cost
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                ${model.pricing?.output_cost_per_1k ?? 0}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /1M
                </span>
              </p>
            </div>
          </div>

          {model.context_window && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Context Window
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {model.context_window.toLocaleString()} tokens
            </p>
          </div>
          )}

          {model.capabilities && model.capabilities.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Capabilities
            </h3>
            <ul className="space-y-2">
              {model.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm">{cap}</span>
                </li>
              ))}
            </ul>
          </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => onFavorite(model.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFavorite
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
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
              {isFavorite ? 'Favorited' : 'Favorite'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Share model"
            >
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
