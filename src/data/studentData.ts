import { Student, SubjectScore, ClassSummary } from '../types/student';
import { calculateGrade, generateTeacherRemark, generatePrincipalRemark, generateBehavioralProfile } from '../utils/grading';
import rawDatabaseJson from './studentsDatabase.json';

export interface AttachedFileMeta {
  filename: string;
  sourceRepo: string;
  gradeLevel: string;
  totalStudents: number;
  term: string;
  description: string;
}

export const ATTACHED_FILES: AttachedFileMeta[] = [
  {
    filename: 'Stanbax_Complete_Migration_88_Scholars_Logins_Subjects_2026-10-29 2.json',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'All Classes (88 Scholars)',
    totalStudents: 88,
    term: 'Complete Scholar Biodata & Logins',
    description: 'Master migration backup containing 88 scholars with student logins, gender, classes, parent details, and houses.'
  },
  {
    filename: 'ss3_scores.json',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'SSS 3 (Arts & Science)',
    totalStudents: 6,
    term: 'First Term Midterm 2026',
    description: 'SSS 3 continuous assessment marks for Ezenwa, Iteji, Ademijoke, Ejionye, Okwuchukwu, and Adeleke.'
  },
  {
    filename: 'ss1_scores.json',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'SSS 1 (Arts & Science)',
    totalStudents: 7,
    term: 'First Term Midterm 2026',
    description: 'SSS 1 scores with 3rd-test normalization (first 2 tests chosen per policy).'
  },
  {
    filename: 'jss2_scores.json',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'JSS 2',
    totalStudents: 9,
    term: 'First Term Midterm 2026',
    description: 'JSS 2 continuous assessment marks for 9 scholars across 10 subject areas.'
  },
  {
    filename: 'Jss1.csv',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'JSS 1',
    totalStudents: 10,
    term: 'First Term Midterm 2026',
    description: 'JSS 1 continuous assessment marks across 12 subjects.'
  },
  {
    filename: 'Pry.json',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'Primary 2 & 3',
    totalStudents: 14,
    term: 'First Term Midterm 2026',
    description: 'Primary 2 and Primary 3 continuous assessment scores across 13 core subjects.'
  },
  {
    filename: 'Kg1.csv',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'KG 1',
    totalStudents: 6,
    term: 'First Term Midterm 2026',
    description: 'KG 1 continuous assessment scores across 11 subjects.'
  },
  {
    filename: 'Ss2_science.csv',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'SSS 2 Science',
    totalStudents: 3,
    term: 'First Term Midterm 2026',
    description: 'SSS 2 Science continuous assessment marks for STEM subjects.'
  },
  {
    filename: 'Ss2art.csv',
    sourceRepo: 'justindecalvin/Scores',
    gradeLevel: 'SSS 2 Arts & Commercial',
    totalStudents: 3,
    term: 'First Term Midterm 2026',
    description: 'SSS 2 Arts & Commercial continuous assessment marks.'
  },
  {
    filename: 'Kg2_f8169099.csv',
    sourceRepo: 'justindecalvin/Madkk',
    gradeLevel: 'KG 2',
    totalStudents: 6,
    term: 'First Term Midterm 2026',
    description: 'Original KG 2 continuous assessment marks (skipped re-import per user instructions).'
  },
  {
    filename: 'Pry1_6c2c9837.csv',
    sourceRepo: 'justindecalvin/Madkk',
    gradeLevel: 'Primary 1',
    totalStudents: 2,
    term: 'First Term Midterm 2026',
    description: 'Original Primary 1 continuous assessment marks (skipped re-import per user instructions).'
  }
];

// Initialize and decorate students with remarks & behavioral profiles if missing
export const INITIAL_STUDENTS: Student[] = (rawDatabaseJson as Student[]).map((st, idx) => {
  const sortedSubjects = Object.values(st.scores || {})
    .filter(s => s.total !== null)
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  const bestSubjects = sortedSubjects.slice(0, 3).map(s => s.name);
  const weakSubjects = [...sortedSubjects].reverse().slice(0, 2).map(s => s.name);

  const teacherRemark = st.teacherRemark || (
    st.hasMidtermScores
      ? generateTeacherRemark(st.fullName, st.averagePercentage, bestSubjects, weakSubjects)
      : `${st.firstName || st.fullName} is actively enrolled for the 2025/2026 session. Continuous assessment exercises are currently being compiled.`
  );

  const principalRemark = st.principalRemark || (
    st.hasMidtermScores
      ? generatePrincipalRemark(st.averagePercentage)
      : 'Scholar profile registered on Stanbax Schools portal. Academic standing in good order.'
  );

  const behavioral = st.behavioral || generateBehavioralProfile(idx + 1, st.averagePercentage);

  return {
    ...st,
    teacherRemark,
    principalRemark,
    behavioral
  };
});

