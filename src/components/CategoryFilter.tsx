import React from 'react';
import { CATEGORIES } from '../data/seedData';
import { CategoryId } from '../types';

interface CategoryFilterProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  countsByCategory: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  countsByCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-1">
      <div className="flex items-center gap-1.5 p-1 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl w-max min-w-full sm:min-w-0">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = cat.id === 'all' 
            ? Object.values(countsByCategory).reduce((a, b) => a + b, 0)
            : (countsByCategory[cat.id] || 0);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <span>{cat.nameAr}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-zinc-700/80 text-zinc-200'
                    : 'bg-zinc-800/60 text-zinc-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
