import { Syringe, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { isExpired, isUpcoming, formatDateCN, daysUntil, parseDateLocal } from '../utils/dateUtils';

interface VaccineListProps {
  limit?: number;
  showAll?: boolean;
}

export function VaccineList({ limit = 3, showAll = false }: VaccineListProps) {
  const { vaccines } = usePetStore();

  const sortedVaccines = [...vaccines].sort(
    (a, b) => parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
  );

  const displayVaccines = showAll ? sortedVaccines : sortedVaccines.slice(0, limit);

  return (
    <div className="space-y-3">
      {displayVaccines.map((vaccine) => {
        const expired = isExpired(vaccine.nextDate);
        const upcoming = isUpcoming(vaccine.nextDate, 30);
        const daysLeft = daysUntil(vaccine.nextDate);

        return (
          <div
            key={vaccine.id}
            className={`p-3 rounded-xl border ${expired ? 'bg-accent-50 border-accent-200' : upcoming ? 'bg-warning-50 border-warning-200' : 'bg-surface-50 border-surface-200'}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${expired ? 'bg-accent-100 text-accent-500' : 'bg-primary-100 text-primary-500'}`}
                >
                  <Syringe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-medium text-surface-800 text-sm">
                    {vaccine.name}
                  </h4>
                  <p className="text-xs text-surface-500">{vaccine.hospital}</p>
                </div>
              </div>
              {expired && (
                <span className="flex items-center gap-1 text-xs text-accent-500 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  已过期
                </span>
              )}
              {upcoming && !expired && (
                <span className="flex items-center gap-1 text-xs text-warning-600 font-medium">
                  <Clock className="w-3 h-3" />
                  还有{daysLeft}天
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-surface-500">
                <Calendar className="w-3 h-3" />
                接种：{formatDateCN(vaccine.date)}
              </div>
              <div
                className={`flex items-center gap-1 ${expired ? 'text-accent-500' : 'text-surface-500'}`}
              >
                下次：{formatDateCN(vaccine.nextDate)}
              </div>
            </div>
          </div>
        );
      })}

      {!showAll && vaccines.length > limit && (
        <p className="text-center text-xs text-surface-400 pt-1">
          共 {vaccines.length} 条记录，点击查看更多
        </p>
      )}
    </div>
  );
}
