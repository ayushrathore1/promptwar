import { type IMoodEntry } from '../types';

// Helper to get past dates
const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockMoodHistory: IMoodEntry[] = [
  // ==========================================
  // Student 1: Priya Venkataraman (NEET)
  // Burnout flag: Last 3 days: Overwhelmed, Syllabus pressure
  // ==========================================
  {
    studentId: 'student_priya',
    moodScore: 1,
    moodLabel: 'Overwhelmed',
    trigger: 'Syllabus pressure',
    note: 'Organic chemistry reactions are just too much. Revision schedule is completely messed up. Too much ho gaya today.',
    createdAt: getPastDate(0)
  },
  {
    studentId: 'student_priya',
    moodScore: 1,
    moodLabel: 'Overwhelmed',
    trigger: 'Syllabus pressure',
    note: 'Tried to cover plant physiology but couldn\'t finish even half of it. Feeling extremely behind. Board exam prep is also colliding.',
    createdAt: getPastDate(1)
  },
  {
    studentId: 'student_priya',
    moodScore: 1,
    moodLabel: 'Overwhelmed',
    trigger: 'Syllabus pressure',
    note: 'Back-to-back pre-boards. Can\'t find time for NEET Mock papers. Feeling super stuck. Kya karein...',
    createdAt: getPastDate(2)
  },
  {
    studentId: 'student_priya',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Family expectations',
    note: 'Uncle asked about my mock scores today. Everyone expects me to clear it in first attempt itself.',
    createdAt: getPastDate(3)
  },
  {
    studentId: 'student_priya',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Managed to study for 8 hours today. Physics numericals are slowly making sense.',
    createdAt: getPastDate(4)
  },
  {
    studentId: 'student_priya',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Sleep issues',
    note: 'Slept for a full 7 hours. Felt energetic during revision.',
    createdAt: getPastDate(5)
  },
  {
    studentId: 'student_priya',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Physical health',
    note: 'Slight headache, but managed to do biology diagrams. Revision is progressing slowly.',
    createdAt: getPastDate(6)
  },
  {
    studentId: 'student_priya',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Mock test scores',
    note: 'Scored 580 in NEET weekly test. Need at least 640. Feeling stressed about the gap.',
    createdAt: getPastDate(7)
  },
  {
    studentId: 'student_priya',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Syllabus pressure',
    note: 'Normal day. Finished ecology chapters. Nothing too exciting.',
    createdAt: getPastDate(8)
  },
  {
    studentId: 'student_priya',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Comparison with peers',
    note: 'Discussed mock strategy with Sneha. Realized we are on the same page. Feeling reassured.',
    createdAt: getPastDate(9)
  },
  {
    studentId: 'student_priya',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Time management',
    note: 'Studied with Pomodoro technique today. Work feels more structured.',
    createdAt: getPastDate(10)
  },
  {
    studentId: 'student_priya',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Mock test scores',
    note: 'Mock scores are stable, but need to improve physics accuracy.',
    createdAt: getPastDate(11)
  },
  {
    studentId: 'student_priya',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Syllabus pressure',
    note: 'Looked at the remaining inorganic chapters... huge list. Tension is building up.',
    createdAt: getPastDate(12)
  },
  {
    studentId: 'student_priya',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Sleep issues',
    note: 'Tired but peaceful. Prepared a solid weekly plan.',
    createdAt: getPastDate(13)
  },

  // ==========================================
  // Student 2: Arjun Sharma (JEE, Kota)
  // Dynamic mix: Mock scores and peer comparison pressure
  // ==========================================
  {
    studentId: 'student_arjun',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Mock test scores',
    note: 'Scored 140 in JEE Adv mock. Rank list is out, down by 200 ranks. Dil dukh raha hai.',
    createdAt: getPastDate(0)
  },
  {
    studentId: 'student_arjun',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Comparison with peers',
    note: 'Classmate cleared all doubt counters in 5 mins. I got stuck on coordinate geometry. Trying to ignore.',
    createdAt: getPastDate(1)
  },
  {
    studentId: 'student_arjun',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Syllabus pressure',
    note: 'Mock test syllabus has 3 new topics in Physics. How to cover in 2 days? Kota heat is not helping.',
    createdAt: getPastDate(2)
  },
  {
    studentId: 'student_arjun',
    moodScore: 1,
    moodLabel: 'Overwhelmed',
    trigger: 'Sleep issues',
    note: 'Lying awake till 3 AM thinking about negative marking. Head is spinning.',
    createdAt: getPastDate(3)
  },
  {
    studentId: 'student_arjun',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Spent the whole afternoon at the library. Quiet environments help me focus.',
    createdAt: getPastDate(4)
  },
  {
    studentId: 'student_arjun',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Comparison with peers',
    note: 'Helped a friend resolve a complex calculus integration. Boosted my own confidence.',
    createdAt: getPastDate(5)
  },
  {
    studentId: 'student_arjun',
    moodScore: 5,
    moodLabel: 'Calm',
    trigger: 'Sleep issues',
    note: 'slept early. Felt like my old self today. Took a brief evening walk.',
    createdAt: getPastDate(6)
  },
  {
    studentId: 'student_arjun',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Mock test scores',
    note: 'Decent scores today. Chem numericals went very smoothly.',
    createdAt: getPastDate(7)
  },
  {
    studentId: 'student_arjun',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Syllabus pressure',
    note: 'Solving Irodov problems. Hard but rewarding.',
    createdAt: getPastDate(8)
  },
  {
    studentId: 'student_arjun',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Family expectations',
    note: 'Dad called. He asked if I need any more study materials. The silent expectation is heavy.',
    createdAt: getPastDate(9)
  },
  {
    studentId: 'student_arjun',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Comparison with peers',
    note: 'Top batch students seem to have completed the syllabus twice. Felt tiny.',
    createdAt: getPastDate(10)
  },
  {
    studentId: 'student_arjun',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Mock test scores',
    note: 'Average scores. Not good, not bad. Need to fix coordination chemistry.',
    createdAt: getPastDate(11)
  },
  {
    studentId: 'student_arjun',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Skipped lunch by mistake. Need to set eating reminders.',
    createdAt: getPastDate(12)
  },
  {
    studentId: 'student_arjun',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Sleep issues',
    note: 'Had cold milk before bed. Slept peacefully.',
    createdAt: getPastDate(13)
  },

  // ==========================================
  // Student 3: Fatima Shaikh (CUET)
  // Short history / new check-ins: Sleep issues and family pressure
  // ==========================================
  {
    studentId: 'student_fatima',
    moodScore: 1,
    moodLabel: 'Overwhelmed',
    trigger: 'Sleep issues',
    note: 'Hardly slept for 2 hours. The CUET english sections are confusing. Parents keep asking if I will clear it.',
    createdAt: getPastDate(0)
  },
  {
    studentId: 'student_fatima',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Result anxiety',
    note: 'CUET is just 5 days away. My heart is beating so fast even while reading normal questions. Boards are done but tension is double.',
    createdAt: getPastDate(1)
  },
  {
    studentId: 'student_fatima',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Family expectations',
    note: 'Ammi told me not to worry about results, but I know how much college fees mean to us. I must get a government seat.',
    createdAt: getPastDate(2)
  },
  {
    studentId: 'student_fatima',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Sleep issues',
    note: 'Felt better after talk with elder sister. She said focus on today, rest is secondary.',
    createdAt: getPastDate(3)
  },
  {
    studentId: 'student_fatima',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Did 3 mocks of English section. Scored well. Feeling slightly hopeful.',
    createdAt: getPastDate(4)
  },
  {
    studentId: 'student_fatima',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Physical health',
    note: 'Stomach ache today. Probably because of skipped breakfast. Need to eat properly.',
    createdAt: getPastDate(5)
  },
  {
    studentId: 'student_fatima',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Syllabus pressure',
    note: 'General test syllabus is vast. Quant section is tough for me.',
    createdAt: getPastDate(6)
  },
  {
    studentId: 'student_fatima',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Result anxiety',
    note: 'Thinking about college life keeps me going. Need to stay focused.',
    createdAt: getPastDate(7)
  },
  {
    studentId: 'student_fatima',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Time management',
    note: 'Created short notes for GK. It feels manageable now.',
    createdAt: getPastDate(8)
  },
  {
    studentId: 'student_fatima',
    moodScore: 5,
    moodLabel: 'Calm',
    trigger: 'Sleep issues',
    note: 'Walked in the park for 20 mins. Highly relaxing.',
    createdAt: getPastDate(9)
  },
  {
    studentId: 'student_fatima',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Family expectations',
    note: 'Made tea for everyone. Took a break from studies. Felt normal.',
    createdAt: getPastDate(10)
  },
  {
    studentId: 'student_fatima',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Syllabus pressure',
    note: 'Just revision. No new topics now.',
    createdAt: getPastDate(11)
  },
  {
    studentId: 'student_fatima',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Result anxiety',
    note: 'Looking at cut-offs online. 99 percentile seems impossible.',
    createdAt: getPastDate(12)
  },
  {
    studentId: 'student_fatima',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Sleep issues',
    note: 'Mild anxiety. Practiced breathing before bed.',
    createdAt: getPastDate(13)
  },

  // ==========================================
  // Student 4: Gurpreet Singh (GATE)
  // Working student: Time management and exhaustion
  // ==========================================
  {
    studentId: 'student_gurpreet',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Difficult day at work. Only managed to study 2 hours of Algorithms. Still, progress is progress.',
    createdAt: getPastDate(0)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Syllabus pressure',
    note: 'Discrete Mathematics concepts are slipping away. Need to revise graph theory. Time is flying.',
    createdAt: getPastDate(1)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 1,
    moodLabel: 'Overwhelmed',
    trigger: 'Physical health',
    note: 'Back pain due to continuous sitting at office + study desk. Felt completely drained out.',
    createdAt: getPastDate(2)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Woke up at 5 AM. Finished operating systems notes before office. Felt very productive.',
    createdAt: getPastDate(3)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Mock test scores',
    note: 'Gave a topic-wise mock test. Got 18/20. Boosted my mood significantly.',
    createdAt: getPastDate(4)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Physical health',
    note: 'Did some light stretching. Back pain is better. Prepared tea.',
    createdAt: getPastDate(5)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Sleep issues',
    note: 'Slept well. Working-study balance is hard but possible.',
    createdAt: getPastDate(6)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Time management',
    note: 'Meeting ran late at work. Couldn\'t complete my revision target. Frustrating.',
    createdAt: getPastDate(7)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Syllabus pressure',
    note: 'Weekend study marathon was success. Finished Compiler Design basics.',
    createdAt: getPastDate(8)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 5,
    moodLabel: 'Calm',
    trigger: 'Sleep issues',
    note: 'Took Sunday completely off. Watched a movie. Mental recharge done.',
    createdAt: getPastDate(9)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Mock test scores',
    note: 'Solved previous year GATE questions. Feeling confident.',
    createdAt: getPastDate(10)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Time management',
    note: 'Tired but kept pushing. Made good progress in databases.',
    createdAt: getPastDate(11)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Result anxiety',
    note: 'Thinking about whether I can secure PSU jobs with GATE. Stressed about cut-off.',
    createdAt: getPastDate(12)
  },
  {
    studentId: 'student_gurpreet',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Sleep issues',
    note: 'Average day. Tired from screen time.',
    createdAt: getPastDate(13)
  },

  // ==========================================
  // Student 5: Meenakshi Iyer (UPSC)
  // Longest streak: Self-doubt and peer comparison
  // ==========================================
  {
    studentId: 'student_meenakshi',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Time management',
    note: 'Wrote 2 mains answers. Hand coordination is getting better. Feeling disciplined.',
    createdAt: getPastDate(0)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Comparison with peers',
    note: 'Read a blog post by last year\'s topper. Felt some self-doubt but redirecting to my books.',
    createdAt: getPastDate(1)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Result anxiety',
    note: 'Remembering prelims day of last year... the panic in exam hall. Need to make sure history doesn\'t repeat.',
    createdAt: getPastDate(2)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 5,
    moodLabel: 'Calm',
    trigger: 'Sleep issues',
    note: 'Meditated for 15 mins. Focus is solid. Polity notes are fully updated.',
    createdAt: getPastDate(3)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Syllabus pressure',
    note: 'Finished Economy section revision. Understanding complex concepts easily now.',
    createdAt: getPastDate(4)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Comparison with peers',
    note: 'Peer group was discussing current affairs test. Some knew facts I missed. Writing them down.',
    createdAt: getPastDate(5)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Time management',
    note: '10 hours of focused study. Feels like momentum is building up.',
    createdAt: getPastDate(6)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Mock test scores',
    note: 'Prelims Mock 5 was good. CSAT paper cleared comfortably.',
    createdAt: getPastDate(7)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Syllabus pressure',
    note: 'Art & Culture section is boring but completed my targets.',
    createdAt: getPastDate(8)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 2,
    moodLabel: 'Anxious',
    trigger: 'Family expectations',
    note: 'Mom asked if I have backup plans. It stings, but she means well.',
    createdAt: getPastDate(9)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 3,
    moodLabel: 'Okay',
    trigger: 'Sleep issues',
    note: 'Sleep is erratic. Waking up in middle of night. Will try herbal tea.',
    createdAt: getPastDate(10)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Time management',
    note: 'Regular study schedule. No breaks in flow.',
    createdAt: getPastDate(11)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 5,
    moodLabel: 'Calm',
    trigger: 'Sleep issues',
    note: 'Walked around the block. Mind is relaxed.',
    createdAt: getPastDate(12)
  },
  {
    studentId: 'student_meenakshi',
    moodScore: 4,
    moodLabel: 'Good',
    trigger: 'Syllabus pressure',
    note: 'Environment & Ecology chapters are finished.',
    createdAt: getPastDate(13)
  }
];
