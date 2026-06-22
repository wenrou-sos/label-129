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
  mockPet,
  mockVaccines,
  mockDeworms,
  mockExamReports,
  mockVisitRecords,
  mockCalendarEvents,
} from '../data/mockData';
import { parseDateLocal, formatDateCN } from '../utils/dateUtils';
import { generateId } from '../utils/id';

interface PetState {
  pet: Pet;
  vaccines: Vaccine[];
  deworms: Deworm[];
  examReports: ExamReport[];
  visitRecords: VisitRecord[];
  calendarEvents: CalendarEvent[];
  setPet: (pet: Pet) => void;
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  addDeworm: (deworm: Omit<Deworm, 'id'>) => void;
  addExamReport: (report: Omit<ExamReport, 'id'>) => void;
  addVisitRecord: (record: Omit<VisitRecord, 'id'>) => void;
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  removeCalendarEvent: (id: string) => void;
  getVisitRecordById: (id: string) => VisitRecord | undefined;
  getLatestExamReport: () => ExamReport | undefined;
  getPreviousExamReport: () => ExamReport | undefined;
  resetAllData: () => void;
}

export const usePetStore = create<PetState>()(
  persist(
    (set, get) => ({
      pet: mockPet,
      vaccines: mockVaccines,
      deworms: mockDeworms,
      examReports: mockExamReports,
      visitRecords: mockVisitRecords,
      calendarEvents: mockCalendarEvents,

      setPet: (pet) => set({ pet }),

      addVaccine: (vaccine) => {
        const newVaccine: Vaccine = {
          ...vaccine,
          id: generateId('vaccine'),
        };

        const newEvent: CalendarEvent = {
          id: generateId('event'),
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

      addDeworm: (deworm) => {
        const newDeworm: Deworm = {
          ...deworm,
          id: generateId('deworm'),
        };

        const newEvent: CalendarEvent = {
          id: generateId('event'),
          date: deworm.nextDate,
          type: 'deworm',
          title: `${deworm.type === 'internal' ? '体内' : '体外'}驱虫`,
          description: `下次${deworm.type === 'internal' ? '体内' : '体外'}驱虫，使用${deworm.medicine}`,
        };

        set((state) => ({
          deworms: [newDeworm, ...state.deworms],
          calendarEvents: [...state.calendarEvents, newEvent],
        }));
      },

      addExamReport: (report) => {
        const newReport: ExamReport = {
          ...report,
          id: generateId('exam'),
        };
        set((state) => ({
          examReports: [newReport, ...state.examReports],
        }));
      },

      addVisitRecord: (record) => {
        const newRecord: VisitRecord = {
          ...record,
          id: generateId('visit'),
        };

        const newEvents: CalendarEvent[] = [];

        newEvents.push({
          id: generateId('event'),
          date: record.date,
          type: 'visit',
          title: `就诊：${record.diagnosis.slice(0, 10)}`,
          description: `${record.hospital}，${record.doctor}医生`,
        });

        if (record.treatmentAdvice && (record.treatmentAdvice.includes('复诊') || record.treatmentAdvice.includes('复查'))) {
          const visitDate = parseDateLocal(record.date);
          visitDate.setDate(visitDate.getDate() + 7);
          const recheckDateStr = `${visitDate.getFullYear()}-${String(visitDate.getMonth() + 1).padStart(2, '0')}-${String(visitDate.getDate()).padStart(2, '0')}`;
          newEvents.push({
            id: generateId('event'),
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

      addCalendarEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: generateId('event'),
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

      getVisitRecordById: (id) => {
        return get().visitRecords.find((r) => r.id === id);
      },

      getLatestExamReport: () => {
        const reports = get().examReports;
        if (reports.length === 0) return undefined;
        return [...reports].sort(
          (a, b) => parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
        )[0];
      },

      getPreviousExamReport: () => {
        const reports = get().examReports;
        if (reports.length < 2) return undefined;
        return [...reports].sort(
          (a, b) => parseDateLocal(b.date).getTime() - parseDateLocal(a.date).getTime()
        )[1];
      },

      resetAllData: () => {
        set({
          pet: mockPet,
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
