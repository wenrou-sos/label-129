import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Calendar,
  Building2,
  User,
  Stethoscope,
  ClipboardList,
  Pill,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN } from '../utils/dateUtils';

export default function VisitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVisitRecordById } = usePetStore();

  const visitRecord = getVisitRecordById(id || '');

  if (!visitRecord) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-surface-300 mx-auto mb-2" />
          <p className="text-surface-500">未找到该就诊记录</p>
          <button
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm"
            onClick={() => navigate('/')}
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${visitRecord.hospital}就诊记录`,
        text: `${visitRecord.date} ${visitRecord.diagnosis}`,
      });
    } else {
      alert('分享功能暂不支持，请截图分享');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-surface-200 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button
            className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full hover:bg-surface-100 transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5 text-surface-700" />
          </button>
          <h1 className="font-semibold text-surface-800">就诊详情</h1>
          <button
            className="w-10 h-10 flex items-center justify-center -mr-2 rounded-full hover:bg-surface-100 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 text-surface-700" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-500 flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-surface-800 text-lg">
                {visitRecord.hospital}
              </h2>
              <p className="text-sm text-surface-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-4 h-4" />
                {formatDateCN(visitRecord.date)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-surface-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-600">
                主治医生：{visitRecord.doctor}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-surface-400" />
              <span className="text-sm text-surface-600">
                {visitRecord.hospital}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-surface-800">主诉</h3>
          </div>
          <p className="text-surface-700 text-sm leading-relaxed">
            {visitRecord.chiefComplaint}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-warning-500" />
            <h3 className="font-semibold text-surface-800">检查项目</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {visitRecord.examItems.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-surface-100 text-surface-700 text-sm rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-accent-500" />
            <h3 className="font-semibold text-surface-800">诊断结论</h3>
          </div>
          <div className="p-3 bg-accent-50 rounded-xl">
            <p className="text-accent-700 text-sm leading-relaxed">
              {visitRecord.diagnosis}
            </p>
          </div>
        </div>

        {visitRecord.medications.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-surface-800">
                药物处方 ({visitRecord.medications.length}种)
              </h3>
            </div>
            <div className="space-y-3">
              {visitRecord.medications.map((med) => (
                <div
                  key={med.id}
                  className="p-3 bg-surface-50 rounded-xl border border-surface-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-surface-800 text-sm">
                      {med.name}
                    </h4>
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span>用法：{med.frequency}</span>
                    <span>疗程：{med.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-surface-800">治疗建议</h3>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <p className="text-green-700 text-sm leading-relaxed whitespace-pre-line">
              {visitRecord.treatmentAdvice}
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 p-4 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            className="flex-1 h-11 rounded-xl bg-surface-100 text-surface-700 font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </button>
          <button
            className="flex-1 h-11 rounded-xl bg-primary-500 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            分享记录
          </button>
        </div>
      </div>
    </div>
  );
}
