
import React, { useMemo } from 'react';
import { Item, RecipeMap } from '../types';
import ItemCard from './ItemCard';

interface DiscoveryTreeViewProps {
  items: Item[];
  recipes: RecipeMap;
}

const DiscoveryTreeView: React.FC<DiscoveryTreeViewProps> = ({ items, recipes }) => {
  const { levels } = useMemo(() => {
    const itemsById = new Map(items.map(i => [i.id, i]));
    const depths = new Map<string, number>();

    function getDepth(itemId: string): number {
      if (depths.has(itemId)) {
        return depths.get(itemId)!;
      }

      const recipe = recipes[itemId];
      if (!recipe) {
        depths.set(itemId, 0);
        return 0;
      }

      // Handle case where a parent item might not be in itemsById yet (shouldn't happen in normal flow)
      const parent1Depth = itemsById.has(recipe[0]) ? getDepth(recipe[0]) : -1;
      const parent2Depth = itemsById.has(recipe[1]) ? getDepth(recipe[1]) : -1;

      const depth = 1 + Math.max(parent1Depth, parent2Depth);
      depths.set(itemId, depth);
      return depth;
    }

    items.forEach(item => getDepth(item.id));

    const groupedByLevel: Item[][] = [];
    depths.forEach((depth, itemId) => {
      if (!groupedByLevel[depth]) {
        groupedByLevel[depth] = [];
      }
      const item = itemsById.get(itemId);
      if (item) {
        groupedByLevel[depth].push(item);
      }
    });

    // Sort items within each level alphabetically
    groupedByLevel.forEach(level => level.sort((a, b) => a.name.localeCompare(b.name)));

    return { levels: groupedByLevel };
  }, [items, recipes]);

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-3xl p-4 md:p-6 flex flex-col h-full shadow-xl">
      <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-4 tracking-wider">Discovery Tree</h2>
      <div className="flex-grow overflow-auto pr-2">
        <div className="flex items-start gap-6 md:gap-8 p-1">
          {levels.map((levelItems, index) => (
            <div key={index} className="flex flex-col items-center gap-4 flex-shrink-0">
              <div className="bg-white/10 rounded-full px-4 py-1">
                <h3 className="text-sm font-bold text-white/80">TIER {index}</h3>
              </div>
              <div className="w-48 grid grid-cols-1 gap-4">
                {levelItems.map(item => (
                  <ItemCard key={item.id} item={item} className="hover:scale-100 cursor-default" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoveryTreeView;
