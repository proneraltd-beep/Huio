import React, { useMemo, useState } from 'react';
import { Student } from '../types/student';
import { Award, BookOpen, GraduationCap, Users, TrendingUp } from 'lucide-react';

interface PerformanceAnalyticsProps {
  students: Student[];
}

export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ students }) => {
  const [selectedCohort, setSelectedCohort] = useState<string>('All');

  // Group students by class
  const classGroups = useMemo(() => {
    const groups: Record<string, Student[]> = {};
    students.forEach(s => {
      if (!groups[s.gradeLevel]) groups[s.gradeLevel] = [];
      groups[s.gradeLevel].push(s);
    });
    return groups;
  }, [students]);

  const classNames = useMemo(() => {
    return Object.keys(classGroups).sort();
  }, [classGroups]);

  const calculateStats = (list: Student[]) => {
    const scoredList = list.filter(s => s.hasMidtermScores);
    if (scoredList.length === 0) return { avg: 0, highest: 0, lowest: 0, topStudent: null, count: list.length, scoredCount: 0 };
    const avg = Math.round((scoredList.reduce((acc, s) => acc + s.averagePercentage, 0) / scoredList.length) * 10) / 10;
    const highest = Math.max(...scoredList.map(s => s.averagePercentage));
    const lowest = Math.min(...scoredList.map(s => s.averagePercentage));
    const topStudent = scoredList.find(s => s.averagePercentage === highest) || null;
    return { avg, highest, lowest, topStudent, count: list.length, scoredCount: scoredList.length };
  };

  // Compute subject averages across all students with scores
  const subjectAverages = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    students.forEach(st => {
      if (st.hasMidtermScores) {
        Object.entries(st.scores).forEach(([subj, score]) => {
          if (score.total !== null) {
            if (!map[subj]) map[subj] = { total: 0, count: 0 };
            map[subj].total += score.total;
            map[subj].count++;
          }
        });
      }
    });

    return Object.entries(map)
      .map(([subject, data]) => ({
        subject,
        average: Math.round((data.total / data.count) * 10) / 10,
        percentage: Math.round(((data.total / data.count) / 20) * 1000) / 10,
        testedCount: data.count
      }))
      .sort((a, b) => b.average - a.average);
  }, [students]);

  // Overall school metrics
  const scoredScholars = useMemo(() => students.filter(s => s.hasMidtermScores), [students]);
  const schoolAvg = useMemo(() => {
    if (scoredScholars.length === 0) return 0;
    return Math.round((scoredScholars.reduce((a, b) => a + b.averagePercentage, 0) / scoredScholars.length) * 10) / 10;
  }, [scoredScholars]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
          Midterm Performance & Cognitive Analytics · 2026
        </h1>
        <div className="text-xs text-slate-500 mt-1">
          Comparative assessment indicators, subject mastery metrics, and cohort standings across Stanbax Schools
        </div>
      </div>

      {/* School Highlights KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Total Enrolled Scholars</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {students.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">88 Migration + 6 SS3 + Attachments</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Midterm Assessed</div>
          <div className="text-2xl font-bold font-mono text-sky-800 mt-1 tabular-nums">
            {scoredScholars.length} <span className="text-xs text-slate-500 font-normal">Scholars</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">CA1 & CA2 tests evaluated</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 uppercase tracking-wider">School Midterm Average</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {schoolAvg}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Overall scholastic index</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Senior Academic Standing</div>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1 tabular-nums">
            98.3%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">SS 3 top score (Ejionye C.)</div>
        </div>
      </div>

      {/* Class Cohorts Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 font-heading">
            Class Cohort Breakdown
          </h2>
          <span className="text-xs text-slate-500">
            {classNames.length} Classes Registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classNames.map(cName => {
            const list = classGroups[cName];
            const stats = calculateStats(list);
            return (
              <div key={cName} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-heading truncate max-w-[200px]" title={cName}>
                        {cName}
                      </h3>
                      <div className="text-[11px] text-slate-500">
                        {stats.count} Scholars {stats.scoredCount > 0 ? `· ${stats.scoredCount} graded` : '· in progress'}
                      </div>
                    </div>
                    {stats.scoredCount > 0 && (
                      <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                        {stats.avg}% avg
                      </span>
                    )}
                  </div>

                  {stats.scoredCount > 0 ? (
                    <div className="grid grid-cols-2 gap-2 my-3 text-center text-xs">
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-[10px] text-slate-500 block">Top Mark</span>
                        <span className="font-bold font-mono text-emerald-700">{stats.highest}%</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-[10px] text-slate-500 block">Lowest Mark</span>
                        <span className="font-bold font-mono text-slate-700">{stats.lowest}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="my-3 p-2 bg-slate-50 rounded text-center text-[11px] text-slate-500">
                      Biodata on file · CA marks compiling
                    </div>
                  )}
                </div>

                {stats.topStudent && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      1st: <strong className="text-slate-800">{stats.topStudent.fullName}</strong>
                    </span>
                    <span className="font-mono font-semibold text-sky-800 text-[11px]">
                      {stats.topStudent.averagePercentage}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-by-Subject Mastery Level */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Subject Mastery & Average Marks (/20)
            </h2>
            <div className="text-xs text-slate-500">
              Computed across all continuous assessment evaluations in Stanbax Schools
            </div>
          </div>
          <BookOpen className="w-5 h-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {subjectAverages.map((item) => (
            <div key={item.subject} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 truncate max-w-[220px]" title={item.subject}>{item.subject}</span>
                <span className="font-mono text-slate-600 tabular-nums">
                  <span className="font-bold text-slate-900">{item.average}</span> / 20 ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.percentage >= 80
                      ? 'bg-emerald-600'
                      : item.percentage >= 65
                      ? 'bg-sky-600'
                      : item.percentage >= 50
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
