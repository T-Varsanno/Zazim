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

export const storeItems = [
  { id: 1, name: 'כובע קסמים', cost: 10 },
  { id: 2, name: 'נעלי ריצה', cost: 20 },
  { id: 3, name: 'משקפי שמש', cost: 30 },
];