import { useState } from 'react';
import { FileText, AlertCircle, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN } from '../utils/dateUtils';

interface ExamReportCardProps {
  compact?: boolean;
}

export function ExamReportCard({ compact = true }: ExamReportCardProps) {
  const { getLatestExamReport } = usePetStore();
  const [expanded, setExpanded] = useState(false);

  const latestReport = getLatestExamReport();

  if (!latestReport) {
    return (
      <div className="text-center py-6 text-surface-400">
        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">暂无体检报告</p>
      </div>
    );
  }

  const hasAbnormal = latestReport.abnormalItems.length > 0;

  return (
    <div>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-warning-100 text-warning-500 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-surface-800">最近体检</h4>
            {hasAbnormal && (
              <span className="px-1.5 py-0.5 bg-accent-100 text-accent-500 text-xs rounded-full">
                {latestReport.abnormalItems.length}项异常
              </span>
            )}
          </div>
          <p className="text-xs text-surface-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateCN(latestReport.date)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-primary-600">
            {latestReport.weight}kg
          </p>
          <p className="text-xs text-surface-400">体重</p>
        </div>
      </div>

      {hasAbnormal && (
        <div className="mb-3">
          <button
            className="w-full flex items-center justify-between text-sm text-surface-600"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-accent-500" />
              异常项目摘要
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expanded && (
            <div className="mt-2 p-3 bg-accent-50 rounded-xl">
              <ul className="space-y-1">
                {latestReport.abnormalItems.map((item, index) => (
                  <li key={index} className="text-sm text-accent-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!compact && (
        <div className="space-y-3">
          <div>
            <h5 className="text-sm font-medium text-surface-700 mb-2">
              血常规关键指标
            </h5>
            <div className="space-y-2">
              {latestReport.bloodTests.slice(0, 3).map((test) => (
                <div
                  key={test.id}
                  className="p-2 rounded-lg bg-surface-50 flex items-center justify-between"
                >
                  <span className="text-sm text-surface-600">{test.name}</span>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        test.status === 'normal'
                          ? 'text-surface-800'
                          : test.status === 'high'
                          ? 'text-accent-500'
                          : 'text-warning-500'
                      }`}
                    >
                      {test.value} {test.unit}
                    </span>
                    <p className="text-xs text-surface-400">
                      参考：{test.reference}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-surface-700 mb-2">
              生化关键指标
            </h5>
            <div className="space-y-2">
              {latestReport.biochemTests.slice(0, 3).map((test) => (
                <div
                  key={test.id}
                  className="p-2 rounded-lg bg-surface-50 flex items-center justify-between"
                >
                  <span className="text-sm text-surface-600">{test.name}</span>
                  <div className="text-right">
                    <span
                      className={`text-sm font-medium ${
                        test.status === 'normal'
                          ? 'text-surface-800'
                          : test.status === 'high'
                          ? 'text-accent-500'
                          : 'text-warning-500'
                      }`}
                    >
                      {test.value} {test.unit}
                    </span>
                    <p className="text-xs text-surface-400">
                      参考：{test.reference}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
