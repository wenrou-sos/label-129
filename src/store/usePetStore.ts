import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Pet,
  Vaccine,
  Deworm,
  ExamReport,
  VisitRecord,
  CalendarEvent,
} from '../types';
import {
  mockPets,
  mockVaccines,
  mockDeworms,
  mockExamReports,
  mockVisitRecords,
  mockCalendarEvents,
} from '../data/mockData';
import { parseDateLocal } from '../utils/dateUtils';
import { generateId } from '../utils/id';

export type SearchResultType = 'vaccine' | 'deworm' | 'visit';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  date: string;
  title: string;
  subtitle: string;
  matchedFields: string[];
}

interface PetState {
  pets: Pet[];
  currentPetId: string;
  vaccines: Vaccine[];
  deworms: Deworm[];
  examReports: ExamReport[];
  visitRecords: VisitRecord[];
  calendarEvents: CalendarEvent[];

  currentPet: () => Pet | undefined;
  setCurrentPetId: (id: string) => void;
  addPet: (pet: Omit<Pet, 'id'>) => void;
  updatePet: (id: string, pet: Partial<Pet>) => void;
  deletePet: (id: string) => void;

  currentVaccines: () => Vaccine[];
  addVaccine: (vaccine: Omit<Vaccine, 'id' | 'petId'>) => void;

  currentDeworms: () => Deworm[];
  addDeworm: (deworm: Omit<Deworm, 'id' | 'petId'>) => void;

  currentExamReports: () => ExamReport[];
  addExamReport: (report: Omit<ExamReport, 'id' | 'petId'>) => void;

  currentVisitRecords: () => VisitRecord[];
  addVisitRecord: (record: Omit<VisitRecord, 'id' | 'petId'>) => void;
  getVisitRecordById: (id: string) => VisitRecord | undefined;

  currentCalendarEvents: () => CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id' | 'petId'>) => void;
  removeCalendarEvent: (id: string) => void;

  getLatestExamReport: () => ExamReport | undefined;
  getPreviousExamReport: () => ExamReport | undefined;

  searchRecords: (keyword: string) => SearchResult[];

  resetAllData: () => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pets: mockPets,
      currentPetId: mockPets[0].id,
      vaccines: mockVaccines,
      deworms: mockDeworms,
      examReports: mockExamReports,
      visitRecords: mockVisitRecords,
      calendarEvents: mockCalendarEvents,

      currentPet: () => {
        return get().pets.find((p) => p.id === get().currentPetId);
      },

      setCurrentPetId: (id) => set({ currentPetId: id }),

      addPet: (pet) => {
        const newPet: Pet = {
          ...pet,
          id: generateId('pet'),
        };
        set((state) => ({
          pets: [...state.pets, newPet],
          currentPetId: newPet.id,
        }));
      },

      updatePet: (id, pet) => {
        set((state) => ({
          pets: state.pets.map((p) => (p.id === id ? { ...p, ...pet } : p)),
        }));
      },

      deletePet: (id) => {
        set((state) => {
          const remainingPets = state.pets.filter((p) => p.id !== id);
          return {
            pets: remainingPets,
            currentPetId:
              state.currentPetId === id
                ? remainingPets[0]?.id || ''
                : state.currentPetId,
            vaccines: state.vaccines.filter((v) => v.petId !== id),
            deworms: state.deworms.filter((d) => d.petId !== id),
            examReports: state.examReports.filter((e) => e.petId !== id),
            visitRecords: state.visitRecords.filter((v) => v.petId !== id),
            calendarEvents: state.calendarEvents.filter((c) => c.petId !== id),
          };
        });
      },

      currentVaccines: () => {
        const petId = get().currentPetId;
        return get().vaccines.filter((v) => v.petId === petId);
      },

      addVaccine: (vaccine) => {
        const petId = get().currentPetId;
        const newVaccine: Vaccine = {
          ...vaccine,
          id: generateId('vaccine'),
          petId,
        };
        const newEvent: CalendarEvent = {
          id: generateId('event'),
          petId,
          date: vaccine.nextDate,
          type: 'vaccine',
          title: `${vaccine.name}接种`,
          description: `下次${vaccine.name}疫苗接种，${vaccine.hospital}`,
        };
        set((state) => ({
          vaccines: [newVaccine, ...state.vaccines],
          calendarEvents: [...state.calendarEvents, newEvent],
        }));
      },

      currentDeworms: () => {
        const petId = get().currentPetId;
        return get().deworms.filter((d) => d.petId === petId);
      },

      addDeworm: (deworm) => {
        const petId = get().currentPetId;
        const newDeworm: Deworm = {
          ...deworm,
          id: generateId('deworm'),
          petId,
        };
        const typeLabel = deworm.type === 'internal' ? '体内' : '体外';
        const newEvent: CalendarEvent = {
          id: generateId('event'),
          petId,
          date: deworm.nextDate,
          type: 'deworm',
          title: `${typeLabel}驱虫`,
          description: `下次${typeLabel}驱虫，使用${deworm.medicine}`,
        };
        set((state) => ({
          deworms: [newDeworm, ...state.deworms],
          calendarEvents: [...state.calendarEvents, newEvent],
        }));
      },

      currentExamReports: () => {
        const petId = get().currentPetId;
        return get().examReports.filter((e) => e.petId === petId);
      },

      addExamReport: (report) => {
        const petId = get().currentPetId;
        const newReport: ExamReport = {
          ...report,
          id: generateId('exam'),
          petId,
        };
        set((state) => ({
          examReports: [newReport, ...state.examReports],
        }));
      },

