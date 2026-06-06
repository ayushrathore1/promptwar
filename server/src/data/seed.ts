import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { Student } from '../models/Student';
import { MoodEntry } from '../models/MoodEntry';
import { MicroAction } from '../models/MicroAction';
import { User } from '../models/User';
import { MoodScore, MoodLabel, TriggerType } from '../types';

dotenv.config();

// ─── Helper: Date relative to today ─────────────────────────────
function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
  return d;
}

// ─── Student Profiles ────────────────────────────────────────────
const students = [
  {
    name: 'Priya Venkataraman',
    exam: 'NEET' as const,
    examDate: daysFromNow(45),
    city: 'Chennai',
    streak: 4,
    lastCheckIn: daysAgo(0),
    background: 'Class 12, preparing at home with coaching materials',
  },
  {
    name: 'Arjun Sharma',
    exam: 'JEE' as const,
    examDate: daysFromNow(23),
    city: 'Kota',
    streak: 11,
    lastCheckIn: daysAgo(0),
    background: 'Coaching centre student, 2nd attempt, away from family',
  },
  {
    name: 'Fatima Shaikh',
    exam: 'CUET' as const,
    examDate: daysFromNow(67),
    city: 'Mumbai',
    streak: 2,
    lastCheckIn: daysAgo(1),
    background: 'First-generation college student, studying from public library',
  },
  {
    name: 'Gurpreet Singh',
    exam: 'GATE' as const,
    examDate: daysFromNow(90),
    city: 'Chandigarh',
    streak: 7,
    lastCheckIn: daysAgo(0),
    background: 'Working part-time while preparing, engineering graduate',
  },
  {
    name: 'Meenakshi Iyer',
    exam: 'UPSC' as const,
    examDate: daysFromNow(34),
    city: 'Bengaluru',
    streak: 19,
    lastCheckIn: daysAgo(0),
    background: '2nd attempt, full-time preparation at coaching academy',
  },
  {
    name: 'Rohan Mehta',
    exam: 'CAT' as const,
    examDate: daysFromNow(55),
    city: 'Delhi',
    streak: 5,
    lastCheckIn: daysAgo(0),
    background: 'MBA aspirant, working at a startup while preparing for CAT',
  },
];

// ─── Mood History (14 days × 5 students) ─────────────────────────
type MoodDay = { moodScore: MoodScore; moodLabel: MoodLabel; trigger: TriggerType; note?: string };

