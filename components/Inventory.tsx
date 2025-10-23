
import React, { useState } from 'react';
import { Item } from '../types';
import ItemCard from './ItemCard';

interface InventoryProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, onSelectItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-3xl p-4 md:p-6 flex flex-col h-full shadow-xl">
      <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-4 tracking-wider">Inventory ({items.length})</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
