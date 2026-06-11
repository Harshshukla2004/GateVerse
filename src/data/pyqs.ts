/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PYQ } from '../types';

export const SEED_PYQS: PYQ[] = [
  {
    id: "ece-2024-q1",
    branch: "ECE",
    year: 2024,
    subject: "Signals and Systems",
    questionNumber: 1,
    questionText: "Which of the following continuous-time systems characterized by their input-output relations is linear and time-invariant?",
    options: [
      "y(t) = t x(t)",
      "y(t) = x^2(t)",
      "y(t) = x(t - 4) + x(2 - t)",
      "y(t) = \\int_{-\\infty}^{t} e^{-5(t-\\tau)} x(\\tau) d\\tau"
    ],
    correctAnswer: "y(t) = \\int_{-\\infty}^{t} e^{-5(t-\\tau)} x(\\tau) d\\tau",
    explanation: "Option D represents a convolution integral: y(t) = x(t) * h(t) where the impulse response h(t) = e^{-5t} u(t). Any system that can be written strictly as a convolution integral is mathematically linear and time-invariant.",
    difficulty: "Medium",
    topic: "Linear Time-Invariant (LTI) Systems and Impulse Response"
  },
  {
    id: "ece-2023-q12",
    branch: "ECE",
    year: 2023,
    subject: "Signals and Systems",
    questionNumber: 12,
    questionText: "Find the Nyquist sampling rate (in Hz) for the signal x(t) = 5 \\sin(200 \\pi t) + 12 \\cos(450 \\pi t) \\cos(150 \\pi t).",
    options: [
      "300 Hz",
      "450 Hz",
      "600 Hz",
      "900 Hz"
    ],
    correctAnswer: "600 Hz",
    explanation: "Using trigonometric products: \\cos(450\\pi t)\\cos(150\\pi t) = 0.5 [\\cos(600\\pi t) + \\cos(300\\pi t)]. Thus, the signal consists of frequencies of 100 Hz (from 200\\pi t), 300 Hz (from 600\\pi t), and 150 Hz (from 300\\pi t). The highest frequency is f_max = 300 Hz. The Nyquist sampling rate is 2 * f_max = 600 Hz.",
    difficulty: "Hard",
    topic: "Sampling Theorem and Nyquist Rate, Aliasing Effects"
  },
  {
    id: "ece-2024-q5",
    branch: "ECE",
    year: 2024,
    subject: "Network Theory",
    questionNumber: 5,
    questionText: "In a series RLC resonance circuit, if the inductance is L = 2 Henry, capacitance is C = 8 microfarads, and resistance is R = 10 Ohm, calculate the Quality Factor (Q) of the network.",
    options: [
      "25",
      "50",
      "100",
      "250"
    ],
    correctAnswer: "50",
    explanation: "For a series RLC circuit, Quality Factor is: Q = (1 / R) * \\sqrt{L / C}. Substituting values: Q = (1 / 10) * \\sqrt{2 / (8 * 10^{-6})} = 0.1 * \\sqrt{250000} = 0.1 * 500 = 50.",
    difficulty: "Easy",
    topic: "Resonance in Series & Parallel RLC Networks (Q-Factor, Bandwidth)"
  },
  {
    id: "ece-2022-q15",
    branch: "ECE",
    year: 2022,
    subject: "Network Theory",
    questionNumber: 15,
    questionText: "An ideal independent voltage source V_s is in series with a 4 Ohm resistor. This combination is connected across the terminals of a linear load. If the open-circuit voltage at terminals is 12V and the short circuit current is 3A, the internal series resistance of this network is:",
    options: [
      "2 Ohm",
      "4 Ohm",
      "6 Ohm",
      "8 Ohm"
    ],
    correctAnswer: "4 Ohm",
    explanation: "By definition, the Thevenin equivalent resistance across the terminals is R_th = V_oc / I_sc = 12 / 3 = 4 Ohm.",
    difficulty: "Easy",
    topic: "Thevenin's and Norton's Theorems for AC & DC Circuits"
  },
  {
    id: "ece-2024-q22",
    branch: "ECE",
    year: 2024,
    subject: "Analog Electronics",
    questionNumber: 22,
    questionText: "An Operational Amplifier (Op-Amp) is configured as an inverting amplifier with feedback resistance R_f = 100 kOhm and input resistance R_in = 10 kOhm. If the open loop gain of the Op-Amp is infinite, what is the closed-loop voltage gain of this configuration?",
    options: [
      "10",
      "-10",
      "11",
      "-11"
    ],
    correctAnswer: "-10",
    explanation: "For an ideal inverting Op-amplifier, closed loop voltage gain is given by A_v = -R_f / R_in. Sustituting values gives A_v = -100 / 10 = -10.",
    difficulty: "Easy",
    topic: "Operational Amplifiers (Op-Amp) Characteristics & Ideal Model"
  },
  {
    id: "ece-2023-q3",
    branch: "ECE",
    year: 2023,
    subject: "Digital Electronics",
    questionNumber: 3,
    questionText: "Identify the number of 2-to-1 multiplexers required to fully implement a 4-to-1 multiplexer without any external logic gates.",
    options: [
      "1",
      "2",
      "3",
      "4"
    ],
    correctAnswer: "3",
    explanation: "To build a 4-to-1 multiplexer, we need 2 multiplexers in the first stage to select between inputs I0-I1 and I2-I3, and a 3rd multiplexer in the second stage to select between the outputs of the first stage. Total = 3 multiplexers.",
    difficulty: "Medium",
    topic: "Multiplexers, Demultiplexers, Decoders & Logic Implementation"
  },
  {
    id: "cse-2023-q1",
    branch: "CSE",
    year: 2023,
    subject: "Algorithms and Data Structures",
    questionNumber: 1,
    questionText: "What is the worst-case time complexity of sorting n elements using the QuickSort algorithm when the pivot is always chosen as the smallest or largest element?",
    options: [
      "O(n log n)",
      "O(n)",
      "O(n^2)",
      "O(2^n)"
    ],
    correctAnswer: "O(n^2)",
    explanation: "If the pivot is always the smallest or largest element, the partitioning becomes rawly unbalanced. The recurrence is T(n) = T(n-1) + T(0) + O(n), which yields O(n^2).",
    difficulty: "Easy",
    topic: "Asymptotic Notations & Complexity"
  },
  {
    id: "ee-2022-q7",
    branch: "EE",
    year: 2022,
    subject: "Power Systems and Grid Analysis",
    questionNumber: 7,
    questionText: "Which sequence component of impedance is most affected by the presence of a neutral grounding register in a star-connected transformer during a single line-to-ground fault?",
    options: [
      "Positive sequence",
      "Negative sequence",
      "Zero sequence",
      "All sequences equally"
    ],
    correctAnswer: "Zero sequence",
    explanation: "Zero sequence currents must return through the neutral ground path. If a resistor R_n is connected in the neutral wire, it appears as 3*R_n in the zero-sequence impedance network, leaving positive and negative sequences totally unaffected.",
    difficulty: "Medium",
    topic: "Symmetrical and Unsymmetrical Faults"
  }
];

// Read from localStorage to retrieve newly uploaded questions dynamically
export function fetchAllPYQs(): PYQ[] {
  try {
    const custom = localStorage.getItem('gateverse_uploaded_pyqs');
    if (custom) {
      const parsed: PYQ[] = JSON.parse(custom);
      return [...SEED_PYQS, ...parsed];
    }
  } catch (err) {
    console.error("Failed to fetch custom PYQs from local storage", err);
  }
  return SEED_PYQS;
}

// Add a new question to the database
export function savePYQ(pq: PYQ): void {
  try {
    const list = fetchAllPYQs();
    const customOnly = list.filter(item => !SEED_PYQS.some(s => s.id === item.id));
    customOnly.push(pq);
    localStorage.setItem('gateverse_uploaded_pyqs', JSON.stringify(customOnly));
  } catch (err) {
    console.error("Failed to preserve new PYQ item", err);
  }
}
