import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Syringe,
  Bug,
  FileText,
  Clock,
  ChevronRight,
  ChevronUp,
  Plus,
} from 'lucide-react';
import { PetCard } from '../components/PetCard';
import { FunctionGrid } from '../components/FunctionGrid';
import { SectionCard } from '../components/SectionCard';
import { VaccineList } from '../components/VaccineList';
import { DewormTimeline } from '../components/DewormTimeline';
import { ExamReportCard } from '../components/ExamReportCard';
import { MedicalTimeline } from '../components/MedicalTimeline';
import { Modal } from '../components/Modal';
import { AddVaccineForm } from '../components/AddVaccineForm';
import { AddDewormForm } from '../components/AddDewormForm';
import { AddVisitForm } from '../components/AddVisitForm';

export default function Home() {
  const navigate = useNavigate();
  const [showAllVaccine, setShowAllVaccine] = useState(false);
  const [showAllDeworm, setShowAllDeworm] = useState(false);
  const [showAllVisit, setShowAllVisit] = useState(false);

  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showDewormModal, setShowDewormModal] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const vaccineRef = useRef<HTMLDivElement>(null);
  const dewormRef = useRef<HTMLDivElement>(null);
  const examRef = useRef<HTMLDivElement>(null);
  const visitRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleSection = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    currentValue: boolean,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    setter(!currentValue);
    setTimeout(() => scrollToRef(ref), 100);
  };

  const handleAddSuccess = () => {
    setShowAllVaccine(true);
    setShowAllDeworm(true);
    setShowAllVisit(true);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="animate-slide-up">
          <PetCard />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FunctionGrid
            onVaccineClick={() => scrollToRef(vaccineRef)}
            onDewormClick={() => scrollToRef(dewormRef)}
            onExamClick={() => scrollToRef(examRef)}
            onVisitClick={() => scrollToRef(visitRef)}
          />
        </div>

        <div ref={vaccineRef} className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <SectionCard
            title="疫苗本"
            icon={<Syringe className="w-5 h-5" />}
            extra={
              <div className="flex items-center gap-2" onClick={stopPropagation}>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-50 text-primary-600 text-xs font-medium hover:bg-primary-100 transition-colors"
                  onClick={() => setShowVaccineModal(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加记录
                </button>
                <button
                  className="flex items-center text-primary-500 text-xs hover:text-primary-600"
                  onClick={() => toggleSection(setShowAllVaccine, showAllVaccine, vaccineRef)}
                >
                  {showAllVaccine ? (
                    <>
                      收起 <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      查看全部 <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            }
            onClick={() => toggleSection(setShowAllVaccine, showAllVaccine, vaccineRef)}
          >
            <VaccineList limit={2} showAll={showAllVaccine} />
          </SectionCard>
        </div>

        <div ref={dewormRef} className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <SectionCard
            title="驱虫记录"
            icon={<Bug className="w-5 h-5" />}
            extra={
              <div className="flex items-center gap-2" onClick={stopPropagation}>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-50 text-accent-600 text-xs font-medium hover:bg-accent-100 transition-colors"
                  onClick={() => setShowDewormModal(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加记录
                </button>
                <button
                  className="flex items-center text-primary-500 text-xs hover:text-primary-600"
                  onClick={() => toggleSection(setShowAllDeworm, showAllDeworm, dewormRef)}
                >
                  {showAllDeworm ? (
                    <>
                      收起 <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      查看全部 <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            }
            onClick={() => toggleSection(setShowAllDeworm, showAllDeworm, dewormRef)}
          >
            <DewormTimeline limit={3} showAll={showAllDeworm} />
          </SectionCard>
        </div>

        <div ref={examRef} className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <SectionCard
            title="体检报告"
            icon={<FileText className="w-5 h-5" />}
            onClick={() => navigate('/compare')}
            extra={
              <button
                className="flex items-center text-primary-500 text-xs hover:text-primary-600"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/compare');
                }}
              >
                对比分析 <ChevronRight className="w-4 h-4" />
              </button>
            }
          >
            <ExamReportCard compact />
          </SectionCard>
        </div>

        <div ref={visitRef} className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <SectionCard
            title="病历时间轴"
            icon={<Clock className="w-5 h-5" />}
            extra={
              <div className="flex items-center gap-2" onClick={stopPropagation}>
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-50 text-purple-600 text-xs font-medium hover:bg-purple-100 transition-colors"
                  onClick={() => setShowVisitModal(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  添加记录
                </button>
                <button
                  className="flex items-center text-primary-500 text-xs hover:text-primary-600"
                  onClick={() => toggleSection(setShowAllVisit, showAllVisit, visitRef)}
                >
                  {showAllVisit ? (
                    <>
                      收起 <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      查看全部 <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            }
            onClick={() => toggleSection(setShowAllVisit, showAllVisit, visitRef)}
          >
            <MedicalTimeline limit={2} showAll={showAllVisit} />
          </SectionCard>
        </div>
      </div>

      <Modal
        isOpen={showVaccineModal}
        onClose={() => setShowVaccineModal(false)}
        title="添加疫苗记录"
      >
        <AddVaccineForm
          onClose={() => setShowVaccineModal(false)}
          onSuccess={handleAddSuccess}
        />
      </Modal>

      <Modal
        isOpen={showDewormModal}
        onClose={() => setShowDewormModal(false)}
        title="添加驱虫记录"
      >
        <AddDewormForm
          onClose={() => setShowDewormModal(false)}
          onSuccess={handleAddSuccess}
        />
      </Modal>

      <Modal
        isOpen={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        title="添加就诊记录"
      >
        <AddVisitForm
          onClose={() => setShowVisitModal(false)}
          onSuccess={handleAddSuccess}
        />
      </Modal>
    </div>
  );
}
