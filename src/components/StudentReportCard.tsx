import React from 'react';
import { Student } from '../types/student';
import { SCHOOL_CREST_PATH, SCHOOL_NAME, SCHOOL_MOTTO, SCHOOL_SESSION } from '../assets/crest';
import { Printer, Download, ChevronLeft, ChevronRight, Award, CheckCircle } from 'lucide-react';

interface StudentReportCardProps {
  student: Student;
  allClassStudents: Student[];
  onSelectStudent: (s: Student) => void;
  onBackToLogin?: () => void;
}

export const StudentReportCard: React.FC<StudentReportCardProps> = ({
  student,
  allClassStudents,
  onSelectStudent
}) => {
  const currentIdx = allClassStudents.findIndex(s => s.registrationNo === student.registrationNo);
  const prevStudent = currentIdx > 0 ? allClassStudents[currentIdx - 1] : null;
  const nextStudent = currentIdx < allClassStudents.length - 1 ? allClassStudents[currentIdx + 1] : null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(student, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${student.registrationNo.replace(/\//g, '_')}_Midterm_Report_2026.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const subjectsList = Object.values(student.scores);

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return `${num}st`;
    if (j === 2 && k !== 12) return `${num}nd`;
    if (j === 3 && k !== 13) return `${num}rd`;
    return `${num}th`;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Action Deck (hidden during print) */}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Class Navigator:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => prevStudent && onSelectStudent(prevStudent)}
              disabled={!prevStudent}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                prevStudent ? 'hover:bg-white text-slate-800' : 'text-slate-300 cursor-not-allowed'
              }`}
              title={prevStudent ? `Previous: ${prevStudent.fullName}` : 'No previous pupil'}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <span className="px-2 text-xs font-semibold text-slate-700 font-mono">
              {currentIdx + 1} of {allClassStudents.length}
            </span>
            <button
              onClick={() => nextStudent && onSelectStudent(nextStudent)}
              disabled={!nextStudent}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                nextStudent ? 'hover:bg-white text-slate-800' : 'text-slate-300 cursor-not-allowed'
              }`}
              title={nextStudent ? `Next: ${nextStudent.fullName}` : 'No next pupil'}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Main Official Report Card Document */}
      <div className="print-container bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-10 text-slate-900 relative">
        {/* Certificate Border Accent */}
        <div className="border-4 border-double border-slate-900 p-6 sm:p-8 rounded-xl">
          {/* Official Letterhead */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-slate-900 gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-300 p-1 shrink-0 bg-white">
              <img
                src={SCHOOL_CREST_PATH}
                alt="SBS Crest"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 sm:px-4">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
                {SCHOOL_NAME}
              </h1>
              <div className="text-xs text-amber-800 font-medium tracking-wider uppercase mt-0.5">
                {SCHOOL_MOTTO} · Lagos / Ogun State Education Directorate
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Continuous Assessment & Cognitive Evaluation Center
              </div>
              <div className="text-sm font-bold text-slate-900 tracking-wide uppercase mt-2">
                First Term Midterm Assessment Report Sheet
              </div>
            </div>
            <div className="text-right text-xs shrink-0 font-mono">
              <div className="font-semibold text-slate-800">Session: {SCHOOL_SESSION}</div>
              <div className="text-slate-500">Term: First Term (2026)</div>
              <div className="text-emerald-700 font-semibold mt-1 flex items-center justify-center sm:justify-end gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Midterm Certified</span>
              </div>
            </div>
          </div>

          {/* Student Biodata Strip (Name, Sex, Age, Class, Passport Photo) */}
          <div className="my-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 py-3.5 px-4 bg-slate-50 border border-slate-200 rounded-lg text-xs items-center">
            {/* Passport Photo Slot */}
            <div className="flex items-center justify-center sm:justify-start">
              <div className="w-14 h-16 rounded-md border border-slate-300 bg-white overflow-hidden shadow-2xs flex items-center justify-center text-slate-400">
                {student.passportPhoto ? (
                  <img
                    src={student.passportPhoto}
                    alt={student.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-600 font-mono">
                    <span>{student.firstName[0] || 'S'}{student.surname[0] || 'X'}</span>
                    <span className="text-[8px] text-slate-400 uppercase">Photo</span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Scholar Name</span>
              <span className="font-bold text-slate-900 text-sm">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Sex / Gender</span>
              <span className="font-semibold text-slate-800">{student.sex || 'Male'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Age</span>
              <span className="font-semibold text-slate-800">{student.age || '14 Years'}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Class / Grade</span>
              <span className="font-bold text-sky-900">{student.gradeLevel}</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Registration No</span>
              <span className="font-mono font-semibold text-slate-900">{student.registrationNo}</span>
            </div>
          </div>

          {student.hasMidtermScores ? (
            <>
              {/* Key Metric Highlights (Clean text, unboxed) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 mb-6 border-b border-slate-200 text-center">
                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Total Marks</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {student.totalScore} <span className="text-xs text-slate-500 font-normal">/ {student.maxPossibleScore}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Midterm Average</div>
                  <div className="text-lg font-bold font-mono text-sky-900 mt-1 tabular-nums">
                    {student.averagePercentage}%
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Overall Grade</div>
                  <div className="text-lg font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{student.overallGrade}</span>
                    <span className="text-xs font-normal text-slate-600">({student.overallRemark})</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">Class Standing</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                    {getOrdinalSuffix(student.classRank)} <span className="text-xs text-slate-500 font-normal">of {student.totalStudentsInClass}</span>
                  </div>
                </div>
              </div>

              {/* Academic Performance Table */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Cognitive Performance & Continuous Assessment Breakdown
                  </h2>
                  <span className="text-[11px] text-slate-500">
                    CA 1 (10) · CA 2 (10) · Midterm Total (20)
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                        <th className="py-2.5 px-3 w-10 text-center">S/N</th>
                        <th className="py-2.5 px-3">Subject Name</th>
                        <th className="py-2.5 px-3 text-right">1st Test (/10)</th>
                        <th className="py-2.5 px-3 text-right">2nd Test (/10)</th>
                        <th className="py-2.5 px-3 text-right">Midterm (/20)</th>
                        <th className="py-2.5 px-3 text-right">Class Avg</th>
                        <th className="py-2.5 px-3 text-center">Grade</th>
                        <th className="py-2.5 px-3">Teacher's Remark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {subjectsList.map((subject, idx) => {
                        const isOffered = subject.total !== null;
                        return (
                          <tr
                            key={subject.name}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-slate-100/50'}
                          >
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono tabular-nums">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {subject.name}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                              {isOffered ? subject.test1 ?? 0 : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                              {isOffered ? subject.test2 ?? 0 : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-slate-900">
                              {isOffered ? (
                                <span>
                                  {subject.total} <span className="text-[10px] text-slate-400 font-normal">({subject.percentage}%)</span>
                                </span>
                              ) : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-500">
                              {subject.classAverage ? `${subject.classAverage}` : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold">
                              {isOffered ? (
                                <span className={
                                  subject.grade.startsWith('A')
                                    ? 'text-emerald-700'
                                    : subject.grade === 'B'
                                    ? 'text-blue-700'
                                    : subject.grade === 'C'
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }>
                                  {subject.grade}
                                </span>
                              ) : '—'}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">
                              {subject.remark}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* For scholars whose continuous assessment marks are currently compiling */
            <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-800 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Scholar Profile & Enrollment Verified
              </h3>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                {student.fullName} ({student.sex}, {student.age}) is officially registered in <strong className="text-slate-800">{student.gradeLevel}</strong> for the {student.academicYear} academic session. Continuous assessment exercises for this class are currently in progress and will be uploaded shortly by the subject teachers.
              </p>
              {student.house && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                  <span>School House:</span>
                  <span className="font-semibold text-slate-900">{student.house}</span>
                </div>
              )}
            </div>
          )}

          {/* Affective & Psychomotor Domain Evaluation */}
          {/* Affective & Psychomotor Domain Evaluation */}
          {student.behavioral && (
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center justify-between">
                <span>Affective & Psychomotor Developmental Traits</span>
                <span className="text-[10px] font-normal text-slate-500">
                  Key: 5 - Excellent · 4 - Good · 3 - Satisfactory · 2 - Fair · 1 - Poor
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-6 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Punctuality</span>
                  <span className="font-mono font-bold text-slate-900">{student.behavioral.punctuality ?? 5} / 5</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Neatness & Decorum</span>
                  <span className="font-mono font-bold text-slate-900">{student.behavioral.neatness ?? 5} / 5</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Class Attentiveness</span>
                  <span className="font-mono font-bold text-slate-900">{student.behavioral.attentiveness ?? 5} / 5</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Homework & Assignments</span>
                  <span className="font-mono font-bold text-slate-900">{student.behavioral.homeworkCompletion ?? 5} / 5</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Peer & Social Conduct</span>
                  <span className="font-mono font-bold text-slate-900">{student.behavioral.socialInteraction ?? 5} / 5</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Handwriting & Presentation</span>
                  <span className="font-mono font-bold text-slate-900">{student.behavioral.handwriting ?? 5} / 5</span>
                </div>
              </div>
            </div>
          )}

          {/* Grading Scale Guide */}
          <div className="mb-6 p-3 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600">
            <span className="font-bold text-slate-800 uppercase tracking-wide mr-2">Official Grading Scale:</span>
            <span>A+ (80-100% · Distinction) · A (70-79% · Excellent) · B (60-69% · Very Good) · C (50-59% · Credit) · D (40-49% · Pass) · E (&lt;40% · Remedial)</span>
          </div>

          {/* Teacher and Principal Endorsement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-slate-900">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Class Teacher's Midterm Assessment Remark:
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed min-h-[44px]">
                "{student.teacherRemark}"
              </p>
              <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                <span>Class Teacher's Signature: <span className="font-serif italic font-bold text-slate-800 text-sm">Mrs. Adebayo C.</span></span>
                <span>Date: Oct 2026</span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Head of School / Principal's Endorsement:
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed min-h-[44px]">
                "{student.principalRemark}"
              </p>
              <div className="mt-4 pt-2 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500">
                <span>Principal's Official Stamp: <span className="font-serif italic font-bold text-sky-900 text-sm">Dr. O. Babatunde (Ph.D)</span></span>
                <span className="text-emerald-700 font-bold">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
