import { useState, useEffect } from 'react';
import { Check, Camera, PawPrint } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { getTodayString } from '../utils/dateUtils';
import type { Pet } from '../types';

interface PetFormProps {
  pet?: Pet;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVATAR_OPTIONS = [
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20british%20shorthair%20cat%20blue%20gray%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20shiba%20inu%20dog%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20ragdoll%20cat%20fluffy%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20corgi%20dog%20puppy%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20siamese%20cat%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
];

export function PetForm({ pet, onClose, onSuccess }: PetFormProps) {
  const { addPet, updatePet } = usePetStore();
  const isEdit = !!pet;

  const [formData, setFormData] = useState({
    name: pet?.name || '',
    breed: pet?.breed || '',
    age: pet?.age || 1,
    gender: (pet?.gender as 'male' | 'female') || 'male',
    avatar: pet?.avatar || AVATAR_OPTIONS[0],
    weight: pet?.weight || 0,
    birthday: pet?.birthday || getTodayString(),
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入宠物名称';
    if (!formData.breed.trim()) newErrors.breed = '请输入品种';
    if (formData.age <= 0) newErrors.age = '请输入有效年龄';
    if (formData.weight < 0) newErrors.weight = '请输入有效体重';
    if (!formData.birthday) newErrors.birthday = '请选择生日';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && pet) {
      updatePet(pet.id, {
        name: formData.name.trim(),
        breed: formData.breed.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        avatar: formData.avatar,
        weight: Number(formData.weight),
        birthday: formData.birthday,
      });
    } else {
      addPet({
        name: formData.name.trim(),
        breed: formData.breed.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        avatar: formData.avatar,
        weight: Number(formData.weight),
        birthday: formData.birthday,
      });
    }

    onSuccess?.();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center py-2">
        <div className="relative">
          <img
            src={formData.avatar}
            alt="头像"
            className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234ECDC4"><path d="M4.5 9.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm10 0a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM2 15c0-2 2-4 4-4 0 2 1.5 3.5 3.5 4l-1 2H2v-2zm20 0v-2h-6.5l-1-2c2-.5 3.5-2 3.5-4 2 0 4 2 4 4z"/></svg>';
            }}
          />
          <button
            type="button"
            onClick={() => setShowAvatarPicker(!showAvatarPicker)}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        {showAvatarPicker && (
          <div className="mt-3 p-3 bg-surface-50 rounded-xl w-full">
            <p className="text-xs text-surface-500 mb-2">选择头像</p>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    handleChange('avatar', avatar);
                    setShowAvatarPicker(false);
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    formData.avatar === avatar
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-transparent hover:border-surface-200'
                  }`}
                >
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <PawPrint className="w-4 h-4 text-primary-500" />
          宠物名称
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="如：豆豆、小白"
          className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.name && <p className="mt-1 text-xs text-accent-500">{errors.name}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-surface-700 mb-2 block">品种</label>
        <input
          type="text"
          value={formData.breed}
          onChange={(e) => handleChange('breed', e.target.value)}
          placeholder="如：金毛犬、英国短毛猫"
          className={`w-full px-4 py-3 rounded-xl border ${errors.breed ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.breed && <p className="mt-1 text-xs text-accent-500">{errors.breed}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-surface-700 mb-2 block">年龄（岁）</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${errors.age ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
          />
          {errors.age && <p className="mt-1 text-xs text-accent-500">{errors.age}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-surface-700 mb-2 block">体重（kg）</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${errors.weight ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
          />
          {errors.weight && <p className="mt-1 text-xs text-accent-500">{errors.weight}</p>}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-surface-700 mb-2 block">性别</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleChange('gender', 'male')}
            className={`h-11 rounded-xl border flex items-center justify-center gap-2 transition-colors text-sm ${
              formData.gender === 'male'
                ? 'bg-blue-50 border-blue-300 text-blue-600'
                : 'border-surface-200 text-surface-500 hover:bg-surface-50'
            }`}
          >
            <span>♂</span>
            男孩
          </button>
          <button
            type="button"
            onClick={() => handleChange('gender', 'female')}
            className={`h-11 rounded-xl border flex items-center justify-center gap-2 transition-colors text-sm ${
              formData.gender === 'female'
                ? 'bg-pink-50 border-pink-300 text-pink-600'
                : 'border-surface-200 text-surface-500 hover:bg-surface-50'
            }`}
          >
            <span>♀</span>
            女孩
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-surface-700 mb-2 block">生日</label>
        <input
          type="date"
          value={formData.birthday}
          onChange={(e) => handleChange('birthday', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${errors.birthday ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.birthday && <p className="mt-1 text-xs text-accent-500">{errors.birthday}</p>}
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 h-11 rounded-xl bg-surface-100 text-surface-600 font-medium active:scale-[0.98] transition-transform text-sm"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-sm"
        >
          <Check className="w-4 h-4" />
          {isEdit ? '保存修改' : '添加宠物'}
        </button>
      </div>
    </form>
  );
}
