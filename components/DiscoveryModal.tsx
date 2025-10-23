
import React from 'react';
import { Item } from '../types';
import { XIcon, SparklesIcon } from './icons';
import ItemCard from './ItemCard';

interface DiscoveryModalProps {
  item: Item | null;
  onClose: () => void;
}

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
        onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-purple-900 to-indigo-800 border-2 border-yellow-400 rounded-3xl p-8 m-4 max-w-sm w-full text-center shadow-2xl shadow-yellow-400/20 transform transition-all duration-500 scale-95 animate-reveal"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes reveal {
            0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
          }
          .animate-reveal { animation: reveal 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}</style>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
          <XIcon className="w-8 h-8"/>
        </button>

        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-yellow-300">
                <SparklesIcon className="w-8 h-8" />
                <h2 className="text-3xl font-black tracking-wider">New Discovery!</h2>
                <SparklesIcon className="w-8 h-8" />
            </div>

            <div className="my-6 w-56 h-56">
                <ItemCard item={item} className="border-none" />
            </div>

            <p className="text-2xl font-bold text-white mt-2">{item.name}</p>

            <button
                onClick={onClose}
                className="mt-8 bg-yellow-400 text-yellow-900 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors transform hover:scale-105"
            >
                Awesome!
            </button>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryModal;
