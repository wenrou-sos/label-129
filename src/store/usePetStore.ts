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
        return get().visitRecords.find((r) => r.id === id);
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
