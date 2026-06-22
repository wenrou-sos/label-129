import { useState } from 'react';
import { Syringe, Calendar, Building2, Check } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { getTodayString } from '../utils/dateUtils';

interface AddVaccineFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddVaccineForm({ onClose, onSuccess }: AddVaccineFormProps) {
  const { addVaccine } = usePetStore();
  const [formData, setFormData] = useState({
    name: '',
    date: getTodayString(),
    nextDate: '',
    hospital: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '请输入疫苗名称';
    if (!formData.date) newErrors.date = '请选择接种日期';
    if (!formData.nextDate) newErrors.nextDate = '请选择下次接种日期';
    if (!formData.hospital.trim()) newErrors.hospital = '请输入接种医院';
    if (formData.nextDate && formData.date && formData.nextDate < formData.date) {
      newErrors.nextDate = '下次日期不能早于接种日期';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addVaccine({
      name: formData.name.trim(),
      date: formData.date,
      nextDate: formData.nextDate,
      hospital: formData.hospital.trim(),
    });

    onSuccess?.();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Syringe className="w-4 h-4 text-primary-500" />
          疫苗名称
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="如：狂犬疫苗、六联疫苗"
          className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-accent-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          接种日期
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.date && (
          <p className="mt-1 text-xs text-accent-500">{errors.date}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Calendar className="w-4 h-4 text-accent-500" />
          下次接种日期
        </label>
        <input
          type="date"
          value={formData.nextDate}
          onChange={(e) => handleChange('nextDate', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border ${errors.nextDate ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.nextDate && (
          <p className="mt-1 text-xs text-accent-500">{errors.nextDate}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Building2 className="w-4 h-4 text-primary-500" />
          接种医院
        </label>
        <input
          type="text"
          value={formData.hospital}
          onChange={(e) => handleChange('hospital', e.target.value)}
          placeholder="请输入医院名称"
          className={`w-full px-4 py-3 rounded-xl border ${errors.hospital ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.hospital && (
          <p className="mt-1 text-xs text-accent-500">{errors.hospital}</p>
        )}
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
          保存记录
        </button>
      </div>
    </form>
  );
}
