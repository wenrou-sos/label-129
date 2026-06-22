import type {
  Pet,
  Vaccine,
  Deworm,
  ExamReport,
  VisitRecord,
  CalendarEvent,
} from '../types';

export const mockPet: Pet = {
  id: '1',
  name: '豆豆',
  breed: '金毛犬',
  age: 3,
  gender: 'male',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20golden%20retriever%20dog%20portrait%20white%20background%20professional%20pet%20photography&image_size=square',
  weight: 28.5,
  birthday: '2022-03-15',
};

export const mockVaccines: Vaccine[] = [
  {
    id: 'v1',
    name: '狂犬疫苗',
    date: '2026-05-10',
    nextDate: '2027-05-10',
    hospital: '爱宠动物医院',
  },
  {
    id: 'v2',
    name: '六联疫苗',
    date: '2026-05-10',
    nextDate: '2027-05-10',
    hospital: '爱宠动物医院',
  },
  {
    id: 'v3',
    name: '犬瘟热疫苗',
    date: '2025-05-15',
    nextDate: '2026-05-15',
    hospital: '爱宠动物医院',
  },
  {
    id: 'v4',
    name: '细小病毒疫苗',
    date: '2025-05-15',
    nextDate: '2026-05-15',
    hospital: '爱宠动物医院',
  },
];

export const mockDeworms: Deworm[] = [
  {
    id: 'd1',
    type: 'internal',
    date: '2026-06-01',
    nextDate: '2026-09-01',
    medicine: '拜宠清',
  },
  {
    id: 'd2',
    type: 'external',
    date: '2026-06-10',
    nextDate: '2026-07-10',
    medicine: '福来恩',
  },
  {
    id: 'd3',
    type: 'internal',
    date: '2026-03-01',
    nextDate: '2026-06-01',
    medicine: '拜宠清',
  },
  {
    id: 'd4',
    type: 'external',
    date: '2026-05-10',
    nextDate: '2026-06-10',
    medicine: '福来恩',
  },
  {
    id: 'd5',
    type: 'internal',
    date: '2025-12-01',
    nextDate: '2026-03-01',
    medicine: '拜宠清',
  },
];

export const mockExamReports: ExamReport[] = [
  {
    id: 'e1',
    date: '2026-06-15',
    hospital: '爱宠动物医院',
    weight: 28.5,
    abnormalItems: ['白细胞偏高', '胆固醇略高'],
    bloodTests: [
      { id: 'b1', name: '白细胞计数', value: 16.8, unit: '10^9/L', reference: '6.0-16.0', status: 'high' },
      { id: 'b2', name: '红细胞计数', value: 7.2, unit: '10^12/L', reference: '5.5-8.5', status: 'normal' },
      { id: 'b3', name: '血红蛋白', value: 156, unit: 'g/L', reference: '120-180', status: 'normal' },
      { id: 'b4', name: '血小板计数', value: 320, unit: '10^9/L', reference: '200-500', status: 'normal' },
      { id: 'b5', name: '淋巴细胞比率', value: 28, unit: '%', reference: '20-50', status: 'normal' },
    ],
    biochemTests: [
      { id: 'bc1', name: '谷丙转氨酶(ALT)', value: 45, unit: 'U/L', reference: '10-60', status: 'normal' },
      { id: 'bc2', name: '谷草转氨酶(AST)', value: 38, unit: 'U/L', reference: '10-50', status: 'normal' },
      { id: 'bc3', name: '总胆固醇', value: 7.2, unit: 'mmol/L', reference: '3.5-6.5', status: 'high' },
      { id: 'bc4', name: '血糖', value: 5.1, unit: 'mmol/L', reference: '3.9-6.1', status: 'normal' },
      { id: 'bc5', name: '尿素氮', value: 5.8, unit: 'mmol/L', reference: '2.5-9.0', status: 'normal' },
      { id: 'bc6', name: '肌酐', value: 78, unit: 'μmol/L', reference: '44-133', status: 'normal' },
    ],
  },
  {
    id: 'e2',
    date: '2025-12-10',
    hospital: '爱宠动物医院',
    weight: 27.2,
    abnormalItems: [],
    bloodTests: [
      { id: 'b1', name: '白细胞计数', value: 12.5, unit: '10^9/L', reference: '6.0-16.0', status: 'normal' },
      { id: 'b2', name: '红细胞计数', value: 7.0, unit: '10^12/L', reference: '5.5-8.5', status: 'normal' },
      { id: 'b3', name: '血红蛋白', value: 148, unit: 'g/L', reference: '120-180', status: 'normal' },
      { id: 'b4', name: '血小板计数', value: 298, unit: '10^9/L', reference: '200-500', status: 'normal' },
      { id: 'b5', name: '淋巴细胞比率', value: 32, unit: '%', reference: '20-50', status: 'normal' },
    ],
    biochemTests: [
      { id: 'bc1', name: '谷丙转氨酶(ALT)', value: 42, unit: 'U/L', reference: '10-60', status: 'normal' },
      { id: 'bc2', name: '谷草转氨酶(AST)', value: 35, unit: 'U/L', reference: '10-50', status: 'normal' },
      { id: 'bc3', name: '总胆固醇', value: 5.8, unit: 'mmol/L', reference: '3.5-6.5', status: 'normal' },
      { id: 'bc4', name: '血糖', value: 4.9, unit: 'mmol/L', reference: '3.9-6.1', status: 'normal' },
      { id: 'bc5', name: '尿素氮', value: 5.5, unit: 'mmol/L', reference: '2.5-9.0', status: 'normal' },
      { id: 'bc6', name: '肌酐', value: 75, unit: 'μmol/L', reference: '44-133', status: 'normal' },
    ],
  },
];

