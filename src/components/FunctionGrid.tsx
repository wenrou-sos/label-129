import { Syringe, Bug, FileText, Clock } from 'lucide-react';

interface FunctionEntry {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface FunctionGridProps {
  onVaccineClick?: () => void;
  onDewormClick?: () => void;
  onExamClick?: () => void;
  onVisitClick?: () => void;
}

const entries: FunctionEntry[] = [
  {
    id: 'vaccine',
    title: '疫苗本',
    description: '接种记录与提醒',
    icon: <Syringe className="w-6 h-6" />,
    color: 'text-primary-500',
    bgColor: 'bg-primary-50',
  },
  {
    id: 'deworm',
    title: '驱虫记录',
    description: '体内外驱虫管理',
    icon: <Bug className="w-6 h-6" />,
    color: 'text-accent-500',
    bgColor: 'bg-accent-50',
  },
  {
    id: 'exam',
    title: '体检报告',
    description: '健康指标监测',
    icon: <FileText className="w-6 h-6" />,
    color: 'text-warning-500',
    bgColor: 'bg-warning-50',
  },
  {
    id: 'visit',
    title: '病历档案',
    description: '就诊记录查询',
    icon: <Clock className="w-6 h-6" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
];

export function FunctionGrid({
  onVaccineClick,
  onDewormClick,
  onExamClick,
  onVisitClick,
}: FunctionGridProps) {
  const handleClick = (id: string) => {
    switch (id) {
      case 'vaccine':
        onVaccineClick?.();
        break;
      case 'deworm':
        onDewormClick?.();
        break;
      case 'exam':
        onExamClick?.();
        break;
      case 'visit':
        onVisitClick?.();
        break;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="bg-white rounded-2xl p-4 shadow-card cursor-pointer active:scale-[0.97] transition-all duration-200 hover:shadow-card-hover"
          onClick={() => handleClick(entry.id)}
        >
          <div
            className={`w-12 h-12 rounded-xl ${entry.bgColor} ${entry.color} flex items-center justify-center mb-3`}
          >
            {entry.icon}
          </div>
          <h3 className="font-semibold text-surface-800 mb-1">{entry.title}</h3>
          <p className="text-xs text-surface-500">{entry.description}</p>
        </div>
      ))}
    </div>
  );
}