const moodPatterns: Record<string, MoodDay[]> = {
  'Priya Venkataraman': [
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure', note: 'Managed to cover organic chem today' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Mock test scores', note: 'Mock was tough yaar' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Family expectations', note: 'Amma asked about mock score again' },
    { moodScore: 1, moodLabel: 'Overwhelmed', trigger: 'Syllabus pressure', note: 'Too much ho gaya today' },
    { moodScore: 1, moodLabel: 'Overwhelmed', trigger: 'Syllabus pressure', note: 'Physics backlog increasing' },
    { moodScore: 1, moodLabel: 'Overwhelmed', trigger: 'Syllabus pressure', note: 'Cant focus on anything' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Result anxiety' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management', note: 'Made a new timetable' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'Biology section went well!' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Sleep issues', note: 'Slept late again' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Comparison with peers', note: 'Riya scored 620 in mock' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Physical health' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'Finished daily target!' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure' },
  ],
  'Arjun Sharma': [
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'Covered calculus revision' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'Best mock score so far' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Sleep issues', note: 'Hostel was noisy last night' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Family expectations', note: 'Papa called, kept it short' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Comparison with peers', note: 'Roommate got AIR 500 in mock' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Result anxiety', note: 'What if Kota was for nothing' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure', note: 'Mechanics feels solid now' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Physical health', note: 'Went for a walk, felt good' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Mock test scores' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Syllabus pressure', note: 'Chemistry done for the day' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Sleep issues' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'On track with revision plan' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Physical health', note: 'Morning jog + good breakfast' },
  ],
  'Fatima Shaikh': [
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Family expectations', note: 'Ammi doesnt understand exam pressure' },
    { moodScore: 1, moodLabel: 'Overwhelmed', trigger: 'Syllabus pressure', note: 'Library was closed today, studied at home with noise' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Time management', note: 'House chores taking too much time' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Mock test scores', note: 'English section went okay' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Comparison with peers', note: 'Everyone has coaching, I dont' },
    { moodScore: 1, moodLabel: 'Overwhelmed', trigger: 'Family expectations', note: 'Relatives asking why not just get married' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'Found a quiet corner in library' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Physical health', note: 'Headache from reading all day' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Result anxiety', note: 'First gen pressure is real' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'GK section practice paying off' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Family expectations' },
  ],
  'Gurpreet Singh': [
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management', note: 'Office work drained me' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure', note: 'DSA revision going slow' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'GATE mock — got 52 marks' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Time management', note: 'Boss gave extra work this week' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Sleep issues', note: 'Studied till 2am, woke at 7' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Physical health', note: 'Gym session helped clear my head' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Comparison with peers', note: 'College friends already placed at FAANG' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Physical health', note: 'Weekend off, finally rested' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'Aptitude section strong' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure', note: 'OS concepts clicking now' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management', note: 'Need to balance better' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Syllabus pressure', note: 'Completed DBMS revision' },
  ],
  'Meenakshi Iyer': [
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'Current affairs done for the week' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Syllabus pressure', note: 'Polity revision feels thorough' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'Prelims mock — 98/200, improving' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Result anxiety', note: 'Last year haunts me sometimes' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Family expectations', note: 'Parents supportive but I feel the weight' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Physical health', note: 'Morning yoga + meditation routine' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Syllabus pressure', note: 'Geography maps going well' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Comparison with peers', note: 'Batch topper cleared last year' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'Answer writing practice on track' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Physical health', note: 'Good sleep, feeling fresh' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Syllabus pressure', note: 'Ethics case studies done' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Time management', note: 'Feeling prepared and grounded' },
  ],
  'Rohan Mehta': [
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management', note: 'Office work + CAT prep is a juggling act' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'VARC section improving steadily' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Comparison with peers', note: 'College friends already have MBA admits' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure', note: 'DILR sets taking too long' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Time management', note: 'Client deadline clashed with mock test' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'Quant percentile crossed 90!' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Sleep issues', note: 'Late night prep, groggy morning at office' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Family expectations', note: 'Dad keeps asking about IIM chances' },
    { moodScore: 5, moodLabel: 'Calm', trigger: 'Physical health', note: 'Weekend run + proper meal' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Time management', note: 'New schedule working well' },
    { moodScore: 2, moodLabel: 'Anxious', trigger: 'Result anxiety', note: 'What if I dont crack 99 percentile' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Syllabus pressure', note: 'Reading comprehension practice' },
    { moodScore: 4, moodLabel: 'Good', trigger: 'Mock test scores', note: 'Best overall mock score yet' },
    { moodScore: 3, moodLabel: 'Okay', trigger: 'Time management' },
  ],
};

// ─── 48 Micro-Actions (6 per trigger × 8 triggers) ──────────────
const microActions: { trigger: TriggerType; title: string; instruction: string }[] = [
  // Syllabus pressure (6)
  { trigger: 'Syllabus pressure', title: 'One-Topic Anchor', instruction: 'Pick one single topic that feels most manageable right now. Write its name on a sticky note. Place it where you can see it. That\'s your only focus for the next study block.' },
  { trigger: 'Syllabus pressure', title: 'Chapter Countdown', instruction: 'Count how many chapters you\'ve already covered — not what\'s left. Write that number down. You\'ve come further than it feels.' },
  { trigger: 'Syllabus pressure', title: 'Page-Turn Reset', instruction: 'Open your weakest subject\'s textbook to a random page. Read just one paragraph slowly. Understanding even one concept today is progress.' },
  { trigger: 'Syllabus pressure', title: 'Brain Unload', instruction: 'Grab a blank paper. Write every topic stressing you out in 30 seconds — messy handwriting, no filter. Getting it out of your head makes it feel smaller.' },
  { trigger: 'Syllabus pressure', title: 'Revision Highlight', instruction: 'Open your notes from yesterday. Highlight one formula or fact you remember without looking. That\'s proof your brain is working.' },
  { trigger: 'Syllabus pressure', title: 'Small Win Stack', instruction: 'Write down 3 topics you understood this week — even partially. Stack those wins. Momentum matters more than perfection.' },

  // Mock test scores (6)
  { trigger: 'Mock test scores', title: 'Error Treasure Hunt', instruction: 'Look at your last mock. Find one question you got wrong because of a silly mistake — not a concept gap. That\'s the easiest mark to recover.' },
  { trigger: 'Mock test scores', title: 'Section Spotlight', instruction: 'Identify your strongest section from the last mock. Spend 30 seconds appreciating that strength. Build from where you\'re solid.' },
  { trigger: 'Mock test scores', title: 'Score Story Rewrite', instruction: 'Write your mock score. Below it, write: "This is a checkpoint, not a verdict." Read it aloud once. Scores are data, not destiny.' },
  { trigger: 'Mock test scores', title: 'Concept Rescue', instruction: 'Pick the one topic where you lost the most marks. Write down one resource (video, notes) to revisit it tomorrow. Action beats anxiety.' },
  { trigger: 'Mock test scores', title: 'Growth Graph', instruction: 'If you\'ve taken 3+ mocks, write down each score. Look for the upward trend — even a 2-mark improvement matters over time.' },
  { trigger: 'Mock test scores', title: 'Mock Detach', instruction: 'Close your mock result tab. Take 3 breaths. Remind yourself: the actual exam hasn\'t happened yet. You still get to prepare.' },

  // Family expectations (6)
  { trigger: 'Family expectations', title: 'Boundary Breath', instruction: 'Close your eyes. Breathe in for 4 counts, hold for 4, out for 6. As you exhale, silently say: "Their love is not conditional on my rank."' },
  { trigger: 'Family expectations', title: 'Parent Perspective', instruction: 'Think of one thing your parents do that actually supports your preparation — chai, quiet space, financial sacrifice. Hold that thought for 10 seconds.' },
  { trigger: 'Family expectations', title: 'Pressure Release', instruction: 'Write one sentence about what YOU want from this exam — not what your family expects. Your reason matters. Keep it visible.' },
  { trigger: 'Family expectations', title: 'Conversation Script', instruction: 'Prepare one calm sentence to say next time family pressure comes: "I\'m working hard and I need your patience right now." Practice saying it once.' },
  { trigger: 'Family expectations', title: 'Love Filter', instruction: 'Remind yourself: most family pressure comes from love mixed with fear. They\'re scared too. Take a breath and let that understanding soften the weight.' },
  { trigger: 'Family expectations', title: 'Shared Moment', instruction: 'Text or tell one family member something non-exam related — a joke, a thank you, a "how are you." Connection reduces pressure.' },

  // Comparison with peers (6)
  { trigger: 'Comparison with peers', title: 'My-Lane Focus', instruction: 'Put your phone face-down. Take 3 slow breaths. Remind yourself: their journey has different variables — different strengths, resources, and struggles.' },
  { trigger: 'Comparison with peers', title: 'Progress Mirror', instruction: 'Think back to where you were 3 months ago. What do you understand now that you didn\'t then? That growth is yours alone.' },
  { trigger: 'Comparison with peers', title: 'Social Media Pause', instruction: 'Mute one study group or social media feed that triggers comparison. Just for 24 hours. Notice how your mental space changes.' },
  { trigger: 'Comparison with peers', title: 'Unique Strength', instruction: 'Name one subject or topic where YOU are strong — where friends come to you for help. That\'s your superpower. Own it for 30 seconds.' },
  { trigger: 'Comparison with peers', title: 'Reality Check', instruction: 'Remember: you see their highlight reel, not their 2am breakdowns. Write "My pace is valid" on a sticky note. Stick it on your desk.' },
  { trigger: 'Comparison with peers', title: 'Celebration List', instruction: 'Write down 3 small wins from this week that have nothing to do with anyone else\'s performance. Your growth deserves acknowledgement.' },

  // Sleep issues (6)
  { trigger: 'Sleep issues', title: '4-7-8 Breathing', instruction: 'Lie down or sit comfortably. Breathe in for 4 counts, hold for 7, exhale slowly for 8. Repeat 3 times. This activates your rest-and-digest system.' },
  { trigger: 'Sleep issues', title: 'Screen Sunset', instruction: 'Set your phone brightness to minimum right now. Turn on night mode. Your melatonin production will thank you in 30 minutes.' },
  { trigger: 'Sleep issues', title: 'Body Scan', instruction: 'Lie flat. Starting from your toes, tense each muscle group for 5 seconds, then release. Move up to calves, thighs, stomach, hands, shoulders, face.' },
  { trigger: 'Sleep issues', title: 'Tomorrow\'s Permission', instruction: 'Write tomorrow\'s first study task on a paper and place it on your desk. Now your brain has permission to stop planning and rest.' },
  { trigger: 'Sleep issues', title: 'Warm Water Ritual', instruction: 'Drink a small cup of warm water (not tea, not coffee). The warmth signals your body to wind down. Sip slowly.' },
  { trigger: 'Sleep issues', title: 'Gratitude Lullaby', instruction: 'Name 3 things that went okay today — even tiny ones. Let your brain end the day on a neutral-to-positive note instead of anxiety.' },

  // Physical health (6)
  { trigger: 'Physical health', title: 'Desk Stretch', instruction: 'Stand up. Reach both arms overhead, interlace fingers, stretch left for 10 seconds, then right. Roll your shoulders back 5 times. Sit back down refreshed.' },
  { trigger: 'Physical health', title: 'Hydration Check', instruction: 'Drink a full glass of water right now. Dehydration causes headaches and brain fog — two things you can\'t afford. Set a 2-hour reminder.' },
  { trigger: 'Physical health', title: 'Eye Rest Rule', instruction: 'Look away from your screen. Focus on something 20 feet away for 20 seconds. Blink 10 times slowly. Your eyes are working hard for you.' },
  { trigger: 'Physical health', title: 'Posture Reset', instruction: 'Sit up straight. Pull your shoulders back and down. Tuck your chin slightly. Take 3 deep breaths in this position. Better posture = better focus.' },
  { trigger: 'Physical health', title: 'Quick Walk', instruction: 'Walk to the nearest window or door. Stand there for 30 seconds. Feel the air. Movement and fresh air reset your nervous system.' },
  { trigger: 'Physical health', title: 'Snack Awareness', instruction: 'Are you hungry right now? If yes, choose something with protein (nuts, curd, egg). Your brain runs on fuel, not willpower alone.' },

  // Time management (6)
  { trigger: 'Time management', title: 'Two-Minute Start', instruction: 'Pick the smallest task on your to-do list. Set a 2-minute timer. Do just that. Starting is the hardest part, and you just beat it.' },
  { trigger: 'Time management', title: 'Priority Triangle', instruction: 'Write 3 things you need to do today. Circle the ONE that matters most if you could only do one thing. Start with that.' },
  { trigger: 'Time management', title: 'Time Block One', instruction: 'Block the next 45 minutes for ONE subject only. No phone, no switching. When the timer rings, you\'re done with guilt-free focus.' },
  { trigger: 'Time management', title: 'Done List', instruction: 'Instead of a to-do list, write a "done" list of everything you\'ve already accomplished today — including waking up and showing up. You\'re not behind.' },
  { trigger: 'Time management', title: 'Evening Review', instruction: 'Spend 30 seconds writing what you\'ll study first thing tomorrow morning. Deciding tonight saves decision fatigue tomorrow.' },
  { trigger: 'Time management', title: 'Break Permission', instruction: 'Set a timer for 10 minutes. During this time, do something non-study: listen to a song, doodle, look outside. Breaks are part of the plan.' },

  // Result anxiety (6)
  { trigger: 'Result anxiety', title: 'Ground Yourself', instruction: 'Touch the surface you\'re sitting on. Feel its temperature and texture. Name 3 things you can see right now. The result is in the future — you are here.' },
  { trigger: 'Result anxiety', title: 'Outcome Detach', instruction: 'Close your eyes. Whisper: "I have done my work. The result is one chapter, not my whole story." Take 3 deep breaths and let the tension in your shoulders drop.' },
  { trigger: 'Result anxiety', title: 'Future Letter', instruction: 'Write one sentence to your future self after results day: "Whatever happens, I showed up and I tried." Fold it and keep it somewhere safe.' },
  { trigger: 'Result anxiety', title: 'Control Circle', instruction: 'Draw a circle. Inside it, write what you CAN control (preparation, rest, attitude). Outside, write what you can\'t (questions, cutoff, luck). Focus inside the circle.' },
  { trigger: 'Result anxiety', title: 'Worst Case Reframe', instruction: 'If the worst happens — you don\'t clear this attempt — what would you actually do? Write one backup option. Having a Plan B reduces the terror of Plan A.' },
  { trigger: 'Result anxiety', title: 'Effort Acknowledgement', instruction: 'Place your hand on your chest. Say: "I have put in real effort. That effort has value regardless of the result." Feel your heartbeat. You\'re alive and trying.' },
];

// ─── Seed Function ───────────────────────────────────────────────
async function seed(): Promise<void> {
  await connectDB();

  console.log('🌱 Clearing existing data...');
  await Student.deleteMany({});
  await MoodEntry.deleteMany({});
  await MicroAction.deleteMany({});
  await User.deleteMany({});

  console.log('👤 Seeding students...');
  const createdStudents = await Student.insertMany(students);
  console.log(`   Created ${createdStudents.length} student profiles`);

  console.log('📊 Seeding mood history...');
  let moodCount = 0;
  for (const student of createdStudents) {
    const pattern = moodPatterns[student.name];
    if (!pattern) continue;

    const entries = pattern.map((day, index) => ({
      studentId: student._id,
      moodScore: day.moodScore,
      moodLabel: day.moodLabel,
      trigger: day.trigger,
      note: day.note || '',
      createdAt: daysAgo(13 - index), // Day 0 = 13 days ago, Day 13 = today
    }));

    await MoodEntry.insertMany(entries);
    moodCount += entries.length;
  }
  console.log(`   Created ${moodCount} mood entries`);

  console.log('🧰 Seeding micro-actions...');
  const createdActions = await MicroAction.insertMany(
    microActions.map((a) => ({ ...a, durationSeconds: 30 }))
  );
  console.log(`   Created ${createdActions.length} micro-actions`);

  // ─── Create demo user accounts ────────────────────────────────
  console.log('🔑 Seeding demo user accounts...');
  const demoUsers = createdStudents.map((student) => ({
    email: `${student.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}@mindspace.app`,
    password: 'mindspace123',
    studentId: student._id,
  }));

  // Hash passwords manually for insertMany (pre-save hook doesn't run)
  const bcrypt = await import('bcryptjs');
  const hashedUsers = await Promise.all(
    demoUsers.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );
  const createdUsers = await User.insertMany(hashedUsers);
  console.log(`   Created ${createdUsers.length} demo user accounts`);

  console.log('\n✅ Seed complete!');
  console.log(`   ${createdStudents.length} students`);
  console.log(`   ${moodCount} mood entries`);
  console.log(`   ${createdActions.length} micro-actions`);
  console.log(`   ${createdUsers.length} user accounts`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
