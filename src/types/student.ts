export interface SubjectScore {
  name: string;
  test1: number | null; // 1st CA Test (out of 10)
  test2: number | null; // 2nd CA Test (out of 10)
  total: number | null; // Total (out of 20)
  percentage: number | null; // Scaled to 100%
  grade: string;
  remark: string;
  classAverage?: number;
}

export interface BehavioralAssessment {
  punctuality: number; // 1 to 5 scale
  neatness: number;
  attentiveness: number;
  homeworkCompletion: number;
  socialInteraction: number;
  handwriting: number;
}

export interface Student {
  registrationNo: string;
  fullName: string;
  surname: string;
  firstName: string;
  otherNames?: string;
  gradeLevel: string;
  sex: 'Male' | 'Female' | string;
  age: string | number;
  academicYear: string;
  term: string;
  avatarSeed?: string;
  passportPhoto?: string;
  house?: string;
  scores: Record<string, SubjectScore>;
  totalScore: number;
  maxPossibleScore: number;
  averagePercentage: number;
  overallGrade: string;
  overallRemark: string;
  classRank: number;
  totalStudentsInClass: number;
  teacherRemark?: string;
  principalRemark?: string;
  behavioral?: BehavioralAssessment;
  attendanceDays: {
    present: number;
    total: number;
  };
  hasMidtermScores: boolean;
}

export interface ClassSummary {
  gradeLevel: string;
  studentCount: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  topStudentName: string;
  subjectsList: string[];
}
