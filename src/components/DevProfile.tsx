/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { Mail, Linkedin, Github, FileText, Send, Award, Phone, CheckCircle, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function DevProfile() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleDownloadResume = () => {
    // Elegant system-generated CSV or mock Resume document
    const blob = new Blob([
      `HARSH SHUKLA\nGATE Preparation & ECE Web Coder\nEmail: iamharsh.shukla2004@gmail.com\n\nJOURNEY OUTLINE:\nB.Tech in Electronics & Communication Engineering.\nCreator of GATEVerse platform with full ECE Syllabus trackers, Dynamic textbook content nodes and a full Computer-Based Mock Testing platform.\n\nSKILLS:\n- Core: React + TypeScript, Tailwind CSS, State Management\n- ECE: Signals & Systems, Analog electronic logic, Network math.\n\nThank you for checking out GATEVerse!`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Harsh_Shukla_GATEVerse_Resume.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const skills = [
    "React (TypeScript)", "Tailwind CSS", "Data Analysis", "Signals & Control theory", 
    "Analog & Digital logic designs", "Mock Exam Strategy", "Engineering Mathematics"
  ];

  const projects = [
    {
      title: "GATEVerse Portal",
      desc: "Full-stack client-architectured portal for multiple branches with ECE focus, dynamic question upload interfaces, timer mechanics, and SEO components.",
      tech: ["React", "TypeScript", "Tailwind State", "Local Store"]
    },
    {
      title: "Virtual Gate CBT Simulator",
      desc: "A fully calibrated high-fidelity gateway testing platform conforming to IIT computer test portals, tracking scores, unanswered parameters, and calculators.",
      tech: ["Math logic", "React Hooks", "SVG Stats"]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-12 text-white shadow-xl relative overflow-hidden mb-12">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
          <GraduationCap className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Placeholder */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white overflow-hidden bg-slate-300 dark:bg-zinc-800 flex items-center justify-center text-indigo-700 text-5xl font-extrabold shadow-lg">
              HS
            </div>
            <span className="absolute bottom-1 right-2 bg-green-400 p-2 border-2 border-white rounded-full">
              <span className="block w-2.5 h-2.5 bg-green-600 rounded-full animate-ping"></span>
            </span>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Harsh Shukla</h1>
            <p className="text-lg md:text-xl text-indigo-100 mt-2 font-medium">Electronics & Communication Engineering Student</p>
            <p className="text-sm text-indigo-200 mt-1">Creator of GATEVerse | GATE Aspirant</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <button 
                onClick={handleDownloadResume} 
                className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-zinc-100 transition-all font-semibold px-5 py-2.5 rounded-xl text-sm shadow-md"
              >
                <FileText className="w-4 h-4" />
                Download Resume
              </button>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 bg-indigo-800 text-white hover:bg-indigo-900 transition-all font-semibold px-4 py-2.5 rounded-xl text-sm border border-indigo-500/50"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 bg-indigo-800 text-white hover:bg-indigo-900 transition-all font-semibold px-4 py-2.5 rounded-xl text-sm border border-indigo-500/50"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Journey & Specs */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-500" />
              GATE ECE Preparation Journey
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-zinc-300 leading-relaxed text-sm">
              <p>
                My name is <strong>Harsh Shukla</strong>. As an ECE student preparing for the GATE examination, I recognized a critical barrier: high-quality revision resources, comprehensive subject-wise guides, and authentic testing templates are often locked behind steep paywalls.
              </p>
              <p>
                To solve this, I designed <strong>GATEVerse</strong>. This platform is a fully responsive, fast-loading, and mobile-first educational hub designed to carry complete topic syllabus breakdowns for core ECE lines like signals, analog, control feedback, and electromagnetics.
              </p>
              <p>
                By building this on a rigid JSON and localStorage pipeline, we make it simple to track progress, upload questions dynamically via the admin console, and run CBT mock tests at absolutely zero cost.
              </p>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white dark:bg-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-100 mb-4">Engineering Projects & Creations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="border border-slate-100 dark:border-zinc-700 p-4 rounded-xl hover:border-blue-500 transition-all bg-slate-50 dark:bg-zinc-900">
                  <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm">{proj.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.tech.map((t, i) => (
                      <span key={i} className="text-[10px] font-mono bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Skills & Contact Form */}
        <div className="space-y-8">
          {/* Skills Card */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-4 text-center sm:text-left">Tech & Core Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-xs bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Developer */}
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Direct Message
            </h2>
            
            {submitted ? (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-xl text-center text-green-700 dark:text-green-300">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-xs font-semibold">Message Submitted Successfully!</p>
                <p className="text-[10px] text-green-500 mt-1">Thank you, Harsh will reply soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    value={formState.name} 
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-zinc-100" 
                    placeholder="E.g., Anjali Sharma" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formState.email} 
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    required
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-zinc-100" 
                    placeholder="anjali@gmail.com" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Inquiry / Message</label>
                  <textarea 
                    rows={3} 
                    value={formState.message}
                    onChange={e => setFormState({ ...formState, message: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-zinc-100" 
                    placeholder="Ask study support or send feedback..." 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  Send to Harsh
                </button>
              </form>
            )}
            
            <div className="border-t border-slate-100 dark:border-zinc-700 mt-6 pt-4 text-center">
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Phone className="w-2.5 h-2.5" />
                Priority Mail: iamharsh.shukla2004@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
