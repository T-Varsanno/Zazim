import { Dumbbell, BookOpen, Users, Navigation, Clock, Brain, Heart, HandHeart } from 'lucide-react-native';

export const activities = [
  {
    id: 1,
    title: {
      en: 'Morning Stretches',
      he: 'מתיחות בוקר',
    },
    description: {
      en: 'Gentle stretches for your back and shoulders',
      he: 'מתיחות קלות לגב ולכתפיים',
    },
    icon: Dumbbell,
    category: 'physical',
    completed: false,
    duration: 15,
    points: 20,
  },
  {
    id: 2,
    title: {
      en: 'Reading Session',
      he: 'זמן קריאה',
    },
    description: {
      en: 'Read a chapter of your favorite book',
      he: 'קרא פרק מהספר האהוב עליך',
    },
    icon: BookOpen,
    category: 'cognitive',
    completed: true,
    duration: 30,
    points: 25,
  },
  {
    id: 3,
    title: {
      en: 'Call a Friend',
      he: 'שיחה עם חבר',
    },
    description: {
      en: 'Have a chat or lunch with a friend',
      he: 'נהל שיחה או צא לארוחת צהריים עם חבר',
    },
    icon: Users,
    category: 'social',
    completed: false,
    duration: 10,
    points: 15,
  },
  {
    id: 4,
    title: {
      en: 'Morning Stretches',
      he: 'מתיחות בוקר',
    },
    description: {
      en: 'Gentle stretches for your back and shoulders',
      he: 'מתיחות קלות לגב ולכתפיים',
    },
    icon: Dumbbell,
    category: 'physical',
    completed: false,
    duration: 15,
    points: 20,
  },
  {
    id: 5,
    title: {
      en: 'Reading Session',
      he: 'זמן קריאה',
    },
    description: {
      en: 'Read a chapter of your favorite book',
      he: 'קרא פרק מהספר האהוב עליך',
    },
    icon: BookOpen,
    category: 'cognitive',
    completed: true,
    duration: 30,
    points: 25,
  },
  {
    id: 6,
    title: {
      en: 'Morning Stretches',
      he: 'מתיחות בוקר',
    },
    description: {
      en: 'Gentle stretches for your back and shoulders',
      he: 'מתיחות קלות לגב ולכתפיים',
    },
    icon: Dumbbell,
    category: 'physical',
    completed: false,
    duration: 15,
    points: 20,
  },
  {
    id: 7,
    title: {
      en: 'Reading Session',
      he: 'זמן קריאה',
    },
    description: {
      en: 'Read a chapter of your favorite book',
      he: 'קרא פרק מהספר האהוב עליך',
    },
    icon: BookOpen,
    category: 'cognitive',
    completed: true,
    duration: 30,
    points: 25,
  },
];

export const achievements = [
  {
    id: 1,
    title: 'First Steps',
    title_he: 'הצעד הראשון',
    description: 'Complete your first activity',
    description_he: 'השלם את הפעילות הראשונה שלך',
    icon: Dumbbell,
    unlocked: true,
  },
  {
    id: 2,
    title: '3-Day Streak',
    title_he: 'רצף של 3 ימים',
    description: 'Do activities 3 days in a row',
    description_he: 'השלם פעילויות במשך 3 ימים ברציפות',
    icon: Clock,
    unlocked: true,
  },
  {
    id: 3,
    title: 'Social Butterfly',
    title_he: 'חברתי במיוחד',
    description: 'Complete 5 social activities',
    description_he: 'השלם 5 פעילויות חברתיות',
    icon: Users,
    unlocked: false,
  },
  {
    id: 4,
    title: 'Book Worm',
    title_he: 'תולעת ספרים',
    description: 'Read 10 chapters',
    description_he: 'קרא 10 פרקים',
    icon: BookOpen,
    unlocked: false,
  },
  {
    id: 5,
    title: 'Wellness Warrior',
    title_he: 'לוחם הבריאות',
    description: 'Earn 500 points',
    description_he: 'צבור 500 נקודות',
    icon: Heart,
    unlocked: false,
  },
  {
    id: 6,
    title: 'Helping Hand',
    title_he: 'יד עוזרת',
    description: 'Complete your first social activity',
    description_he: 'השלם את הפעילות החברתית הראשונה שלך',
    icon: HandHeart,
    unlocked: true,
  },
];

export const userProfile = {
  name: {
    en: 'David Levi',
    he: 'דוד לוי',
  },
  level: 5,
  currentStreak: 7,
  longestStreak: 14,
  totalPoints: 345,
  nextLevelPoints: 500,
  activityStats: {
    physical: 12,
    cognitive: 8,
    social: 3,
  },
};