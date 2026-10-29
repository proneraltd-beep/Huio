import React, { useState } from 'react';
import { INITIAL_STUDENTS } from './data/studentData';
import { Student } from './types/student';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { StudentReportCard } from './components/StudentReportCard';
import { ClassBroadsheet } from './components/ClassBroadsheet';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { RawDataViewer } from './components/RawDataViewer';
import { AdminSettingsModal } from './components/AdminSettingsModal';

export default function App() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'report' | 'broadsheet' | 'analytics' | 'files'>('report');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Student login handler
  const handleStudentLogin = (student: Student) => {
    // Keep updated reference from current students list
    const current = students.find(s => s.registrationNo === student.registrationNo) || student;
    setLoggedInStudent(current);
    setIsAdmin(false);
    setCurrentTab('report');
  };

  // Admin / Teacher login handler
  const handleAdminLogin = () => {
    setIsAdmin(true);
    setLoggedInStudent(null);
    setCurrentTab('broadsheet');
  };

  // Sign out handler
  const handleLogout = () => {
    setLoggedInStudent(null);
    setIsAdmin(false);
    setCurrentTab('report');
  };

  // Select student from broadsheet or navigator
  const handleSelectStudent = (student: Student) => {
    setLoggedInStudent(student);
    setCurrentTab('report');
  };

  // Update students list (e.g. from new CSV upload)
  const handleUpdateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    if (loggedInStudent) {
      const updated = newStudents.find(s => s.registrationNo === loggedInStudent.registrationNo);
      if (updated) setLoggedInStudent(updated);
    }
  };

  // Reset to initial files
  const handleResetToDefault = () => {
    setStudents(INITIAL_STUDENTS);
    if (loggedInStudent) {
      const resetStudent = INITIAL_STUDENTS.find(s => s.registrationNo === loggedInStudent.registrationNo);
      if (resetStudent) setLoggedInStudent(resetStudent);
    }
  };

  const isUserAuthenticated = loggedInStudent !== null || isAdmin;

  // Filter students belonging to the active student's class for the navigator
  const activeClassStudents = loggedInStudent
    ? students.filter(s => s.gradeLevel === loggedInStudent.gradeLevel)
    : students;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      {isUserAuthenticated && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          loggedInStudent={loggedInStudent}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {!isUserAuthenticated ? (
          <LoginForm
            students={students}
            onStudentLogin={handleStudentLogin}
            onAdminLogin={handleAdminLogin}
          />
        ) : (
          <>
            {currentTab === 'report' && loggedInStudent && (
              <StudentReportCard
                student={loggedInStudent}
                allClassStudents={activeClassStudents}
                onSelectStudent={handleSelectStudent}
                onBackToLogin={handleLogout}
              />
            )}

            {currentTab === 'report' && !loggedInStudent && (
              <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Please select a pupil from the Class Broadsheet to view their individual midterm report card.
                </p>
                <button
                  onClick={() => setCurrentTab('broadsheet')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  View Broadsheet
                </button>
              </div>
            )}

            {currentTab === 'broadsheet' && (
              <ClassBroadsheet
                students={students}
                onSelectStudent={handleSelectStudent}
              />
            )}

            {currentTab === 'analytics' && (
              <PerformanceAnalytics students={students} />
            )}

            {currentTab === 'files' && (
              <RawDataViewer
                onUpdateStudents={handleUpdateStudents}
                onResetToDefault={handleResetToDefault}
              />
            )}
          </>
        )}
      </main>

      {/* Footer (Hidden on print) */}
      <footer className="no-print mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 SBS International Academy · Midterm Assessment Management System
          </span>
          <span className="text-slate-400">
            First Term Midterm Examinations · Embedded Datasets: KG2 & Primary 1
          </span>
        </div>
      </footer>

      {/* Settings Modal */}
      <AdminSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
