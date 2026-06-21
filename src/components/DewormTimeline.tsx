import { Pill, Bug, Clock, ArrowRight } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN, daysUntil, isUpcoming } from '../utils/dateUtils';

interface DewormTimelineProps {
  limit?: number;
  showAll?: boolean;
}

export function DewormTimeline({ limit = 4, showAll = false }: DewormTimelineProps) {
  const { deworms } = usePetStore();

  const sortedDeworms = [...deworms].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const displayDeworms = showAll ? sortedDeworms : sortedDeworms.slice(0, limit);

  const nextInternal = sortedDeworms
    .filter((d) => d.type === 'internal')
    .sort((a, b) => new Date(b.nextDate).getTime() - new Date(a.nextDate).getTime())[0];

  const nextExternal = sortedDeworms
    .filter((d) => d.type === 'external')
    .sort((a, b) => new Date(b.nextDate).getTime() - new Date(a.nextDate).getTime())[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {nextInternal && (
          <div className="p-3 rounded-xl bg-primary-50 border border-primary-100">
            <div className="flex items-center gap-1.5 text-primary-600 text-xs mb-1">
              <Pill className="w-3 h-3" />
              <span>下次体内驱虫</span>
            </div>
            <p className="font-semibold text-surface-800 text-sm mb-0.5">
              {formatDateCN(nextInternal.nextDate)}
            </p>
            {isUpcoming(nextInternal.nextDate, 30) && (
              <p className="text-xs text-primary-500">
                还有 {daysUntil(nextInternal.nextDate)} 天
              </p>
            )}
          </div>
        )}
        {nextExternal && (
          <div className="p-3 rounded-xl bg-accent-50 border border-accent-100">
            <div className="flex items-center gap-1.5 text-accent-600 text-xs mb-1">
              <Bug className="w-3 h-3" />
              <span>下次体外驱虫</span>
            </div>
            <p className="font-semibold text-surface-800 text-sm mb-0.5">
              {formatDateCN(nextExternal.nextDate)}
            </p>
            {isUpcoming(nextExternal.nextDate, 30) && (
              <p className="text-xs text-accent-500">
                还有 {daysUntil(nextExternal.nextDate)} 天
              </p>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-200" />
        <div className="space-y-4">
          {displayDeworms.map((deworm, index) => (
            <div key={deworm.id} className="relative flex gap-3">
              <div
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  deworm.type === 'internal'
                    ? 'bg-primary-100 text-primary-500'
                    : 'bg-accent-100 text-accent-500'
                }`}
              >
                {deworm.type === 'internal' ? (
                  <Pill className="w-4 h-4" />
                ) : (
                  <Bug className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-surface-800 text-sm">
                    {deworm.type === 'internal' ? '体内驱虫' : '体外驱虫'}
                  </h4>
                  <span className="text-xs text-surface-500">
                    {formatDateCN(deworm.date)}
                  </span>
                </div>
                <p className="text-xs text-surface-500 mb-1">药物：{deworm.medicine}</p>
                <div className="flex items-center gap-1 text-xs text-surface-400">
                  <Clock className="w-3 h-3" />
                  <span>下次：{formatDateCN(deworm.nextDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!showAll && deworms.length > limit && (
        <div className="flex items-center justify-center gap-1 text-xs text-surface-400 pt-1">
          <span>共 {deworms.length} 条记录</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}
