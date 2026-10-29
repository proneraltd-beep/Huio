import { SubjectScore, BehavioralAssessment } from '../types/student';

export function calculateGrade(scoreOutOf20: number): { grade: string; remark: string } {
  const percentage = (scoreOutOf20 / 20) * 100;
  if (percentage >= 80) {
    return { grade: 'A+', remark: 'Distinction' };
  } else if (percentage >= 70) {
    return { grade: 'A', remark: 'Excellent' };
  } else if (percentage >= 60) {
    return { grade: 'B', remark: 'Very Good' };
  } else if (percentage >= 50) {
    return { grade: 'C', remark: 'Good Credit' };
  } else if (percentage >= 40) {
    return { grade: 'D', remark: 'Fair Pass' };
  } else {
    return { grade: 'E', remark: 'Needs Improvement' };
  }
}

export function generateTeacherRemark(
  fullName: string,
  percentage: number,
  bestSubjects: string[],
  weakSubjects: string[]
): string {
  const firstName = fullName.split(' ')[0] || fullName;

  if (percentage >= 85) {
    return `${firstName} has demonstrated exceptional intellectual acumen and dedication this midterm. Outstanding mastery in ${bestSubjects.slice(0, 2).join(' and ')}. Keep reaching for greater heights!`;
  } else if (percentage >= 75) {
    return `${firstName} is a very focused and disciplined pupil with commendable academic enthusiasm. Shows strong aptitude in ${bestSubjects[0] || 'core subjects'}. Continued diligence will yield top honours.`;
  } else if (percentage >= 65) {
    return `${firstName} has shown admirable effort and steady progress throughout the midterm assessment. Good performance in ${bestSubjects[0] || 'class activities'}. Encouraged to devote more practice to ${weakSubjects[0] || 'revision'}.`;
  } else if (percentage >= 50) {
    return `${firstName} exhibits genuine potential and good classroom deportment. Needs more consistency and regular study hours, particularly in ${weakSubjects.slice(0, 2).join(' and ')}.`;
  } else {
    return `${firstName} needs closer supervision and constructive academic reinforcement. With concerted focus and dedicated remedial support, significant improvement is attainable.`;
  }
}

export function generatePrincipalRemark(percentage: number): string {
  if (percentage >= 85) {
    return 'An exemplary performance reflecting sterling scholastic promise. Approved with high commendation.';
  } else if (percentage >= 75) {
    return 'Very impressive midterm result. Keep up the disciplined academic momentum.';
  } else if (percentage >= 65) {
    return 'Satisfactory academic progress. Put in that extra spark in the second half of the term.';
  } else if (percentage >= 50) {
    return 'Fair effort recorded. Greater diligence and parental reinforcement are advised.';
  } else {
    return 'Urgent remedial intervention and regular home study sessions are recommended.';
  }
}

export function generateBehavioralProfile(seedNum: number, percentage: number): BehavioralAssessment {
  // Balanced realistic primary school behavioral profile
  const base = percentage >= 80 ? 5 : percentage >= 65 ? 4 : 3;
  return {
    punctuality: Math.min(5, Math.max(3, base + ((seedNum * 3) % 2 === 0 ? 0 : 1))),
    neatness: Math.min(5, Math.max(3, base + ((seedNum * 2) % 3 === 0 ? 0 : 1))),
    attentiveness: Math.min(5, Math.max(3, percentage >= 75 ? 5 : 4)),
    homeworkCompletion: Math.min(5, Math.max(3, percentage >= 70 ? 5 : 4)),
    socialInteraction: Math.min(5, Math.max(4, 4 + (seedNum % 2))),
    handwriting: Math.min(5, Math.max(3, 4 + ((seedNum * 7) % 2))),
  };
}
