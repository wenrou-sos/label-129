import { usePetStore } from '../store/usePetStore';
import { Calendar, Scale, Heart } from 'lucide-react';
import { formatDateCN } from '../utils/dateUtils';

export function PetCard() {
  const { currentPet } = usePetStore();
  const pet = currentPet();

  if (!pet) {
    return (
      <div className="bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl p-5 text-white shadow-card h-40 flex items-center justify-center">
        <p>请先添加宠物</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary-400 to-primary-500 rounded-2xl p-5 text-white shadow-card">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={pet.avatar}
            alt={pet.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {pet.gender === 'male' ? '♂ 公' : '♀ 母'}
            </span>
          </div>
          <p className="text-white/80 text-sm mb-2">{pet.breed}</p>
          <div className="flex items-center gap-3 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{pet.age}岁</span>
            </div>
            <div className="flex items-center gap-1">
              <Scale className="w-4 h-4" />
              <span>{pet.weight}kg</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/20 flex justify-between text-sm">
        <span className="text-white/70">生日</span>
        <span className="font-medium">{formatDateCN(pet.birthday)}</span>
      </div>
    </div>
  );
}