export const mockVisitRecords: VisitRecord[] = [
  {
    id: 'visit1',
    date: '2026-06-18',
    hospital: '爱宠动物医院',
    doctor: '李医生',
    chiefComplaint: '食欲不振，精神萎靡，持续2天',
    examItems: ['血常规检查', '生化检查', '腹部B超'],
    diagnosis: '轻微肠胃炎，可能由饮食不当引起',
    medications: [
      { id: 'm1', name: '益生菌', dosage: '1袋/次', frequency: '每日2次', duration: '7天' },
      { id: 'm2', name: '胃复安', dosage: '半片/次', frequency: '每日2次', duration: '3天' },
    ],
    treatmentAdvice: '1. 清淡饮食，避免油腻食物\n2. 保证充足饮水\n3. 注意保暖，避免着凉\n4. 如症状加重请及时复诊',
  },
  {
    id: 'visit2',
    date: '2026-05-22',
    hospital: '爱宠动物医院',
    doctor: '王医生',
    chiefComplaint: '皮肤瘙痒，频繁抓挠耳朵',
    examItems: ['皮肤刮片检查', '耳道分泌物检查'],
    diagnosis: '外耳道炎，伴有轻微皮肤过敏',
    medications: [
      { id: 'm3', name: '耳漂', dosage: '适量/次', frequency: '每日1次', duration: '10天' },
      { id: 'm4', name: '抗敏止痒药', dosage: '1片/次', frequency: '每日1次', duration: '5天' },
    ],
    treatmentAdvice: '1. 保持耳道清洁干燥\n2. 洗澡时避免水进入耳朵\n3. 定期驱虫\n4. 7天后复诊复查',
  },
  {
    id: 'visit3',
    date: '2026-01-10',
    hospital: '爱宠动物医院',
    doctor: '李医生',
    chiefComplaint: '年度例行体检',
    examItems: ['血常规', '生化全套', '心电图', 'X光检查'],
    diagnosis: '身体健康，各项指标正常',
    medications: [],
    treatmentAdvice: '1. 保持规律饮食和运动\n2. 定期进行体检\n3. 按时接种疫苗和驱虫',
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'cal1',
    date: '2026-06-22',
    type: 'visit',
    title: '就诊：轻微肠胃炎',
    description: '爱宠动物医院，李医生',
  },
  {
    id: 'cal2',
    date: '2026-07-10',
    type: 'deworm',
    title: '体外驱虫',
    description: '福来恩体外驱虫',
  },
  {
    id: 'cal3',
    date: '2026-07-10',
    type: 'recheck',
    title: '耳道炎复查',
    description: '皮肤过敏情况复查，王医生',
  },
  {
    id: 'cal4',
    date: '2026-08-15',
    type: 'recheck',
    title: '肠胃炎复诊',
    description: '李医生复诊，确认恢复情况',
  },
  {
    id: 'cal5',
    date: '2026-09-01',
    type: 'deworm',
    title: '体内驱虫',
    description: '拜宠清体内驱虫',
  },
  {
    id: 'cal6',
    date: '2026-05-10',
    type: 'vaccine',
    title: '年度疫苗接种',
    description: '狂犬疫苗+六联疫苗',
  },
  {
    id: 'cal7',
    date: '2026-05-22',
    type: 'visit',
    title: '就诊：外耳道炎',
    description: '爱宠动物医院，王医生',
  },
  {
    id: 'cal8',
    date: '2026-01-10',
    type: 'visit',
    title: '就诊：年度体检',
    description: '爱宠动物医院，李医生',
  },
];
