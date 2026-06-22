import { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Building2,
  User,
  ClipboardList,
  FileText,
  Pill,
  Plus,
  X,
  Check,
} from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { getTodayString } from '../utils/dateUtils';
import type { Medication } from '../types';

interface AddVisitFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddVisitForm({ onClose, onSuccess }: AddVisitFormProps) {
  const { addVisitRecord } = usePetStore();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    hospital: '',
    doctor: '',
    chiefComplaint: '',
    examItems: [] as string[],
    diagnosis: '',
    medications: [] as Medication[],
    treatmentAdvice: '',
  });
  const [newExamItem, setNewExamItem] = useState('');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const addExamItem = () => {
    if (!newExamItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      examItems: [...prev.examItems, newExamItem.trim()],
    }));
    setNewExamItem('');
  };

  const removeExamItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      examItems: prev.examItems.filter((_, i) => i !== index),
    }));
  };

  const addMedication = () => {
    if (!newMedication.name.trim()) return;
    const med: Medication = {
      id: `med_temp_${Date.now()}`,
      name: newMedication.name.trim(),
      dosage: newMedication.dosage.trim(),
      frequency: newMedication.frequency.trim(),
      duration: newMedication.duration.trim(),
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, med],
    }));
    setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = '请选择就诊日期';
    if (!formData.hospital.trim()) newErrors.hospital = '请输入就诊医院';
    if (!formData.doctor.trim()) newErrors.doctor = '请输入主治医生';
    if (!formData.chiefComplaint.trim()) newErrors.chiefComplaint = '请输入主诉内容';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = '请输入诊断结论';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addVisitRecord({
      date: formData.date,
      hospital: formData.hospital.trim(),
      doctor: formData.doctor.trim(),
      chiefComplaint: formData.chiefComplaint.trim(),
      examItems: formData.examItems,
      diagnosis: formData.diagnosis.trim(),
      medications: formData.medications,
      treatmentAdvice: formData.treatmentAdvice.trim(),
    });

    onSuccess?.();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            就诊日期
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
            <User className="w-4 h-4 text-primary-500" />
            主治医生
          </label>
          <input
            type="text"
            value={formData.doctor}
            onChange={(e) => handleChange('doctor', e.target.value)}
            placeholder="医生姓名"
            className={`w-full px-4 py-3 rounded-xl border ${errors.doctor ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
          />
          {errors.doctor && (
            <p className="mt-1 text-xs text-accent-500">{errors.doctor}</p>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Building2 className="w-4 h-4 text-primary-500" />
          就诊医院
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

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <ClipboardList className="w-4 h-4 text-primary-500" />
          主诉
        </label>
        <textarea
          value={formData.chiefComplaint}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          placeholder="请描述宠物的症状和不适..."
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border ${errors.chiefComplaint ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm resize-none`}
        />
        {errors.chiefComplaint && (
          <p className="mt-1 text-xs text-accent-500">{errors.chiefComplaint}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <FileText className="w-4 h-4 text-warning-500" />
          检查项目
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newExamItem}
            onChange={(e) => setNewExamItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addExamItem())}
            placeholder="如：血常规、生化检查"
            className="flex-1 px-4 py-2.5 rounded-xl border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm"
          />
          <button
            type="button"
            onClick={addExamItem}
            className="w-10 h-10 rounded-xl bg-primary-100 text-primary-500 flex items-center justify-center hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {formData.examItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.examItems.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-surface-100 text-surface-700 text-sm rounded-full flex items-center gap-1"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeExamItem(index)}
                  className="w-4 h-4 rounded-full bg-surface-300 text-surface-600 flex items-center justify-center hover:bg-surface-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Stethoscope className="w-4 h-4 text-accent-500" />
          诊断结论
        </label>
        <textarea
          value={formData.diagnosis}
          onChange={(e) => handleChange('diagnosis', e.target.value)}
          placeholder="请输入医生的诊断结果..."
          rows={2}
          className={`w-full px-4 py-3 rounded-xl border ${errors.diagnosis ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm resize-none`}
        />
        {errors.diagnosis && (
          <p className="mt-1 text-xs text-accent-500">{errors.diagnosis}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <Pill className="w-4 h-4 text-purple-500" />
          药物处方
        </label>
        <div className="bg-surface-50 rounded-xl p-3 mb-2 space-y-2">
          <input
            type="text"
            value={newMedication.name}
            onChange={(e) => setNewMedication((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="药物名称"
            className="w-full px-3 py-2 rounded-lg border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={newMedication.dosage}
              onChange={(e) => setNewMedication((prev) => ({ ...prev, dosage: e.target.value }))}
              placeholder="用量"
              className="w-full px-3 py-2 rounded-lg border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm"
            />
            <input
              type="text"
              value={newMedication.frequency}
              onChange={(e) => setNewMedication((prev) => ({ ...prev, frequency: e.target.value }))}
              placeholder="用法"
              className="w-full px-3 py-2 rounded-lg border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm"
            />
            <input
              type="text"
              value={newMedication.duration}
              onChange={(e) => setNewMedication((prev) => ({ ...prev, duration: e.target.value }))}
              placeholder="疗程"
              className="w-full px-3 py-2 rounded-lg border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm"
            />
          </div>
          <button
            type="button"
            onClick={addMedication}
            className="w-full h-9 rounded-lg bg-primary-100 text-primary-600 text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加药物
          </button>
        </div>
        {formData.medications.length > 0 && (
          <div className="space-y-2">
            {formData.medications.map((med, index) => (
              <div
                key={med.id}
                className="p-3 bg-surface-50 rounded-xl border border-surface-200 flex items-start justify-between"
              >
                <div>
                  <p className="font-medium text-surface-800 text-sm">{med.name}</p>
                  <div className="flex gap-3 text-xs text-surface-500 mt-0.5">
                    {med.dosage && <span>{med.dosage}</span>}
                    {med.frequency && <span>{med.frequency}</span>}
                    {med.duration && <span>{med.duration}</span>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="w-6 h-6 rounded-full bg-surface-200 text-surface-500 flex items-center justify-center hover:bg-accent-100 hover:text-accent-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
          <FileText className="w-4 h-4 text-green-500" />
          治疗建议
        </label>
        <textarea
          value={formData.treatmentAdvice}
          onChange={(e) => handleChange('treatmentAdvice', e.target.value)}
          placeholder="护理建议、注意事项、复诊安排等...&#10;提示：包含'复诊'或'复查'字样会自动在日历中创建复诊提醒"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm resize-none"
        />
        <p className="mt-1 text-xs text-surface-400">
          提示：包含"复诊"或"复查"字样会自动在日历中创建复诊提醒
        </p>
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
