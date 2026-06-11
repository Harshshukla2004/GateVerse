/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SyllabusTopic } from '../types';
import { BookOpen, HelpCircle, Code, Award, CheckCircle, HelpCircle as FaqIcon, AlertTriangle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import AdPlaceholder from './AdPlaceholder';

interface StudyContentPageProps {
  topic: SyllabusTopic;
  subjectName: string;
  branchName: string;
  onBack?: () => void;
}

export default function StudyContentPage({ topic, subjectName, branchName, onBack }: StudyContentPageProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      {/* Breadcrumbs / Back button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </button>
        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
          {branchName} / {subjectName}
        </span>
      </div>

      {/* Ad top */}
      <AdPlaceholder slot="study-top-banner" format="leaderboard" className="mb-8" />

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4.5xl font-black text-slate-900 dark:text-zinc-50 leading-tight tracking-tight">
          {topic.name}
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 font-medium">
          Comprehensive Study Notes | Solved Numericals | Previous GATE Question Discussion
        </p>
      </div>

      {/* Core Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Lesson Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Theory */}
          <section className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              1. Theoretical Principles
            </h2>
            <div className="text-slate-600 dark:text-zinc-300 antialiased text-sm leading-relaxed space-y-4">
              <p>{topic.theory}</p>
              <p className="text-xs bg-slate-50 dark:bg-zinc-900 p-3 rounded-lg border-l-4 border-indigo-500 text-slate-500 dark:text-zinc-400 font-medium">
                Note: When reviewing this unit, always pay critical attention to the boundary interfaces, coordinate grids, and transform constraints. In GATE, conceptual variables are often altered along boundary discontinuities to test basic knowledge.
              </p>
            </div>
          </section>

          {/* Section 2: Important formulas */}
          <section className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <Code className="w-5 h-5 text-purple-600" />
              2. Master Formula Chest
            </h2>
            
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-6">
              Learn, visualize and memorize these equations. They represent the quickest analytical paths to NAT calculations:
            </p>

            <div className="space-y-4">
              {topic.formulas.map((form, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-zinc-700 rounded-xl p-4 bg-slate-50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md transition-all">
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">{form.label}</span>
                  <div className="bg-white dark:bg-zinc-950 p-4 rounded-lg text-center shadow-inner overflow-x-auto my-2 border border-slate-100 dark:border-zinc-800">
                    <p className="font-mono text-indigo-600 dark:text-indigo-400 text-sm md:text-base font-medium select-all">
                      {form.formula}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2">{form.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ad In-Between */}
          <AdPlaceholder slot="study-middle-native" format="auto" />

          {/* Section 3: Solved Examples */}
          <section className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              3. Step-by-Step Solved Numericals
            </h2>

            <div className="space-y-6">
              {topic.examples.map((ex, idx) => (
                <div key={idx} className="border-l-4 border-green-500 pl-4 space-y-3">
                  <div className="bg-slate-50 dark:bg-zinc-900/30 p-3 rounded-lg">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Example Problem #{idx+1}</h4>
                    <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100 mt-1">{ex.problem}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Detailed Solution:</h4>
                    <div 
                      className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-green-500/5 dark:bg-green-500/10 p-4 rounded-xl border border-green-500/10 whitespace-pre-wrap font-mono"
                    >
                      {ex.solution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: PYQ Discussion */}
          <section className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-700/50 pb-2">
              <Award className="w-5 h-5 text-amber-500" />
              4. Authentic GATE PYQ Discussion
            </h2>

            <div className="space-y-6">
              {topic.pyqs.map((pq, idx) => (
                <div key={idx} className="bg-amber-500/5 dark:bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2">
                    <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded">
                      GATE Previous Paper Question
                    </span>
                    <span className="text-[10px] font-black text-slate-600 dark:text-zinc-300">
                      Year: {pq.year}
                    </span>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-100 leading-relaxed font-mono">
                    {pq.question}
                  </p>

                  <div className="pt-2">
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      <strong className="text-green-600">Correct Answer:</strong> <span className="font-mono bg-white dark:bg-zinc-900 border px-2 py-0.5 rounded text-slate-800 dark:text-zinc-100 ml-1 font-bold">{pq.answer}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-zinc-300 mt-2 whitespace-pre-line leading-relaxed border-t border-dashed border-gray-200 dark:border-zinc-700 pt-2">
                      <strong className="text-indigo-500 uppercase tracking-wider text-[10px] block mb-1">Topper's Explanation:</strong>
                      {pq.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Panel: Common Mistakes & FAQs */}
        <div className="space-y-8">
          
          {/* Common Mistakes */}
          <div className="bg-red-500/5 dark:bg-red-500/10 border-2 border-red-500/30 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Silly Traps & Common Errors
            </h3>
            <ul className="space-y-4 text-xs text-slate-700 dark:text-zinc-300 list-disc list-inside leading-relaxed">
              {topic.mistakes.map((mistake, idx) => (
                <li key={idx} className="marker:text-red-500 pl-1">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>

          {/* Ad unit sidebar */}
          <AdPlaceholder slot="study-sidebar-square" format="rectangle" />

          {/* FAQS Accordion */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b border-gray-100 dark:border-zinc-700 pb-2">
              <FaqIcon className="w-4 h-4 text-blue-600" />
              Frequently Asked Doubts
            </h3>

            <div className="space-y-2">
              {topic.faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-zinc-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-3 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-750 transition-colors flex items-center justify-between gap-2"
                  >
                    <span>{faq.q}</span>
                    <span className="text-slate-400">{openFaqIdx === idx ? "−" : "+"}</span>
                  </button>
                  {openFaqIdx === idx && (
                    <div className="p-3 bg-slate-50 dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-850 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Back button bottom */}
      <div className="border-t border-gray-100 dark:border-zinc-700/50 mt-12 pt-6 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-zinc-800 border dark:border-zinc-700 text-slate-800 dark:text-zinc-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-700 px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Completed Section? Back to Subjects list
        </button>
      </div>
    </motion.div>
  );
}
