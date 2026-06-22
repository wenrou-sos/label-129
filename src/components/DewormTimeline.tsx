import { Pill, Bug, Clock, ArrowRight } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN, daysUntil, isUpcoming, isExpired, parseDateLocal } from '../utils/dateUtils';

interface DewormTimelineProps {
  limit?: number;
  showAll?: boolean;
}

export function DewormTimeline({ limit = 4, showAll = false }: DewormTimelineProps) {
  const { currentDeworms } = usePetStore();
  const deworms = currentDeworms();

  const sortedDeworms = [...deworms].sort(
    (a, b) => parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
  );

  const displayDeworms = showAll ? sortedDeworms : sortedDeworms.slice(0, limit);

  const findNextDeworm = (type: 'internal' | 'external') => {
    const typeRecords = sortedDeworms.filter((d) => d.type === type);
    if (typeRecords.length === 0) return null;

    const upcoming = typeRecords
      .filter((d) => !isExpired(d.nextDate))
      .sort(
        (a, b) => parseDateLocal(a.nextDate).getTime() - parseDateLocal(b.nextDate).getTime()
      );

    if (upcoming.length > 0) {
      return upcoming[0];
    }

    const expired = typeRecords.sort(
      (a, b) => parseDateLocal(b.nextDate).getTime() - parseDateLocal(a.nextDate).getTime()
    );
    return expired[0];
  };

  const nextInternal = findNextDeworm('internal');
  const nextExternal = findNextDeworm('external');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {nextInternal && (
          <div
            className={`p-3 rounded-xl border ${
              isExpired(nextInternal.nextDate)
                ? 'bg-accent-50 border-accent-200'
                : 'bg-primary-50 border-primary-100'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs mb-1 ${
                isExpired(nextInternal.nextDate) ? 'text-accent-600' : 'text-primary-600'
              }`}
            >
              <Pill className="w-3 h-3" />
              <span>下次体内驱虫</span>
            </div>
            <p
              className={`font-semibold text-sm mb-0.5 ${
                isExpired(nextInternal.nextDate) ? 'text-accent-600' : 'text-surface-800'
              }`}
            >
              {formatDateCN(nextInternal.nextDate)}
            </p>
            {isExpired(nextInternal.nextDate) ? (
              <p className="text-xs text-accent-500 font-medium">
                已过期 {Math.abs(daysUntil(nextInternal.nextDate))} 天
              </p>
            ) : isUpcoming(nextInternal.nextDate, 30) ? (
              <p className="text-xs text-primary-500">
                还有 {daysUntil(nextInternal.nextDate)} 天
              </p>
            ) : null}
          </div>
        )}
        {nextExternal && (
          <div
            className={`p-3 rounded-xl border ${
              isExpired(nextExternal.nextDate)
                ? 'bg-accent-50 border-accent-200'
                : 'bg-accent-50 border-accent-100'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 text-xs mb-1 ${
                isExpired(nextExternal.nextDate) ? 'text-accent-600' : 'text-accent-600'
              }`}
            >
              <Bug className="w-3 h-3" />
              <span>下次体外驱虫</span>
            </div>
            <p
              className={`font-semibold text-sm mb-0.5 ${
                isExpired(nextExternal.nextDate) ? 'text-accent-600' : 'text-surface-800'
              }`}
            >
              {formatDateCN(nextExternal.nextDate)}
            </p>
            {isExpired(nextExternal.nextDate) ? (
              <p className="text-xs text-accent-500 font-medium">
                已过期 {Math.abs(daysUntil(nextExternal.nextDate))} 天
              </p>
            ) : isUpcoming(nextExternal.nextDate, 30) ? (
              <p className="text-xs text-accent-500">
                还有 {daysUntil(nextExternal.nextDate)} 天
              </p>
            ) : null}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-200" />
        <div className="space-y-4">
          {displayDeworms.map((deworm) => (
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
