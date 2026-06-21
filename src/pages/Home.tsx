import { useNavigate } from 'react-router-dom';
import { Syringe, Bug, FileText, Clock, ChevronRight } from 'lucide-react';
import { PetCard } from '../components/PetCard';
import { FunctionGrid } from '../components/FunctionGrid';
import { SectionCard } from '../components/SectionCard';
import { VaccineList } from '../components/VaccineList';
import { DewormTimeline } from '../components/DewormTimeline';
import { ExamReportCard } from '../components/ExamReportCard';
import { MedicalTimeline } from '../components/MedicalTimeline';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="animate-slide-up">
          <PetCard />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FunctionGrid
            onVaccineClick={() => {}}
            onDewormClick={() => {}}
            onExamClick={() => navigate('/compare')}
            onVisitClick={() => {}}
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <SectionCard
            title="疫苗本"
            icon={<Syringe className="w-5 h-5" />}
            extra={
              <span className="flex items-center text-primary-500 text-xs">
                查看全部 <ChevronRight className="w-4 h-4" />
              </span>
            }
          >
            <VaccineList limit={2} />
          </SectionCard>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <SectionCard
            title="驱虫记录"
            icon={<Bug className="w-5 h-5" />}
            extra={
              <span className="flex items-center text-primary-500 text-xs">
                查看全部 <ChevronRight className="w-4 h-4" />
              </span>
            }
          >
            <DewormTimeline limit={3} />
          </SectionCard>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <SectionCard
            title="体检报告"
            icon={<FileText className="w-5 h-5" />}
            onClick={() => navigate('/compare')}
          >
            <ExamReportCard compact />
          </SectionCard>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <SectionCard
            title="病历时间轴"
            icon={<Clock className="w-5 h-5" />}
            extra={
              <span className="flex items-center text-primary-500 text-xs">
                查看全部 <ChevronRight className="w-4 h-4" />
              </span>
            }
          >
            <MedicalTimeline limit={2} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