      currentVisitRecords: () => {
        const petId = get().currentPetId;
        return get().visitRecords.filter((v) => v.petId === petId);
      },

      addVisitRecord: (record) => {
        const petId = get().currentPetId;
        const newRecord: VisitRecord = {
          ...record,
          id: generateId('visit'),
          petId,
        };

        const newEvents: CalendarEvent[] = [];

        newEvents.push({
          id: generateId('event'),
          petId,
          date: record.date,
          type: 'visit',
          title: `就诊：${record.diagnosis.slice(0, 10)}`,
          description: `${record.hospital}，${record.doctor}医生`,
        });

        if (
          record.treatmentAdvice &&
          (record.treatmentAdvice.includes('复诊') ||
            record.treatmentAdvice.includes('复查'))
        ) {
          const visitDate = parseDateLocal(record.date);
          visitDate.setDate(visitDate.getDate() + 7);
          const recheckDateStr = `${visitDate.getFullYear()}-${String(
            visitDate.getMonth() + 1
          ).padStart(2, '0')}-${String(visitDate.getDate()).padStart(2, '0')}`;
          newEvents.push({
            id: generateId('event'),
            petId,
            date: recheckDateStr,
            type: 'recheck',
            title: '复诊检查',
            description: `${record.hospital}复诊，${record.doctor}医生`,
          });
        }

        set((state) => ({
          visitRecords: [newRecord, ...state.visitRecords],
          calendarEvents: [...state.calendarEvents, ...newEvents],
        }));
      },

      getVisitRecordById: (id) => {
        const petId = get().currentPetId;
        return get().visitRecords.find((r) => r.id === id && r.petId === petId);
      },

      currentCalendarEvents: () => {
        const petId = get().currentPetId;
        return get().calendarEvents.filter((c) => c.petId === petId);
      },

      addCalendarEvent: (event) => {
        const petId = get().currentPetId;
        const newEvent: CalendarEvent = {
          ...event,
          id: generateId('event'),
          petId,
        };
        set((state) => ({
          calendarEvents: [...state.calendarEvents, newEvent],
        }));
      },

      removeCalendarEvent: (id) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((e) => e.id !== id),
        }));
      },

      getLatestExamReport: () => {
        const reports = get().currentExamReports();
        if (reports.length === 0) return undefined;
        return [...reports].sort(
          (a, b) =>
            parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
        )[0];
      },

      getPreviousExamReport: () => {
        const reports = get().currentExamReports();
        if (reports.length < 2) return undefined;
        return [...reports].sort(
          (a, b) =>
            parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
        )[1];
      },

      searchRecords: (keyword) => {
        if (!keyword.trim()) return [];

        const lowerKeyword = keyword.toLowerCase().trim();
        const petId = get().currentPetId;
        const results: SearchResult[] = [];

        const vaccines = get().vaccines.filter((v) => v.petId === petId);
        vaccines.forEach((vaccine) => {
          const matchedFields: string[] = [];
          if (vaccine.name.toLowerCase().includes(lowerKeyword)) matchedFields.push('疫苗名称');
          if (vaccine.hospital.toLowerCase().includes(lowerKeyword)) matchedFields.push('医院');
          if (matchedFields.length > 0) {
            results.push({
              id: vaccine.id,
              type: 'vaccine',
              date: vaccine.date,
              title: vaccine.name,
              subtitle: `${vaccine.hospital}`,
              matchedFields,
            });
          }
        });

        const deworms = get().deworms.filter((d) => d.petId === petId);
        deworms.forEach((deworm) => {
          const matchedFields: string[] = [];
          const typeLabel = deworm.type === 'internal' ? '体内驱虫' : '体外驱虫';
          if (typeLabel.toLowerCase().includes(lowerKeyword)) matchedFields.push('驱虫类型');
          if (deworm.medicine.toLowerCase().includes(lowerKeyword)) matchedFields.push('药物');
          if (matchedFields.length > 0) {
            results.push({
              id: deworm.id,
              type: 'deworm',
              date: deworm.date,
              title: typeLabel,
              subtitle: `药物：${deworm.medicine}`,
              matchedFields,
            });
          }
        });

        const visits = get().visitRecords.filter((v) => v.petId === petId);
        visits.forEach((visit) => {
          const matchedFields: string[] = [];
          if (visit.chiefComplaint.toLowerCase().includes(lowerKeyword)) matchedFields.push('主诉');
          if (visit.diagnosis.toLowerCase().includes(lowerKeyword)) matchedFields.push('诊断结论');
          if (visit.hospital.toLowerCase().includes(lowerKeyword)) matchedFields.push('医院');
          if (visit.doctor.toLowerCase().includes(lowerKeyword)) matchedFields.push('医生');
          if (visit.examItems.some((item) => item.toLowerCase().includes(lowerKeyword))) matchedFields.push('检查项目');
          if (visit.medications.some((med) => med.name.toLowerCase().includes(lowerKeyword))) matchedFields.push('药物');
          if (matchedFields.length > 0) {
            results.push({
              id: visit.id,
              type: 'visit',
              date: visit.date,
              title: visit.diagnosis,
              subtitle: `${visit.hospital} · ${visit.doctor}`,
              matchedFields,
            });
          }
        });

        results.sort((a, b) => parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime());
        return results;
      },

      resetAllData: () => {
        set({
          pets: mockPets,
          currentPetId: mockPets[0].id,
          vaccines: mockVaccines,
          deworms: mockDeworms,
          examReports: mockExamReports,
          visitRecords: mockVisitRecords,
          calendarEvents: mockCalendarEvents,
        });
      },
    }),
    {
      name: 'pet-health-storage',
    }
  )
);
