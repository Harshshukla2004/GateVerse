/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoteItem } from '../types';

export const SEED_NOTES: NoteItem[] = [
  {
    id: "note-1",
    branch: "ECE",
    subject: "Signals and Systems",
    topic: "Continuous-Time and Discrete-Time Signals Classification",
    title: "Conjugate Symmetric and Periodic Signal Integrals",
    type: "Revision Note",
    fileSize: "1.2 MB",
    dateAdded: "2026-04-12",
    downloadUrl: "#"
  },
  {
    id: "note-2",
    branch: "ECE",
    subject: "Signals and Systems",
    topic: "Fourier Series Representation of Continuous-Time Periodic Signals",
    title: "Exponential Fourier Coefficients & Symmetry Conditions Cheat-sheet",
    type: "Short Note",
    fileSize: "450 KB",
    dateAdded: "2026-05-01",
    downloadUrl: "#"
  },
  {
    id: "note-3",
    branch: "ECE",
    subject: "Signals and Systems",
    topic: "Sampling Theorem and Nyquist Rate, Aliasing Effects",
    title: "Nyquist Rate and Filtering Formulas Quick Card",
    type: "Formula Sheet",
    fileSize: "680 KB",
    dateAdded: "2026-05-15",
    downloadUrl: "#"
  },
  {
    id: "note-4",
    branch: "ECE",
    subject: "Network Theory",
    topic: "Thevenin's and Norton's Theorems for AC & DC Circuits",
    title: "Dependent Source R_th Calculation Methods",
    type: "Handwritten",
    fileSize: "3.4 MB",
    dateAdded: "2026-05-20",
    downloadUrl: "#"
  },
  {
    id: "note-5",
    branch: "ECE",
    subject: "Analog Electronics",
    topic: "Operational Amplifiers (Op-Amp) Characteristics & Ideal Model",
    title: "Virtual Ground & Golden Op-Amp Rules Core Cheat-sheet",
    type: "Formula Sheet",
    fileSize: "950 KB",
    dateAdded: "2026-06-02",
    downloadUrl: "#"
  },
  {
    id: "note-6",
    branch: "CSE",
    subject: "Algorithms and Data Structures",
    topic: "Asymptotic Notations & Complexity",
    title: "Recurrence Tree & Master Theorem Simplified",
    type: "Short Note",
    fileSize: "310 KB",
    dateAdded: "2026-06-03",
    downloadUrl: "#"
  }
];

export function fetchAllNotes(): NoteItem[] {
  try {
    const custom = localStorage.getItem('gateverse_uploaded_notes');
    if (custom) {
      const parsed: NoteItem[] = JSON.parse(custom);
      return [...SEED_NOTES, ...parsed];
    }
  } catch (err) {
    console.error("Failed to fetch custom notes from storage", err);
  }
  return SEED_NOTES;
}

export function saveNoteItem(note: NoteItem): void {
  try {
    const list = fetchAllNotes();
    const customOnly = list.filter(item => !SEED_NOTES.some(s => s.id === item.id));
    customOnly.push(note);
    localStorage.setItem('gateverse_uploaded_notes', JSON.stringify(customOnly));
  } catch (err) {
    console.error("Failed to register new Notes metadata", err);
  }
}
