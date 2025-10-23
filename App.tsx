import React, { useState, useEffect, useCallback } from 'react';
import { Item, RecipeMap } from './types';
import { INITIAL_ITEMS } from './constants';
import { discoverNewItem } from './services/geminiService';
import FusionChamber from './components/FusionChamber';
import Inventory from './components/Inventory';
import DiscoveryModal from './components/DiscoveryModal';
import DiscoveryTreeView from './components/DiscoveryTreeView';
import { SparklesIcon, RefreshIcon, TreeIcon, ListIcon } from './components/icons';

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [slot1, setSlot1] = useState<Item | null>(null);
  const [slot2, setSlot2] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [recipes, setRecipes] = useState<RecipeMap>({});
  const [newDiscovery, setNewDiscovery] = useState<Item | null>(null);
  const [currentView, setCurrentView] = useState<'inventory' | 'tree'>('inventory');

  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('luna-fusion-items');
      const savedDiscovered = localStorage.getItem('luna-fusion-discovered');
      const savedRecipes = localStorage.getItem('luna-fusion-recipes');
      
      if (savedItems && savedDiscovered && savedRecipes) {
        setItems(JSON.parse(savedItems));
        setDiscovered(new Set(JSON.parse(savedDiscovered)));
        setRecipes(JSON.parse(savedRecipes));
      } else {
        setItems(INITIAL_ITEMS);
        setDiscovered(new Set(INITIAL_ITEMS.map(i => i.id)));
        setRecipes({});
      }
    } catch (e) {
      console.error("Failed to load from storage, starting fresh.", e);
      setItems(INITIAL_ITEMS);
      setDiscovered(new Set(INITIAL_ITEMS.map(i => i.id)));
      setRecipes({});
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const itemsToSave = items.map(({ isNew, ...rest }) => rest);
      localStorage.setItem('luna-fusion-items', JSON.stringify(itemsToSave));
      localStorage.setItem('luna-fusion-discovered', JSON.stringify(Array.from(discovered)));
      localStorage.setItem('luna-fusion-recipes', JSON.stringify(recipes));
    }
  }, [items, discovered, recipes]);

  const handleSelectItem = useCallback((item: Item) => {
    if (isLoading) return;

    if (item.isNew) {
      setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, isNew: false } : i));
    }

    if (!slot1) {
      setSlot1(item);
    } else if (!slot2) {
      if (slot1.id !== item.id) {
        setSlot2(item);
      }
    }
  }, [isLoading, slot1, slot2]);

  const handleClearSlot = (slot: 1 | 2) => {
    if (slot === 1) setSlot1(null);
    else setSlot2(null);
  };

  const handleFuse = async () => {
    if (!slot1 || !slot2 || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    const combinationKey = [slot1.id, slot2.id].sort().join('+');

    if (discovered.has(combinationKey)) {
      setError("You've already discovered this combination!");
      setIsLoading(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const { name, imageUrl } = await discoverNewItem(slot1, slot2);
      
      const newItem: Item = {
        id: combinationKey,
        name,
        emoji: '✨',
        imageUrl,
        isNew: true
      };

      setItems(prevItems => [...prevItems, newItem]);
      setDiscovered(prevDiscovered => new Set(prevDiscovered).add(combinationKey));
      setRecipes(prevRecipes => ({...prevRecipes, [combinationKey]: [slot1.id, slot2.id]}));
      setNewDiscovery(newItem);
      setSlot1(null);
      setSlot2(null);

    } catch (apiError) {
      console.error("Fusion failed:", apiError);
      setError("The cosmic forces are unstable! Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    if (newDiscovery) {
      setItems(prevItems => prevItems.map(i => i.id === newDiscovery.id ? { ...i, isNew: false } : i));
    }
    setNewDiscovery(null);
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      localStorage.removeItem('luna-fusion-items');
      localStorage.removeItem('luna-fusion-discovered');
      localStorage.removeItem('luna-fusion-recipes');
      
      // Reset state directly instead of reloading the page for a smoother experience
      setItems(INITIAL_ITEMS);
      setDiscovered(new Set(INITIAL_ITEMS.map(i => i.id)));
      setRecipes({});
      setSlot1(null);
      setSlot2(null);
      setError(null);
      setNewDiscovery(null);
      setCurrentView('inventory');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4 sm:p-6 lg:p-8 overflow-hidden">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 flex items-center justify-center gap-4">
              <SparklesIcon className="w-8 h-8 md:w-12 md:h-12"/>
              Luna Fusion Master
          </h1>
          <p className="text-lg text-white/80 mt-2">Combine items to discover new creations!</p>
          <button 
            onClick={handleResetProgress}
            className="absolute top-0 right-0 bg-red-500/20 text-white/70 hover:bg-red-500/50 hover:text-white transition-all rounded-full p-3"
            aria-label="Reset Progress"
          >
            <RefreshIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
              <FusionChamber 
                  slot1={slot1} 
                  slot2={slot2} 
                  onFuse={handleFuse}
                  onClearSlot={handleClearSlot}
                  isLoading={isLoading}
                  error={error}
              />
          </div>
          <div className="lg:h-[75vh] flex flex-col">
            <div className="flex justify-center mb-4 bg-black/20 backdrop-blur-lg border border-white/10 rounded-full p-1 self-center">
              <button onClick={() => setCurrentView('inventory')} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${currentView === 'inventory' ? 'bg-purple-500 text-white' : 'text-white/70 hover:bg-white/10'}`}>
                <ListIcon className="w-5 h-5"/> Inventory
              </button>
              <button onClick={() => setCurrentView('tree')} className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${currentView === 'tree' ? 'bg-purple-500 text-white' : 'text-white/70 hover:bg-white/10'}`}>
                <TreeIcon className="w-5 h-5"/> Discovery Tree
              </button>
            </div>
            <div className="flex-grow h-0">
              {currentView === 'inventory' ? (
                <Inventory items={items} onSelectItem={handleSelectItem} />
              ) : (
                <DiscoveryTreeView items={items} recipes={recipes} />
              )}
            </div>
          </div>
        </div>
        
        <footer className="text-center text-white/50 text-sm mt-8 pb-4">
          A creative project from the makers of the <a href="https://m-jk8.github.io/mallorca-map/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Mallorca Map</a>.
        </footer>
      </main>

      <DiscoveryModal item={newDiscovery} onClose={handleCloseModal} />
    </div>
  );
};

export default App;
