import { useNavigate } from 'react-router-dom';
import {
  Search,
  Syringe,
  Bug,
  Stethoscope,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN, parseDateLocal } from '../utils/dateUtils';

interface SearchResultListProps {
  keyword: string;
}

type SearchResultItem = {
  id: string;
  type: 'vaccine' | 'deworm' | 'visit' | 'exam';
  date: string;
  title: string;
  subtitle: string;
  matchedField: string;
  navigateTo?: string;
};

export function SearchResultList({ keyword }: SearchResultListProps) {
  const navigate = useNavigate();
  const { currentVaccines, currentDeworms, currentVisitRecords, currentExamReports } =
    usePetStore();

  const vaccines = currentVaccines();
  const deworms = currentDeworms();
  const visitRecords = currentVisitRecords();
  const examReports = currentExamReports();

  const lowerKeyword = keyword.trim().toLowerCase();

  if (!lowerKeyword) {
    return null;
  }

  const results: SearchResultItem[] = [];

  vaccines.forEach((v) => {
    const fields = {
      name: v.name,
      hospital: v.hospital,
    };
    for (const [key, value] of Object.entries(fields)) {
      if (value.toLowerCase().includes(lowerKeyword)) {
        results.push({
          id: `vaccine-${v.id}`,
          type: 'vaccine',
          date: v.date,
          title: v.name,
          subtitle: v.hospital,
          matchedField: key === 'name' ? '疫苗名称' : '接种医院',
        });
        break;
      }
    }
  });

  deworms.forEach((d) => {
    if (d.medicine.toLowerCase().includes(lowerKeyword)) {
      results.push({
        id: `deworm-${d.id}`,
        type: 'deworm',
        date: d.date,
        title: d.type === 'internal' ? '体内驱虫' : '体外驱虫',
        subtitle: `药物：${d.medicine}`,
        matchedField: '驱虫药物',
      });
    }
  });

  visitRecords.forEach((v) => {
    const fields = {
      chiefComplaint: v.chiefComplaint,
      diagnosis: v.diagnosis,
      hospital: v.hospital,
      doctor: v.doctor,
    };
    for (const [key, value] of Object.entries(fields)) {
      if (value.toLowerCase().includes(lowerKeyword)) {
        results.push({
          id: `visit-${v.id}`,
          type: 'visit',
          date: v.date,
          title: v.diagnosis,
          subtitle: `${v.hospital} · ${v.doctor}`,
          matchedField:
            key === 'chiefComplaint'
              ? '主诉'
              : key === 'diagnosis'
              ? '诊断结论'
              : key === 'hospital'
              ? '医院'
              : '主治医生',
          navigateTo: `/visit/${v.id}`,
        });
        break;
      }
    }
  });

  examReports.forEach((e) => {
    const fields = {
      hospital: e.hospital,
      abnormalItems: e.abnormalItems.join(','),
    };
    for (const [key, value] of Object.entries(fields)) {
      if (value.toLowerCase().includes(lowerKeyword)) {
        results.push({
          id: `exam-${e.id}`,
          type: 'exam',
          date: e.date,
          title: '体检报告',
          subtitle: `${e.hospital} · ${e.weight}kg`,
          matchedField: key === 'hospital' ? '体检医院' : '异常项目',
        });
        break;
      }
    }
  });

  results.sort(
    (a, b) => parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'vaccine':
        return <Syringe className="w-4 h-4" />;
      case 'deworm':
        return <Bug className="w-4 h-4" />;
      case 'visit':
        return <Stethoscope className="w-4 h-4" />;
      case 'exam':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'bg-primary-100 text-primary-500';
      case 'deworm':
        return 'bg-accent-100 text-accent-500';
      case 'visit':
        return 'bg-purple-100 text-purple-500';
      case 'exam':
        return 'bg-warning-100 text-warning-500';
      default:
        return 'bg-surface-100 text-surface-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vaccine':
        return '疫苗';
      case 'deworm':
        return '驱虫';
      case 'visit':
        return '就诊';
      case 'exam':
        return '体检';
      default:
        return '';
    }
  };

  const handleItemClick = (item: SearchResultItem) => {
    if (item.navigateTo) {
      navigate(item.navigateTo);
    }
  };

  const highlightKeyword = (text: string) => {
    if (!lowerKeyword) return text;
    const escaped = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === lowerKeyword ? (
        <span key={index} className="text-primary-600 font-medium">
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-surface-400">
        找到 {results.length} 条相关记录
      </p>

      {results.length === 0 ? (
        <div className="text-center py-10 text-surface-400">
          <Search className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm">未找到相关记录</p>
          <p className="text-xs mt-1">换个关键词试试</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-3 border border-surface-100 ${
                item.navigateTo
                  ? 'cursor-pointer active:scale-[0.99] hover:bg-surface-50 transition-colors'
                  : ''
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(
                    item.type
                  )}`}
                >
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-surface-400">
                      {getTypeLabel(item.type)} · {item.matchedField}
                    </span>
                  </div>
                  <h4 className="font-medium text-surface-800 text-sm mb-1">
                    {highlightKeyword(item.title)}
                  </h4>
                  <p className="text-xs text-surface-500 line-clamp-2">
                    {highlightKeyword(item.subtitle)}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-surface-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateCN(item.date)}</span>
                  </div>
                </div>
                {item.navigateTo && (
                  <ChevronRight className="w-4 h-4 text-surface-300 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
