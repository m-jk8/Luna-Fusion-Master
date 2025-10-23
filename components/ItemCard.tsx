
import React from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onSelect?: (item: Item) => void;
  className?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect, className }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`relative group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square text-center shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 cursor-pointer ${className}`}
    >
      {item.isNew && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          NEW
        </span>
      )}
      <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden rounded-lg">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl md:text-6xl">{item.emoji}</span>
        )}
      </div>
      <p className="mt-2 text-white font-bold text-sm md:text-base break-words w-full">{item.name}</p>
    </div>
  );
};

export default ItemCard;
