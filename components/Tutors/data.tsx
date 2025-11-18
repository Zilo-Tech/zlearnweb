// types/tutor.ts
export interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  students: number;
  courses: number;
  image: string;
  bio: string;
  expertise: string[];
}

export const topTutors: Tutor[] = [
//   {
//     id: '1',
//     name: 'Dr. Sarah Johnson',
//     subject: 'Mathematics',
//     rating: 4.9,
//     students: 1247,
//     courses: 15,
//     image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q',
//     bio: 'PhD in Mathematics with 10+ years of teaching experience',
//     expertise: ['Calculus', 'Linear Algebra', 'Statistics']
//   },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    subject: 'Computer Science',
    rating: 4.8,
    students: 1893,
    courses: 12,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q',
    bio: 'Former Google engineer turned educator',
    expertise: ['React', 'TypeScript', 'Algorithms']
  },
  {
    id: '4',
    name: 'Mr. James Wilson',
    subject: 'English Literature',
    rating: 4.7,
    students: 1342,
    courses: 10,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q',
    bio: 'Award-winning author and literature professor',
    expertise: ['Shakespeare', 'Modernist Literature', 'Creative Writing']
  },

  {
    id: '6',
    name: 'Prof. David Kim',
    subject: 'History',
    rating: 4.6,
    students: 875,
    courses: 7,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q',
    bio: 'Historian and author specializing in world civilizations',
    expertise: ['Ancient History', 'European History', 'Political History']
  },
  {
    id: '7',
    name: 'Ms. Lisa Thompson',
    subject: 'Biology',
    rating: 4.9,
    students: 1560,
    courses: 11,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q',
    bio: 'Marine biologist and environmental science educator',
    expertise: ['Genetics', 'Ecology', 'Marine Biology']
  },
  {
    id: '8',
    name: 'Dr. Robert Brown',
    subject: 'Economics',
    rating: 4.7,
    students: 1420,
    courses: 8,
    image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q',
    bio: 'Former economic advisor with real-world industry experience',
    expertise: ['Microeconomics', 'Macroeconomics', 'Financial Markets']
  }
];