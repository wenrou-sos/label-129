import { useState } from 'react';
import {
  FileText,
  Calendar,
  Building2,
  Scale,
  Plus,
  X,
  Check,
  Trash2,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { getTodayString } from '../utils/dateUtils';
import { generateId } from '../utils/id';
import type { BloodTest, BiochemTest } from '../types';

interface TestItemForm {
  tempId: string;
  name: string;
  value: string;
  unit: string;
  reference: string;
}

interface AddExamFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const parseReference = (reference: string): { min: number; max: number } | null => {
  const match = reference.match(/([\d.]+)\s*-\s*([\d.]+)/);
  if (match) {
    return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
  }
  return null;
};

const getStatus = (
  value: number, reference: string): 'normal' | 'high' | 'low' => {
  const range = parseReference(reference);
  if (!range) return 'normal';
  if (value > range.max) return 'high';
  if (value < range.min) return 'low';
  return 'normal';
};

const getStatusText = (status: 'normal' | 'high' | 'low'): string => {
  switch (status) {
    case 'high':
      return '偏高';
    case 'low':
      return '偏低';
    default:
      return '正常';
  }
};

const getStatusColor = (status: 'normal' | 'high' | 'low'): string => {
  switch (status) {
    case 'high':
      return 'text-accent-500 bg-accent-50';
    case 'low':
      return 'text-warning-500 bg-warning-50';
    default:
      return 'text-green-600 bg-green-50';
  }
};

const defaultBloodPresets = [
  { name: '白细胞计数', unit: '10^9/L', reference: '6.0-16.0' },
  { name: '红细胞计数', unit: '10^12/L', reference: '5.5-8.5' },
  { name: '血红蛋白', unit: 'g/L', reference: '120-180' },
  { name: '血小板计数', unit: '10^9/L', reference: '200-500' },
  { name: '淋巴细胞比率', unit: '%', reference: '20-50' },
];

const defaultBiochemPresets = [
  { name: '谷丙转氨酶(ALT)', unit: 'U/L', reference: '10-60' },
  { name: '谷草转氨酶(AST)', unit: 'U/L', reference: '10-50' },
  { name: '总胆固醇', unit: 'mmol/L', reference: '3.5-6.5' },
  { name: '血糖', unit: 'mmol/L', reference: '3.9-6.1' },
  { name: '尿素氮', unit: 'mmol/L', reference: '2.5-9.0' },
  { name: '肌酐', unit: 'μmol/L', reference: '44-133' },
];

export function AddExamForm({ onClose, onSuccess }: AddExamFormProps) {
  const { addExamReport } = usePetStore();
  const [formData, setFormData] = useState({
    date: getTodayString(),
    hospital: '',
    weight: '',
  });
  const [bloodTests, setBloodTests] = useState<TestItemForm[]>(
    defaultBloodPresets.map((p) => ({
      tempId: generateId('temp'), ...p, value: '' }))
  );
  const [biochemTests, setBiochemTests] = useState<TestItemForm[]>(
    defaultBiochemPresets.map((p) => ({
      tempId: generateId('temp'), ...p, value: '' }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'blood' | 'biochem'>('basic');

  const handleBasicChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleTestChange = (
    type: 'blood' | 'biochem',
    tempId: string,
    field: string,
    value: string
  ) => {
    const setter = type === 'blood' ? setBloodTests : setBiochemTests;
    setter((prev) =>
      prev.map((t) => (t.tempId === tempId ? { ...t, [field]: value } : t))
    );
  };

  const addTestItem = (type: 'blood' | 'biochem') => {
    const setter = type === 'blood' ? setBloodTests : setBiochemTests;
    setter((prev) => [
      ...prev,
      { tempId: generateId('temp'), name: '', value: '', unit: '', reference: '' },
    ]);
  };

  const removeTestItem = (type: 'blood' | 'biochem', tempId: string) => {
    const setter = type === 'blood' ? setBloodTests : setBiochemTests;
    setter((prev) => prev.filter((t) => t.tempId !== tempId));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = '请选择检查日期';
    if (!formData.hospital.trim()) newErrors.hospital = '请输入检查医院';
    if (!formData.weight) {
      newErrors.weight = '请输入体重';
    } else if (isNaN(parseFloat(formData.weight))) {
      newErrors.weight = '体重必须是数字';
    }

    const validateTests = (tests: TestItemForm[], prefix: string) => {
      tests.forEach((test, index) => {
        if (test.name.trim() || test.value || test.unit || test.reference) {
          if (!test.name.trim()) {
            newErrors[`${prefix}-name-${index}`] = '请输入指标名称';
          }
          if (!test.value) {
            newErrors[`${prefix}-value-${index}`] = '请输入数值';
          } else if (isNaN(parseFloat(test.value))) {
            newErrors[`${prefix}-value-${index}`] = '数值必须是数字';
          }
          if (!test.unit.trim()) {
            newErrors[`${prefix}-unit-${index}`] = '请输入单位';
          }
          if (!test.reference.trim()) {
            newErrors[`${prefix}-reference-${index}`] = '请输入参考范围';
          } else if (!parseReference(test.reference)) {
            newErrors[`${prefix}-reference-${index}`] = '参考范围格式错误，如"4.0-10.0';
          }
        }
      });
    };

    validateTests(bloodTests, 'blood');
    validateTests(biochemTests, 'biochem');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const mapToTest = (test: TestItemForm): BloodTest | BiochemTest => {
      const value = parseFloat(test.value);
      const status = getStatus(value, test.reference);
      return {
        id: generateId(test.tempId.startsWith('b') ? 'blood' : 'biochem'),
        name: test.name.trim(),
        value,
        unit: test.unit.trim(),
        reference: test.reference.trim(),
        status,
      };
    };

    const validBloodTests = bloodTests
      .filter((t) => t.name.trim() && t.value)
      .map(mapToTest);

    const validBiochemTests = biochemTests
      .filter((t) => t.name.trim() && t.value)
      .map(mapToTest);

    const abnormalItems: string[] = [];
    [...validBloodTests, ...validBiochemTests].forEach((test) => {
      if (test.status !== 'normal') {
        abnormalItems.push(`${test.name}${getStatusText(test.status)}`);
      }
    });

    addExamReport({
      date: formData.date,
      hospital: formData.hospital.trim(),
      weight: parseFloat(formData.weight),
      abnormalItems,
      bloodTests: validBloodTests as BloodTest[],
      biochemTests: validBiochemTests as BiochemTest[],
    });

    onSuccess?.();
    onClose();
  };

  const filledBloodCount = bloodTests.filter((t) => t.name.trim() || t.value).length;
  const filledBiochemCount = biochemTests.filter((t) => t.name.trim() || t.value).length;

  const tabs = [
    { id: 'basic' as const, label: '基本信息', icon: FileText },
    { id: 'blood' as const, label: `血常规 (${filledBloodCount})`, icon: Activity },
    { id: 'biochem' as const, label: `生化 (${filledBiochemCount})`, icon: Activity },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl p-1 shadow-sm border border-surface-100">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-9 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-1 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
              <Calendar className="w-4 h-4 text-primary-500" />
              检查日期
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleBasicChange('date', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
            />
            {errors.date && <p className="mt-1 text-xs text-accent-500">{errors.date}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
              <Building2 className="w-4 h-4 text-primary-500" />
              检查医院
            </label>
            <input
              type="text"
              value={formData.hospital}
              onChange={(e) => handleBasicChange('hospital', e.target.value)}
              placeholder="请输入医院名称"
              className={`w-full px-4 py-3 rounded-xl border ${errors.hospital ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
            />
            {errors.hospital && <p className="mt-1 text-xs text-accent-500">{errors.hospital}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 mb-2">
              <Scale className="w-4 h-4 text-primary-500" />
              体重 (kg)
            </label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => handleBasicChange('weight', e.target.value)}
              placeholder="请输入体重，如 28.5"
              className={`w-full px-4 py-3 rounded-xl border ${errors.weight ? 'border-accent-400' : 'border-surface-200'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors text-sm`}
            />
            {errors.weight && <p className="mt-1 text-xs text-accent-500">{errors.weight}</p>}
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
              type="button"
              onClick={() => setActiveTab('blood')}
              className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-sm"
            >
              下一步
            </button>
          </div>
        </div>
      )}

      {activeTab === 'blood' && (
        <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-surface-700">血常规指标</h4>
          <button
            type="button"
            onClick={() => addTestItem('blood')}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            添加指标
          </button>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {bloodTests.map((test, index) => (
            <div key={test.tempId} className="bg-surface-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <span className="font-medium">指标 {index + 1}</span>
                  {test.value && test.reference && !isNaN(parseFloat(test.value)) && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(getStatus(parseFloat(test.value), test.reference))}`}>
                      {getStatusText(getStatus(parseFloat(test.value), test.reference))}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeTestItem('blood', test.tempId)}
                  className="text-surface-400 hover:text-accent-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <input
                    type="text"
                    value={test.name}
                    onChange={(e) => handleTestChange('blood', test.tempId, 'name', e.target.value)}
                    placeholder="指标名称"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`blood-name-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`blood-name-${index}`]}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={test.value}
                    onChange={(e) => handleTestChange('blood', test.tempId, 'value', e.target.value)}
                    placeholder="数值"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`blood-value-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`blood-value-${index}`]}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={test.unit}
                    onChange={(e) => handleTestChange('blood', test.tempId, 'unit', e.target.value)}
                    placeholder="单位"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`blood-unit-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`blood-unit-${index}`]}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={test.reference}
                    onChange={(e) => handleTestChange('blood', test.tempId, 'reference', e.target.value)}
                    placeholder="如 4-10"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`blood-reference-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`blood-reference-${index}`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className="flex-1 h-11 rounded-xl bg-surface-100 text-surface-600 font-medium active:scale-[0.98] transition-transform text-sm"
          >
            上一步
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('biochem')}
            className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-sm"
          >
            下一步
          </button>
        </div>
        </div>
      )}

      {activeTab === 'biochem' && (
        <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-surface-700">生化检查指标</h4>
          <button
            type="button"
            onClick={() => addTestItem('biochem')}
            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            添加指标
          </button>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {biochemTests.map((test, index) => (
            <div key={test.tempId} className="bg-surface-50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-surface-500">
                  <span className="font-medium">指标 {index + 1}</span>
                  {test.value && test.reference && !isNaN(parseFloat(test.value)) && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(getStatus(parseFloat(test.value), test.reference))}`}>
                      {getStatusText(getStatus(parseFloat(test.value), test.reference))}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeTestItem('biochem', test.tempId)}
                  className="text-surface-400 hover:text-accent-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <input
                    type="text"
                    value={test.name}
                    onChange={(e) => handleTestChange('biochem', test.tempId, 'name', e.target.value)}
                    placeholder="指标名称"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`biochem-name-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`biochem-name-${index}`]}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={test.value}
                    onChange={(e) => handleTestChange('biochem', test.tempId, 'value', e.target.value)}
                    placeholder="数值"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`biochem-value-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`biochem-value-${index}`]}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={test.unit}
                    onChange={(e) => handleTestChange('biochem', test.tempId, 'unit', e.target.value)}
                    placeholder="单位"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`biochem-unit-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`biochem-unit-${index}`]}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    value={test.reference}
                    onChange={(e) => handleTestChange('biochem', test.tempId, 'reference', e.target.value)}
                    placeholder="如 4-10"
                    className="w-full px-2 py-2 rounded-lg border border-surface-200 text-xs focus:outline-none focus:border-primary-400"
                  />
                  {errors[`biochem-reference-${index}`] && (
                    <p className="mt-0.5 text-[10px] text-accent-500">{errors[`biochem-reference-${index}`]}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('blood')}
            className="flex-1 h-11 rounded-xl bg-surface-100 text-surface-600 font-medium active:scale-[0.98] transition-transform text-sm"
          >
            上一步
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-sm"
          >
            <Check className="w-4 h-4" />
            保存记录
          </button>
        </div>
        </div>
      )}
    </form>
  );
}
