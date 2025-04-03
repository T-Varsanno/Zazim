import { Dumbbell, BookOpen, Users, Navigation, Clock, Brain, Heart, HandHeart } from 'lucide-react-native';

export const activities = [
  {
    id: 1,
    title: 'מתיחות בוקר',
    description: 'מתיחות קלות לגב ולכתפיים',
    icon: Dumbbell,
    category: 'physical',
    completed: false,
    duration: 15,
    points: 20,
  },
  {
    id: 2,
    title: 'זמן קריאה',
    description: 'קרא פרק מהספר האהוב עליך',
    icon: BookOpen,
    category: 'cognitive',
    completed: false,
    duration: 30,
    points: 25,
  },
  {
    id: 3,
    title: 'שיחה עם חבר',
    description: 'נהל שיחה או צא לארוחת צהריים עם חבר',
    icon: Users,
    category: 'social',
    completed: false,
    duration: 10,
    points: 15,
  },
  {
    id: 4,
    title: 'מתיחות בוקר',
    description: 'מתיחות קלות לגב ולכתפיים',
    icon: Dumbbell,
    category: 'physical',
    completed: false,
    duration: 15,
    points: 20,
  },
  {
    id: 5,
    title: 'זמן קריאה',
    description:  'קרא פרק מהספר האהוב עליך',
    icon: BookOpen,
    category: 'cognitive',
    completed: false,
    duration: 30,
    points: 25,
  },
  {
    id: 6,
    title: 'מתיחות בוקר',
    description: 'מתיחות קלות לגב ולכתפיים',
    icon: Dumbbell,
    category: 'physical',
    completed: false,
    duration: 15,
    points: 20,
  },
  {
    id: 7,
    title:'זמן קריאה',
    description: 'קרא פרק מהספר האהוב עליך',
    icon: BookOpen,
    category: 'cognitive',
    completed: false,
    duration: 30,
    points: 25,
  },
];

export const achievements = [
  {
    id: 1,
    title: 'הצעד הראשון',
    description: 'השלם את הפעילות הראשונה שלך',
    icon: Dumbbell,
    unlocked: true,
  },
  {
    id: 2,
    title: 'רצף של 3 ימים',
    description: 'השלם פעילויות במשך 3 ימים ברציפות',
    icon: Clock,
    unlocked: true,
  },
  {
    id: 3,
    title: 'חברתי במיוחד',
    description: 'השלם 5 פעילויות חברתיות',
    icon: Users,
    unlocked: false,
  },
  {
    id: 4,
    title: 'תולעת ספרים',
    description: 'קרא 10 פרקים',
    icon: BookOpen,
    unlocked: false,
  },
  {
    id: 5,
    title: 'לוחם הבריאות',
    description: 'צבור 500 נקודות',
    icon: Heart,
    unlocked: false,
  },
  {
    id: 6,
    title: 'יד עוזרת',
    description: 'השלם את הפעילות החברתית הראשונה שלך',
    icon: HandHeart,
    unlocked: true,
  },
];

export const userProfile = {
  name: 'דוד לוי',
  level: 5,
  currentStreak: 7,
  longestStreak: 14,
  totalPoints: 30,
  nextLevelPoints: 500,
  activityStats: {
    physical: 12,
    cognitive: 8,
    social: 3,
  },
};


export const mockLeaderboard = {
  individual: [
    { id: 1, name: 'גל גדות', points: 480, level: 7, currentStreak: 5},
    { id: 2, name: 'רוני כהן', points: 390, level: 6, currentStreak: 19 },
    { id: 3, name: 'נועה לוי', points: 320, level: 5 , currentStreak: 8},
    { id: 4, name: 'איתי דביר', points: 290, level: 5 , currentStreak: 27},
    { id: 5, name: 'תמר שלם', points: 240, level: 4 , currentStreak: 10},
    { id: 6, name: 'אייל שני', points: 550, level: 1 , currentStreak: 100},
    { id: 7, name: 'חיים כהן', points: 240, level: 4 , currentStreak: 53},
    { id: 8, name: 'חיים נחמן', points: 310, level: 7 , currentStreak: 41},
    { id: 9, name: 'עומר אדם', points: 10, level: 9 , currentStreak: 6},
    { id: 10, name: 'דניס רודמן', points: 100, level: 10 , currentStreak: 102},
    { id: 11, name: "מייקל ג'ורדן", points: 1200, level: 2 , currentStreak: 1},
  ],
  groups: [
    {
      id: 'A',
      name: 'קבוצת דרור',
      points: 1300,
      level: 3,
      members: [
        { id: 1, name: 'אורי', contribution: 500 },
        { id: 2, name: 'דנה', contribution: 400 },
        { id: 3, name: 'עידו', contribution: 400 },
      ],
    },
    {
      id: 'B',
      name: 'קבוצת נמר',
      points: 1220,
      level: 4,
      members: [
        { id: 4, name: 'רוני', contribution: 620 },
        { id: 5, name: 'תום', contribution: 600 },
      ],
    },
    {
      id: 'C',
      name: 'קבוצת לביאה',
      points: 900,
      level: 2,
      members: [
        { id: 6, name: 'ליאן', contribution: 400 },
        { id: 7, name: 'נועם', contribution: 500 },
      ],
    },
    {
      id: 'D',
      name: 'קבוצת עוז',
      points: 700,
      level: 2,
      members: [
        { id: 8, name: 'שיר', contribution: 350 },
        { id: 9, name: 'עומר', contribution: 350 },
      ],
    },
    {
      id: 'E',
      name: 'קבוצת שמש',
      points: 500,
      level: 1,
      members: [
        { id: 10, name: 'מאיה', contribution: 500 },
      ],
    },
    {
      id: 'F',
      name: 'קבוצת סער',
      points: 450,
      level: 1,
      members: [
        { id: 11, name: 'אלון', contribution: 250 },
        { id: 12, name: 'רוני', contribution: 200 },
      ],
    },
    {
      id: 'G',
      name: 'קבוצת שביט',
      points: 300,
      level: 1,
      members: [
        { id: 13, name: 'גיל', contribution: 150 },
        { id: 14, name: 'ליה', contribution: 150 },
      ],
    },
  ],
};
export const storeItems = [
  {
    storeId: '1',
    storeName: 'חנות מתנות',
    items: [
      { id: 1, name: 'חולצה בלעדית', cost: 50, image: require('../assets/images/shirt.png') },
      { id: 2, name: 'בקבוק מים', cost: 30, image: require('../assets/images/bottle.png') },
      { id: 3, name: 'שובר סטנדאפ', cost: 80, image: require('../assets/images/standup_coupon.png') },
      { id: 4, name: 'כרטיס לסרט', cost: 60, image: require('../assets/images/movie_ticket.png') },
    ],
  },
  {
    storeId: '2',
    storeName: 'חנות פרסים מיוחדת',
    items: [
      { id: 101, name: '1כובע מגניב', cost: 2 ,image: require('../assets/images/hat1.png')},
      { id: 102, name: 'חולצה בלעדית', cost: 5 },
      { id: 103, name: 'מדבקה נדירה', cost: 80 },
      { id: 104, name: 'ערכת VIP', cost: 150 },
    ],
  },
];