import { useState } from 'react';
import { Bug, Pill, Calendar, Building2, Check } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { getTodayString } from '../utils/dateUtils';

interface AddDewormFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddDewormForm({ onClose, onSuccess }: AddDewormFormProps) {
  const { addDeworm } = usePetStore();
  const [formData, setFormData] = useState({
    type: 'internal' as 'internal' | 'external',
    date: getTodayString(),
    nextDate: '',
    medicine: '',
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
    if (!formData.type) newErrors.type = '请选择驱虫类型';
    if (!formData.date) newErrors.date = '请选择驱虫日期';
    if (!formData.nextDate) newErrors.nextDate = '请选择下次驱虫日期';
    if (!formData.medicine.trim()) newErrors.medicine = '请输入驱虫药物';
    if (formData.nextDate && formData.date && formData.nextDate < formData.date) {
      newErrors.nextDate = '下次日期不能早于驱虫日期';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addDeworm({
      type: formData.type,
      date: formData.date,
      nextDate: formData.nextDate,
      medicine: formData.medicine.trim(),
    });

    onSuccess?.();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          {formData.type === 'internal' ? (
            <Pill className="w-4 h-4 text-primary-500" />
          ) : (
            <Bug className="w-4 h-4 text-accent-500" />
          )}
          驱虫类型
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleChange('type', 'internal')}
            className={`h-11 rounded-xl border flex items-center justify-center gap-2 transition-colors text-sm ${
              formData.type === 'internal'
                ? 'bg-primary-50 border-primary-300 text-primary-600'
                : 'border-surface-200 text-surface-500 hover:bg-surface-50'
            }`}
          >
            <Pill className="w-4 h-4" />
            体内驱虫
          </button>
          <button
            type="button"
            onClick={() => handleChange('type', 'external')}
            className={`h-11 rounded-xl border flex items-center justify-center gap-2 transition-colors text-sm ${
              formData.type === 'external'
                ? 'bg-accent-50 border-accent-300 text-accent-600'
                : 'border-surface-200 text-surface-500 hover:bg-surface-50'
            }`}
          >
            <Bug className="w-4 h-4" />
            体外驱虫
          </button>
        </div>
        {errors.type && (
          <p className="mt-1 text-xs text-accent-500">{errors.type}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          驱虫日期
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
          下次驱虫日期
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
          驱虫药物
        </label>
        <input
          type="text"
          value={formData.medicine}
          onChange={(e) => handleChange('medicine', e.target.value)}
          placeholder="如：拜宠清、福来恩、大宠爱"
          className={`w-full px-4 py-3 rounded-xl border ${errors.medicine ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
        />
        {errors.medicine && (
          <p className="mt-1 text-xs text-accent-500">{errors.medicine}</p>
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
