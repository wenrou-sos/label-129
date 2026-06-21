import { useNavigate } from 'react-router-dom';
import { Clock, Stethoscope, ChevronRight, Calendar } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN } from '../utils/dateUtils';

interface MedicalTimelineProps {
  limit?: number;
  showAll?: boolean;
}

export function MedicalTimeline({ limit = 3, showAll = false }: MedicalTimelineProps) {
  const { visitRecords } = usePetStore();
  const navigate = useNavigate();

  const sortedRecords = [...visitRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayRecords = showAll ? sortedRecords : sortedRecords.slice(0, limit);

  const handleClick = (id: string) => {
    navigate(`/visit/${id}`);
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-200" />
      <div className="space-y-4">
        {displayRecords.map((record) => (
          <div
            key={record.id}
            className="relative flex gap-3 cursor-pointer"
            onClick={() => handleClick(record.id)}
          >
            <div className="relative z-10 w-8 h-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="flex-1 pb-4">
              <div className="bg-surface-50 rounded-xl p-3 hover:bg-surface-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-surface-500" />
                    <span className="text-sm font-medium text-surface-800">
                      {formatDateCN(record.date)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-surface-400" />
                </div>
                <p className="text-sm text-surface-700 font-medium mb-1">
                  {record.hospital}
                </p>
                <p className="text-xs text-surface-500 line-clamp-2">
                  {record.diagnosis}
                </p>
                {record.medications.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-primary-600">
                    <Clock className="w-3 h-3" />
                    <span>开具 {record.medications.length} 种药物</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!showAll && visitRecords.length > limit && (
        <p className="text-center text-xs text-surface-400 pt-1 pl-8">
          共 {visitRecords.length} 条记录，点击查看更多
        </p>
      )}
    </div>
  );
}
