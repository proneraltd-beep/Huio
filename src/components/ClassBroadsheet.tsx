import React, { useState, useMemo } from 'react';
import { Student } from '../types/student';
import { Search, Printer, FileText, ArrowUpDown } from 'lucide-react';

interface ClassBroadsheetProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const ClassBroadsheet: React.FC<ClassBroadsheetProps> = ({
  students,
  onSelectStudent
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<'rank' | 'name' | 'total' | 'percentage'>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Available classes in dataset
  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach(s => set.add(s.gradeLevel));
    return ['All', ...Array.from(set)];
  }, [students]);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students
      .filter(s => {
        const matchesClass = selectedClass === 'All' || s.gradeLevel === selectedClass;
        const matchesSearch =
          searchQuery === '' ||
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.registrationNo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesClass && matchesSearch;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortField === 'rank') diff = a.classRank - b.classRank;
        else if (sortField === 'total') diff = b.totalScore - a.totalScore;
        else if (sortField === 'percentage') diff = b.averagePercentage - a.averagePercentage;
        else if (sortField === 'name') diff = a.fullName.localeCompare(b.fullName);
        return sortAsc ? diff : -diff;
      });
  }, [students, selectedClass, searchQuery, sortField, sortAsc]);

  // Extract all distinct subject names for the table columns
  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    filteredStudents.forEach(s => {
      Object.keys(s.scores).forEach(sub => set.add(sub));
    });
    return Array.from(set);
  }, [filteredStudents]);

  const handleSort = (field: 'rank' | 'name' | 'total' | 'percentage') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Deck */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
            First Term Midterm Master Broadsheet · 2026
          </h1>
          <div className="text-xs text-slate-500 mt-1">
            Official class marks compilation and ranking broadsheet for KG 2 and Primary 1
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Print Broadsheet</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {classesList.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                selectedClass === cls
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cls === 'All' ? 'All Classes' : cls}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or reg no..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* Broadsheet Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-semibold text-slate-700">
                <th
                  onClick={() => handleSort('rank')}
                  className="py-3 px-3 w-16 text-center cursor-pointer hover:bg-slate-200/60"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-3 cursor-pointer hover:bg-slate-200/60"
                >
                  <div className="flex items-center gap-1">
                    <span>Scholar Details</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-center">Sex</th>
                <th className="py-3 px-2 text-center">Age</th>
                <th className="py-3 px-3 text-center">Class</th>
                {allSubjects.map(sub => (
                  <th key={sub} className="py-3 px-2 text-right font-medium max-w-[90px] truncate" title={sub}>
                    {sub}
                  </th>
                ))}
                <th
                  onClick={() => handleSort('total')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 font-bold"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Marks</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('percentage')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-200/60 font-bold"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Avg %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Grade</th>
                <th className="py-3 px-3 text-center no-print">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={allSubjects.length + 8} className="py-8 text-center text-slate-500 font-sans">
                    No student records found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.registrationNo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-center font-bold text-slate-800 tabular-nums">
                      #{st.classRank}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-semibold text-slate-900">{st.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{st.registrationNo}</div>
                    </td>
                    <td className="py-3 px-2 text-center font-sans text-slate-700">
                      {st.sex || 'Male'}
                    </td>
                    <td className="py-3 px-2 text-center font-sans text-slate-600 tabular-nums whitespace-nowrap">
                      {st.age || '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-sans font-medium text-slate-800 whitespace-nowrap">
                      {st.gradeLevel}
                    </td>
                    {allSubjects.map(sub => {
                      const score = st.scores[sub];
                      const val = score?.total;
                      return (
                        <td key={sub} className="py-3 px-2 text-right tabular-nums text-slate-700">
                          {val !== null && val !== undefined ? (
                            <span className={val >= 16 ? 'font-bold text-slate-900' : ''}>
                              {val}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {st.totalScore}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-sky-800 tabular-nums">
                      {st.averagePercentage}%
                    </td>
                    <td className="py-3 px-3 text-center font-sans font-bold">
                      <span className={
                        st.overallGrade.startsWith('A')
                          ? 'text-emerald-700'
                          : st.overallGrade === 'B'
                          ? 'text-blue-700'
                          : 'text-amber-700'
                      }>
                        {st.overallGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center no-print font-sans">
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Report</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
