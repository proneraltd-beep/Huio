import React, { useState } from 'react';
import { SCHOOL_CREST_PATH, SCHOOL_NAME, SCHOOL_MOTTO, ASSESSMENT_TERM } from '../assets/crest';
import { Student } from '../types/student';
import { findStudentByIdentifier } from '../data/studentData';
import { verifyStudentPassword, verifyAdminPassword, DEFAULT_STUDENT_PORTAL_PASSWORD } from '../utils/auth';
import { Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, FileSpreadsheet } from 'lucide-react';

interface LoginFormProps {
  students: Student[];
  onStudentLogin: (student: Student) => void;
  onAdminLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  students,
  onStudentLogin,
  onAdminLogin
}) => {
  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedStudentPreview, setSelectedStudentPreview] = useState<Student | null>(null);

  // Live identifier detection
  const handleIdentifierChange = (value: string) => {
    setIdentifier(value);
    setErrorMsg(null);
    if (value.trim().length >= 3) {
      const found = findStudentByIdentifier(value, students);
      setSelectedStudentPreview(found);
    } else {
      setSelectedStudentPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === 'admin') {
      if (verifyAdminPassword(password)) {
        onAdminLogin();
      } else {
        setErrorMsg('Invalid staff passcode. (Hint: use admin2026 or teacher2026)');
      }
      return;
    }

    if (!identifier.trim()) {
      setErrorMsg('Please enter your Registration Number, Surname & First Name, or Full Name.');
      return;
    }

    if (!password.trim()) {
      setErrorMsg('Please enter the universal portal access password.');
      return;
    }

    // Verify Password
    if (!verifyStudentPassword(password)) {
      setErrorMsg(`Invalid portal access password. The default universal password for all students is "${DEFAULT_STUDENT_PORTAL_PASSWORD}".`);
      return;
    }

    // Match Student
    const student = findStudentByIdentifier(identifier, students);
    if (!student) {
      setErrorMsg(
        `No student record found matching "${identifier}". You can enter your Reg No (e.g. SBS/2026/KG2/001), Surname and Firstname (e.g. Abayomi David), or select from the Quick Login list below.`
      );
      return;
    }

    onStudentLogin(student);
  };

  const handleQuickLogin = (student: Student) => {
    setIdentifier(student.fullName);
    setPassword(DEFAULT_STUDENT_PORTAL_PASSWORD);
    setSelectedStudentPreview(student);
    setErrorMsg(null);
    onStudentLogin(student);
  };

  const fillDefaultPassword = () => {
    setPassword(DEFAULT_STUDENT_PORTAL_PASSWORD);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Crest */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden mb-4">
          <img
            src={SCHOOL_CREST_PATH}
            alt="SBS Crest"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          {SCHOOL_NAME}
        </h1>
        <div className="text-xs text-amber-700 font-medium tracking-wide mt-1">
          {SCHOOL_MOTTO}
        </div>
        <div className="mt-2 text-sm text-slate-600 font-medium">
          {ASSESSMENT_TERM}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('student');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                mode === 'student'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student / Parent Portal
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('admin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                mode === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher / Broadsheet View
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'student' ? (
              <>
                {/* Identifier input */}
                <div>
                  <label htmlFor="identifier" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Student Identifier
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => handleIdentifierChange(e.target.value)}
                      placeholder="Reg No (e.g. SBS/2026/KG2/001) or Name (e.g. David Abayomi)"
                      className="block w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white placeholder-slate-400"
                      autoComplete="off"
                    />
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Input Reg No (e.g. STX/2026/SS3/001, SBS/2026/KG2/001, 141), Surname & First Name, or all names</span>
                    {selectedStudentPreview && (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Found: {selectedStudentPreview.fullName} ({selectedStudentPreview.sex}, {selectedStudentPreview.age}, {selectedStudentPreview.gradeLevel})
                      </span>
                    )}
                  </div>
                </div>

                {/* Universal Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Portal Password
                    </label>
                    <button
                      type="button"
                      onClick={fillDefaultPassword}
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-medium underline transition-colors"
                    >
                      Use Default ({DEFAULT_STUDENT_PORTAL_PASSWORD})
                    </button>
                  </div>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter universal portal password"
                      className="block w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-500">
                    Universal access password for all students: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-semibold">{DEFAULT_STUDENT_PORTAL_PASSWORD}</code>
                  </div>
                </div>
              </>
            ) : (
              /* Admin / Staff Passcode */
              <div>
                <label htmlFor="adminPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Staff Access Passcode
                </label>
                <div className="relative rounded-lg shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <input
                    id="adminPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter staff passcode (e.g. admin2026)"
                    className="block w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Staff passcode: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-semibold">admin2026</code>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <span>{mode === 'student' ? 'Access Midterm Report' : 'Open Class Broadsheet'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Student Switcher / Demo Login */}
          {mode === 'student' && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Quick Student Login (1-Click Test)
                </span>
                <span className="text-[11px] text-slate-500">
                  {students.length} scholars in database
                </span>
              </div>

              {/* SS3 Created Accounts */}
              <div className="mb-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                    ⭐ Newly Created SS 3 Scholar Accounts
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium">SS3 Class Created</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {students
                    .filter(s => s.gradeLevel.includes('SSS 3') || s.gradeLevel.includes('SS 3'))
                    .map(s => (
                      <button
                        key={s.registrationNo}
                        type="button"
                        onClick={() => handleQuickLogin(s)}
                        className="text-left p-1.5 rounded-lg border border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-100/50 transition-colors group"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-amber-900 truncate">
                          {s.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                          {s.sex} · {s.age} · {s.registrationNo}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Senior & Junior Secondary Sample Scholars */}
              <div className="mb-3">
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Secondary Scholars (SSS 1, SSS 2, JSS 1, JSS 2)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {students
                    .filter(s => s.gradeLevel.includes('SSS 1') || s.gradeLevel.includes('SSS 2') || s.gradeLevel.includes('JSS 1') || s.gradeLevel.includes('JSS 2'))
                    .slice(0, 6)
                    .map(s => (
                      <button
                        key={s.registrationNo}
                        type="button"
                        onClick={() => handleQuickLogin(s)}
                        className="text-left p-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors group"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 truncate">
                          {s.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums truncate">
                          {s.gradeLevel} · {s.sex} · {s.registrationNo}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Primary & Kindergarten Scholars */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Primary & Early Years Scholars (KG 1, KG 2, Primary 1-3)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {students
                    .filter(s => s.gradeLevel.includes('KG') || s.gradeLevel.includes('Primary'))
                    .slice(0, 6)
                    .map(s => (
                      <button
                        key={s.registrationNo}
                        type="button"
                        onClick={() => handleQuickLogin(s)}
                        className="text-left p-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-colors group"
                      >
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-sky-700 truncate">
                          {s.fullName}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums truncate">
                          {s.gradeLevel} · {s.sex} · {s.registrationNo}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Attached Files Footer Banner */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
              Source: Stanbax Migration & Midterm Scores Database
            </span>
            <span>110 Scholars · 11 Classes Configured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
