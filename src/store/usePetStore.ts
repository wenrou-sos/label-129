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

interface PetState {
  pet: Pet;
  vaccines: Vaccine[];
  deworms: Deworm[];
  examReports: ExamReport[];
  visitRecords: VisitRecord[];
  calendarEvents: CalendarEvent[];
  setPet: (pet: Pet) => void;
  addVaccine: (vaccine: Vaccine) => void;
  addDeworm: (deworm: Deworm) => void;
  addExamReport: (report: ExamReport) => void;
  addVisitRecord: (record: VisitRecord) => void;
  getVisitRecordById: (id: string) => VisitRecord | undefined;
  getLatestExamReport: () => ExamReport | undefined;
  getPreviousExamReport: () => ExamReport | undefined;
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

      addVaccine: (vaccine) =>
        set((state) => ({
          vaccines: [vaccine, ...state.vaccines],
        })),

      addDeworm: (deworm) =>
        set((state) => ({
          deworms: [deworm, ...state.deworms],
        })),

      addExamReport: (report) =>
        set((state) => ({
          examReports: [report, ...state.examReports],
        })),

      addVisitRecord: (record) =>
        set((state) => ({
          visitRecords: [record, ...state.visitRecords],
        })),

      getVisitRecordById: (id) => {
        return get().visitRecords.find((r) => r.id === id);
      },

      getLatestExamReport: () => {
        const reports = get().examReports;
        if (reports.length === 0) return undefined;
        return [...reports].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
      },

      getPreviousExamReport: () => {
        const reports = get().examReports;
        if (reports.length < 2) return undefined;
        return [...reports].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[1];
      },
    }),
    {
      name: 'pet-health-storage',
    }
  )
);
