export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  weight: number;
  birthday: string;
}

export interface Vaccine {
  id: string;
  petId: string;
  name: string;
  date: string;
  nextDate: string;
  hospital: string;
}

export interface Deworm {
  id: string;
  petId: string;
  type: 'internal' | 'external';
  date: string;
  nextDate: string;
  medicine: string;
}

export interface BloodTest {
  id: string;
  name: string;
  value: number;
  unit: string;
  reference: string;
  status: 'normal' | 'high' | 'low';
}

export interface BiochemTest {
  id: string;
  name: string;
  value: number;
  unit: string;
  reference: string;
  status: 'normal' | 'high' | 'low';
}

export interface ExamReport {
  id: string;
  petId: string;
  date: string;
  hospital: string;
  weight: number;
  abnormalItems: string[];
  bloodTests: BloodTest[];
  biochemTests: BiochemTest[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface VisitRecord {
  id: string;
  petId: string;
  date: string;
  hospital: string;
  doctor: string;
  chiefComplaint: string;
  examItems: string[];
  diagnosis: string;
  medications: Medication[];
  treatmentAdvice: string;
}

export interface CalendarEvent {
  id: string;
  petId: string;
  date: string;
  type: 'vaccine' | 'deworm' | 'recheck' | 'visit';
  title: string;
  description: string;
}

export type TabType = 'home' | 'compare' | 'calendar';
