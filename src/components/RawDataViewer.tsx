import React, { useState } from 'react';
import { ATTACHED_FILES } from '../data/studentData';
import { Student } from '../types/student';
import { FileSpreadsheet, Download, RefreshCw, Check, Copy, Database, CheckCircle2 } from 'lucide-react';
import studentsJson from '../data/studentsDatabase.json';

interface RawDataViewerProps {
  onUpdateStudents: (newStudents: Student[]) => void;
  onResetToDefault: () => void;
}

export const RawDataViewer: React.FC<RawDataViewerProps> = ({
  onResetToDefault
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeMeta = ATTACHED_FILES[selectedIdx] || ATTACHED_FILES[0];

  const handleCopyDatabaseJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(studentsJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDatabase = () => {
    const blob = new Blob([JSON.stringify(studentsJson, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Stanbax_Complete_Students_Database_2026.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Backed Up Migration & Score Datasets
          </h1>
          <div className="text-xs text-slate-500 mt-1">
            Data sourced from <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">justindecalvin/Scores</code> and embedded into Stanbax Schools portal
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadDatabase}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export 110 Scholars JSON</span>
          </button>

          <button
            onClick={onResetToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            title="Reset to default compiled database"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Database Highlights Banner */}
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-sky-700 shrink-0" />
          <div>
            <strong className="font-semibold">Complete Stanbax Scholar Migration Active:</strong>
            <span className="text-sky-800 ml-1">
              110 Total Scholar Accounts (88 Migration Scholars + 6 SS3 Created Accounts + 16 Primary/Secondary Additions). 79 with Midterm test scores.
            </span>
          </div>
        </div>
        <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>Synced</span>
        </span>
      </div>

      {/* File Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ATTACHED_FILES.map((f, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <div
              key={f.filename}
              onClick={() => setSelectedIdx(idx)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-sky-600 bg-sky-50/40 shadow-xs ring-1 ring-sky-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-800 shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 font-mono truncate" title={f.filename}>{f.filename}</h3>
                    <div className="text-[10px] text-slate-500 truncate">{f.gradeLevel}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                  {f.totalStudents}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                {f.description}
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Repo: {f.sourceRepo}</span>
                <span>{f.term}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Database Viewer Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 font-mono">{activeMeta.filename}</span>
            <span className="text-[11px] text-slate-500">· Selected dataset preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDatabaseJSON}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadDatabase}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full DB</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-[11px] font-mono leading-relaxed max-h-96">
          <pre>{JSON.stringify({
            dataset: activeMeta.filename,
            sourceRepo: activeMeta.sourceRepo,
            gradeLevel: activeMeta.gradeLevel,
            totalStudents: activeMeta.totalStudents,
            samplePreview: (studentsJson as Student[]).filter(s =>
              s.gradeLevel.toLowerCase().includes(activeMeta.gradeLevel.toLowerCase().slice(0, 4))
            ).slice(0, 3)
          }, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
