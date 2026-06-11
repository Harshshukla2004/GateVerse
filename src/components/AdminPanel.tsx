/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { savePYQ, fetchAllPYQs } from '../data/pyqs';
import { saveNoteItem, fetchAllNotes } from '../data/notes';
import { Upload, PlusCircle, Check, HelpCircle, FileText, Settings, Award } from 'lucide-react';
import { PYQ, NoteItem } from '../types';

interface AdminPanelProps {
  onRefreshData?: () => void;
}

export default function AdminPanel({ onRefreshData }: AdminPanelProps) {
  // Tabs: 'pyq' or 'notes'
  const [activeTab, setActiveTab] = useState<'pyq' | 'notes'>('pyq');
  const [successMsg, setSuccessMsg] = useState('');

  // PYQ Form State
  const [pyqForm, setPyqForm] = useState({
    branch: 'ECE',
    year: 2026,
    subject: 'Signals and Systems',
    questionNumber: 1,
    questionText: '',
    optA: '',
    optB: '',
    optC: '',
    optD: '',
    correctAnswer: 'A',
    explanation: '',
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    topic: 'Continuous-Time and Discrete-Time Signals Classification'
  });

  // Notes Form State
  const [noteForm, setNoteForm] = useState({
    branch: 'ECE',
    subject: 'Signals and Systems',
    topic: 'Continuous-Time and Discrete-Time Signals Classification',
    title: '',
    type: 'Revision Note' as NoteItem['type'],
    fileSize: '1.5 MB'
  });

  // Mock PDF files simulation
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handlePYQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pyqForm.questionText || !pyqForm.optA || !pyqForm.optB) {
      alert("Please fill in question text and options.");
      return;
    }

    const newPYQ: PYQ = {
      id: `custom-pyq-${Date.now()}`,
      branch: pyqForm.branch,
      year: Number(pyqForm.year),
      subject: pyqForm.subject,
      questionNumber: Number(pyqForm.questionNumber),
      questionText: pyqForm.questionText,
      options: [pyqForm.optA, pyqForm.optB, pyqForm.optC, pyqForm.optD],
      correctAnswer: pyqForm.correctAnswer === 'A' ? pyqForm.optA : 
                     pyqForm.correctAnswer === 'B' ? pyqForm.optB : 
                     pyqForm.correctAnswer === 'C' ? pyqForm.optC : pyqForm.optD,
      explanation: pyqForm.explanation || "No custom explanation provided yet.",
      difficulty: pyqForm.difficulty,
      topic: pyqForm.topic
    };

    savePYQ(newPYQ);
    setSuccessMsg(`Successfully uploaded PYQ Question #${newPYQ.questionNumber} to ${newPYQ.subject}! Fully indexed!`);
    
    // Reset Question Num for easily continuous typing
    setPyqForm(prev => ({
      ...prev,
      questionNumber: prev.questionNumber + 1,
      questionText: '',
      optA: '',
      optB: '',
      optC: '',
      optD: '',
      explanation: ''
    }));

    if (onRefreshData) onRefreshData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title) {
      alert("Please provide notes title.");
      return;
    }

    const newNote: NoteItem = {
      id: `custom-note-${Date.now()}`,
      branch: noteForm.branch,
      subject: noteForm.subject,
      topic: noteForm.topic,
      title: noteForm.title,
      type: noteForm.type,
      fileSize: noteForm.fileSize || "1.4 MB",
      dateAdded: new Date().toISOString().split('T')[0],
      downloadUrl: "#",
      isUserUploaded: true
    };

    saveNoteItem(newNote);
    setSuccessMsg(`Uploaded ${noteForm.type}: "${noteForm.title}" - Automatically generated view page!`);
    setNoteForm(prev => ({ ...prev, title: '' }));
    setUploadedFileName('');

    if (onRefreshData) onRefreshData();
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleMockPdfDrop = () => {
    const mockFiles = [
      "Signals_LTI_Complete_Notes.pdf",
      "Network_AC_Transients_Formula_Sheet.pdf",
      "Electromagnetics_Smith_Chart_Guide.pdf",
      "GATE_ECE_2025_Solved_Official.pdf"
    ];
    const chosen = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setUploadedFileName(chosen);
    // Auto populate note title if empty
    if (!noteForm.title) {
      setNoteForm(prev => ({ ...prev, title: chosen.replace('.pdf', '').replace(/_/g, ' ') }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Admin header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white mb-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="bg-indigo-600/30 text-indigo-400 border border-indigo-500/50 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              GATEVerse Admin Station
            </span>
            <h1 className="text-2xl font-black mt-2">Resource Upload & Generation console</h1>
            <p className="text-slate-400 text-xs mt-1">
              Add PYQs, upload theory PDFs, study blueprints, or hand-made formula sheets. System registers them into Local Database structures, forming fast, dynamic sitemap nodes automatically.
            </p>
          </div>
          <Settings className="w-10 h-10 text-slate-800 animate-spin-slowHidden sm:block" />
        </div>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="bg-green-500 text-white p-3.5 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Selector Tabs */}
      <div className="flex border-b border-gray-200 dark:border-zinc-700 mb-8">
        <button
          onClick={() => { setActiveTab('pyq'); setSuccessMsg(''); }}
          className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'pyq'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Add Structured PYQ Question
        </button>
        <button
          onClick={() => { setActiveTab('notes'); setSuccessMsg(''); }}
          className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'notes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload PDF Notes & Formula Sheets
        </button>
      </div>

      {activeTab === 'pyq' ? (
        <form onSubmit={handlePYQSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-zinc-700 space-y-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-700 pb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            IIT Standard PYQ Metadata Input
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Target Branch</label>
              <select
                value={pyqForm.branch}
                onChange={e => setPyqForm({ ...pyqForm, branch: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="ECE">ECE - Electronics & Telecom</option>
                <option value="CSE">CSE - Computer Science</option>
                <option value="EE">EE - Electrical Engg</option>
                <option value="ME">ME - Mechanical Engg</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Exam Year</label>
              <input
                type="number"
                min={2000}
                max={2027}
                value={pyqForm.year}
                onChange={e => setPyqForm({ ...pyqForm, year: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Question Number</label>
              <input
                type="number"
                min={1}
                max={65}
                value={pyqForm.questionNumber}
                onChange={e => setPyqForm({ ...pyqForm, questionNumber: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Subject</label>
              <select
                value={pyqForm.subject}
                onChange={e => setPyqForm({ ...pyqForm, subject: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="Signals and Systems">Signals and Systems</option>
                <option value="Network Theory">Network Theory</option>
                <option value="Analog Electronics">Analog Electronics</option>
                <option value="Digital Electronics">Digital Electronics</option>
                <option value="Communication Systems">Communication Systems</option>
                <option value="Control Systems">Control Systems</option>
                <option value="Electromagnetics">Electromagnetics</option>
                <option value="Algorithms and Data Structures">Algorithms and Data Structures</option>
                <option value="Power Systems and Grid Analysis">Power Systems and Grid Analysis</option>
                <option value="Thermodynamics and Heat Cycles">Thermodynamics and Heat Cycles</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Difficulty Metric</label>
              <select
                value={pyqForm.difficulty}
                onChange={e => setPyqForm({ ...pyqForm, difficulty: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="Easy">Easy (Formula Direct)</option>
                <option value="Medium">Medium (Analytical Conceptual)</option>
                <option value="Hard">Hard (In-depth Numerical NAT)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Concept Topic Alignment</label>
            <input
              type="text"
              value={pyqForm.topic}
              onChange={e => setPyqForm({ ...pyqForm, topic: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              placeholder="e.g. Linear Time-Invariant (LTI) Systems and Impulse Response"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Question Statement Text (Markdown compatible)</label>
            <textarea
              rows={4}
              value={pyqForm.questionText}
              onChange={e => setPyqForm({ ...pyqForm, questionText: e.target.value })}
              required
              placeholder="Type question statement here. Math notations can be typed mathematically like: Quality Factor Q = 1/R * sqrt(L/C)"
              className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-700 dark:text-zinc-300">Answer Options</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-gray-500 mb-1 block">Option A</label>
                <input
                  type="text"
                  value={pyqForm.optA}
                  onChange={e => setPyqForm({ ...pyqForm, optA: e.target.value })}
                  required
                  placeholder="Insert choice A"
                  className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-500 mb-1 block">Option B</label>
                <input
                  type="text"
                  value={pyqForm.optB}
                  onChange={e => setPyqForm({ ...pyqForm, optB: e.target.value })}
                  required
                  placeholder="Insert choice B"
                  className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-500 mb-1 block">Option C (Leave blank for True/False)</label>
                <input
                  type="text"
                  value={pyqForm.optC}
                  onChange={e => setPyqForm({ ...pyqForm, optC: e.target.value })}
                  placeholder="Insert choice C"
                  className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-500 mb-1 block">Option D (Leave blank for True/False)</label>
                <input
                  type="text"
                  value={pyqForm.optD}
                  onChange={e => setPyqForm({ ...pyqForm, optD: e.target.value })}
                  placeholder="Insert choice D"
                  className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Correct Answer Coordinate</label>
              <select
                value={pyqForm.correctAnswer}
                onChange={e => setPyqForm({ ...pyqForm, correctAnswer: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="A">Option A is correct</option>
                <option value="B">Option B is correct</option>
                <option value="C">Option C is correct</option>
                <option value="D">Option D is correct</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Step-by-Step Technical Explanation</label>
            <textarea
              rows={3}
              value={pyqForm.explanation}
              onChange={e => setPyqForm({ ...pyqForm, explanation: e.target.value })}
              placeholder="Detail the formulas involved, the integration limits, or truth-table reductions applied to derive correct bounds."
              className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-zinc-100"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Validate, Index and Deploy PYQ
          </button>
        </form>
      ) : (
        <form onSubmit={handleNoteSubmit} className="bg-white dark:bg-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-zinc-700 space-y-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 border-b border-gray-100 dark:border-zinc-700 pb-3 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            PDF & Note Resources Deployment
          </h2>

          <div className="border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-zinc-950 cursor-pointer hover:border-indigo-500 transition-all" onClick={handleMockPdfDrop}>
            <Upload className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">Drag & Drop exam PDF resource here, or touch to simulate local upload</p>
            <p className="text-[10px] text-slate-400 mt-1">Accepts: .pdf, .docx, .zip (Max limit 20MB)</p>
            
            {uploadedFileName && (
              <div className="mt-4 p-2 bg-indigo-50 dark:bg-zinc-900 border border-indigo-200 dark:border-zinc-700 rounded-lg inline-flex items-center gap-2 text-xs text-indigo-700 dark:text-zinc-300">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold">{uploadedFileName}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Target Engineering Branch</label>
              <select
                value={noteForm.branch}
                onChange={e => setNoteForm({ ...noteForm, branch: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="ECE">ECE - Electronics & Telecom</option>
                <option value="CSE">CSE - Computer Science</option>
                <option value="EE">EE - Electrical Engg</option>
                <option value="ME">ME - Mechanical Engg</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Resource Category</label>
              <select
                value={noteForm.type}
                onChange={e => setNoteForm({ ...noteForm, type: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="Revision Note">Revision Note (Detailed Chapters)</option>
                <option value="Short Note">Short Note (Flash Summary)</option>
                <option value="Formula Sheet">Formula Sheet (Bento Equation sheet)</option>
                <option value="Handwritten">Handwritten Class Notes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Target Subject Category</label>
              <select
                value={noteForm.subject}
                onChange={e => setNoteForm({ ...noteForm, subject: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              >
                <option value="Signals and Systems">Signals and Systems</option>
                <option value="Network Theory">Network Theory</option>
                <option value="Analog Electronics">Analog Electronics</option>
                <option value="Digital Electronics">Digital Electronics</option>
                <option value="Communication Systems">Communication Systems</option>
                <option value="Control Systems">Control Systems</option>
                <option value="Electromagnetics">Electromagnetics</option>
                <option value="Algorithms and Data Structures">Algorithms and Data Structures</option>
                <option value="Power Systems and Grid Analysis">Power Systems and Grid Analysis</option>
                <option value="Thermodynamics and Heat Cycles">Thermodynamics and Heat Cycles</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Concept Topic</label>
              <input
                type="text"
                value={noteForm.topic}
                onChange={e => setNoteForm({ ...noteForm, topic: e.target.value })}
                placeholder="e.g., Continuous-Time Fourier Transform"
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Custom Display Title</label>
            <input
              type="text"
              value={noteForm.title}
              required
              onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
              className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
              placeholder="e.g., LTI Convolution Integral Solved Problems Package"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Simulated File Size</label>
              <input
                type="text"
                value={noteForm.fileSize}
                onChange={e => setNoteForm({ ...noteForm, fileSize: e.target.value })}
                className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                placeholder="e.g. 1.8 MB"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Index Note Document & Generate Public Page
          </button>
        </form>
      )}
    </div>
  );
}
