
import React from 'react';
import { Item } from '../types';
import ItemCard from './ItemCard';
import { PlusIcon, SparklesIcon, XIcon } from './icons';

interface FusionChamberProps {
  slot1: Item | null;
  slot2: Item | null;
  onFuse: () => void;
  onClearSlot: (slot: 1 | 2) => void;
  isLoading: boolean;
  error: string | null;
}

const Slot: React.FC<{ item: Item | null; onClear: () => void; }> = ({ item, onClear }) => {
  return (
    <div className="relative w-36 h-36 md:w-48 md:h-48">
      {item ? (
        <>
          <ItemCard item={item} />
          <button
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="w-full h-full bg-black/20 border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center">
          <span className="text-white/50 text-sm">Select Item</span>
        </div>
      )}
    </div>
  );
};

const FusionChamber: React.FC<FusionChamberProps> = ({ slot1, slot2, onFuse, onClearSlot, isLoading, error }) => {
  const canFuse = slot1 && slot2 && !isLoading;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-6 shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-black text-white text-center tracking-wider">Fusion Chamber</h2>
      
      <div className="flex items-center justify-center gap-4 md:gap-8">
        <Slot item={slot1} onClear={() => onClearSlot(1)} />
        <PlusIcon className="w-8 h-8 text-white/50" />
        <Slot item={slot2} onClear={() => onClearSlot(2)} />
      </div>

      <div className="w-full mt-4">
        <button
          onClick={onFuse}
          disabled={!canFuse}
          className={`w-full flex items-center justify-center gap-3 text-lg font-bold px-6 py-4 rounded-full transition-all duration-300 ease-in-out
            ${canFuse
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Fusing...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-6 h-6" />
              <span>Fuse Items</span>
            </>
          )}
        </button>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default FusionChamber;
