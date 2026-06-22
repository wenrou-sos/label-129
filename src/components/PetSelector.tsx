import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Edit3, Trash2, PawPrint } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import type { Pet } from '../types';

interface PetSelectorProps {
  onAddPet: () => void;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (pet: Pet) => void;
}

export function PetSelector({ onAddPet, onEditPet, onDeletePet }: PetSelectorProps) {
  const { pets, currentPetId, setCurrentPetId } = usePetStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPet = pets.find((p) => p.id === currentPetId);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    setCurrentPetId(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all"
      >
        {currentPet ? (
          <>
            <img
              src={currentPet.avatar}
              alt={currentPet.name}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234ECDC4"><path d="M4.5 9.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm10 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM2 15c0-2 2-4 4-4 0 2 1.5 3.5 3.5 4l-1 2H2v-2zm20 0v-2h-6.5l-1-2c2-.5 3.5-2 3.5-4 2 0 4 2 4 4z"/></svg>';
              }}
            />
            <div className="text-left">
              <div className="text-sm font-semibold text-surface-800 leading-tight">
                {currentPet.name}
              </div>
              <div className="text-xs text-surface-400 leading-tight">
                {currentPet.breed}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-primary-500" />
            </div>
            <span className="text-sm font-medium text-surface-600">选择宠物</span>
          </>
        )}
        <ChevronDown
          className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-surface-100 overflow-hidden z-50 animate-fade-in">
          <div className="max-h-72 overflow-y-auto">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className={`group flex items-center gap-3 px-4 py-3 border-b border-surface-50 hover:bg-surface-50 transition-colors cursor-pointer ${
                  pet.id === currentPetId ? 'bg-primary-50' : ''
                }`}
                onClick={() => handleSelect(pet.id)}
              >
                <img
                  src={pet.avatar}
                  alt={pet.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234ECDC4"><path d="M4.5 9.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm10 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM2 15c0-2 2-4 4-4 0 2 1.5 3.5 3.5 4l-1 2H2v-2zm20 0v-2h-6.5l-1-2c2-.5 3.5-2 3.5-4 2 0 4 2 4 4z"/></svg>';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-surface-800 truncate">
                      {pet.name}
                    </span>
                    {pet.id === currentPetId && (
                      <span className="px-1.5 py-0.5 rounded-full bg-primary-500 text-white text-[10px] font-medium">
                        当前
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-surface-400 truncate">
                    {pet.breed} · {pet.age}岁 · {pet.gender === 'male' ? '♂' : '♀'}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      onEditPet(pet);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-primary-100 text-surface-400 hover:text-primary-600 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pets.length <= 1) {
                        alert('至少需要保留一只宠物');
                        return;
                      }
                      if (confirm(`确定要删除宠物"${pet.name}"吗？相关的所有健康记录也将被删除。`)) {
                        onDeletePet(pet);
                      }
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent-100 text-surface-400 hover:text-accent-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onAddPet();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-primary-600 hover:bg-primary-50 transition-colors border-t border-surface-50"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">添加新宠物</span>
          </button>
        </div>
      )}
    </div>
  );
}