/**
 * Universal Student Search / Login Matcher
 * Supports:
 * - Reg No: e.g. "STX/2026/SS3/001", "SBS/2026/KG2/001", "STX/2026/141", "001", "141"
 * - Surname & First Name in any order: e.g. "Abayomi David", "Ezenwa Uchechukwu", "Uchechukwu Ezenwa"
 * - All names: e.g. "Taofeek Fawas", "Oladele Esther Ayomide", "Ademijoke David"
 */
export function findStudentByIdentifier(identifier: string, students: Student[] = INITIAL_STUDENTS): Student | null {
  if (!identifier) return null;
  const cleanInput = identifier.trim().toLowerCase();

  // 1. Exact Registration Number match
  const exactReg = students.find(s => s.registrationNo.toLowerCase() === cleanInput);
  if (exactReg) return exactReg;

  // 2. Normalized Reg No match (ignoring slashes, dashes, spaces)
  const normInput = cleanInput.replace(/[^a-z0-9]/g, '');
  if (normInput.length >= 2) {
    const regMatch = students.find(s => {
      const sNorm = s.registrationNo.toLowerCase().replace(/[^a-z0-9]/g, '');
      return sNorm === normInput || sNorm.endsWith(normInput);
    });
    if (regMatch) return regMatch;
  }

  // 3. Exact full name match (case-insensitive)
  const exactName = students.find(s => s.fullName.toLowerCase() === cleanInput);
  if (exactName) return exactName;

  // 4. Tokenized name match (supports Surname Firstname OR Firstname Surname)
  const inputTokens = cleanInput.split(/[\s,]+/).filter(t => t.length > 0);
  if (inputTokens.length >= 2) {
    const tokenMatch = students.find(s => {
      const studentTokens = s.fullName.toLowerCase().split(/[\s,]+/).filter(t => t.length > 0);
      const allInStudent = inputTokens.every(tok => studentTokens.some(st => st.includes(tok) || tok.includes(st)));
      return allInStudent;
    });
    if (tokenMatch) return tokenMatch;
  }

  // 5. Single token name match (if unique and >= 3 characters)
  if (inputTokens.length === 1 && inputTokens[0].length >= 3) {
    const singleToken = inputTokens[0];
    const candidateMatches = students.filter(s =>
      s.fullName.toLowerCase().includes(singleToken) ||
      s.registrationNo.toLowerCase().includes(singleToken)
    );
    if (candidateMatches.length === 1) {
      return candidateMatches[0];
    }
  }

  return null;
}

export function getClassSummary(gradeLevel: string, students: Student[] = INITIAL_STUDENTS): ClassSummary | null {
  const classStudents = students.filter(s => s.gradeLevel.toLowerCase() === gradeLevel.toLowerCase());
  if (classStudents.length === 0) return null;

  const scoredStudents = classStudents.filter(s => s.hasMidtermScores);
  if (scoredStudents.length === 0) {
    return {
      gradeLevel,
      studentCount: classStudents.length,
      averagePercentage: 0,
      highestPercentage: 0,
      lowestPercentage: 0,
      topStudentName: classStudents[0]?.fullName || 'N/A',
      subjectsList: []
    };
  }

  const totalPercentages = scoredStudents.reduce((acc, curr) => acc + curr.averagePercentage, 0);
  const avg = Math.round((totalPercentages / scoredStudents.length) * 10) / 10;
  const highest = Math.max(...scoredStudents.map(s => s.averagePercentage));
  const lowest = Math.min(...scoredStudents.map(s => s.averagePercentage));
  const top = scoredStudents.find(s => s.averagePercentage === highest);

  const subjectsSet = new Set<string>();
  scoredStudents.forEach(s => {
    Object.keys(s.scores).forEach(sub => subjectsSet.add(sub));
  });

  return {
    gradeLevel,
    studentCount: classStudents.length,
    averagePercentage: avg,
    highestPercentage: highest,
    lowestPercentage: lowest,
    topStudentName: top?.fullName || 'N/A',
    subjectsList: Array.from(subjectsSet)
  };
}
