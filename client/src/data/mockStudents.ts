import { type IStudent } from '../types';

// Helper to generate a date offset by a number of days
const getFutureDate = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

export const mockStudents: IStudent[] = [
  {
    _id: 'student_priya',
    name: 'Priya Venkataraman',
    exam: 'NEET',
    examDate: getFutureDate(45), // 45 days away
    city: 'Chennai',
    streak: 4,
    lastCheckIn: new Date().toISOString(),
    background: 'Class 12 student feeling immense pressure from school board pre-boards and NEET mock exams. Parents are supportive but have high expectations.'
  },
  {
    _id: 'student_arjun',
    name: 'Arjun Sharma',
    exam: 'JEE',
    examDate: getFutureDate(23), // 23 days away
    city: 'Kota',
    streak: 11,
    lastCheckIn: new Date().toISOString(),
    background: 'Enrolled in a premier coaching institute in Kota. Studying 14 hours a day. Highly competitive peer group. Struggling with mock test scores dropping lately.'
  },
  {
    _id: 'student_fatima',
    name: 'Fatima Shaikh',
    exam: 'CUET',
    examDate: getFutureDate(5), // 5 days away - warning zone!
    city: 'Mumbai',
    streak: 2,
    lastCheckIn: null,
    background: 'First-generation college aspirant. Balancing household responsibilities with exam preparation. Facing extreme sleep issues due to exam anxiety.'
  },
  {
    _id: 'student_gurpreet',
    name: 'Gurpreet Singh',
    exam: 'GATE',
    examDate: getFutureDate(82), // 82 days away
    city: 'Chandigarh',
    streak: 7,
    lastCheckIn: new Date().toISOString(),
    background: 'Working professional preparing for GATE CSE after office hours. Battling severe time management constraints and occasional physical exhaustion.'
  },
  {
    _id: 'student_meenakshi',
    name: 'Meenakshi Iyer',
    exam: 'UPSC',
    examDate: getFutureDate(120), // 120 days away
    city: 'Bengaluru',
    streak: 19,
    lastCheckIn: new Date().toISOString(),
    background: 'UPSC Prelims second attempt. Dedicated full-time aspirant. Highly disciplined but experiencing severe self-doubt and comparison with peers who cleared last year.'
  },
  {
    _id: 'student_rohan',
    name: 'Rohan Mehta',
    exam: 'CAT',
    examDate: getFutureDate(55), // 55 days away
    city: 'Delhi',
    streak: 5,
    lastCheckIn: new Date().toISOString(),
    background: 'MBA aspirant working at a startup. Balancing full-time job with CAT prep. Strong in VARC but struggling with DILR time management.'
  }
];
