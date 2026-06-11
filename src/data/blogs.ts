/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "ece-preparation-strategy-2027",
    title: "Comprehensive 10-Month Study Plan to Crack GATE ECE with Under 100 Rank",
    category: "Preparation Strategy",
    excerpt: "Discover the step-by-step topic hierarchy, recommended standard textbooks, and revision frequency recommended by top GATE ECE rankers to maximize concepts and speed.",
    content: `## The Ultimate Roadmap to a Double-Digit Rank in GATE ECE

Securing a top rank in Electronics & Communication Engineering demands structured mathematical depth. ECE has historically been one of the toughest, yet highest-scoring, branches in the GATE exam. In this guide, we break down a 10-month master plan used by toppers to secure under-100 ranks.

### Phase 1: High Yield & Low Barrier Subjects (Months 1-3)
*   **Engineering Mathematics & General Aptitude:** Do not leave these until December! They constitute exactly **28% of the total marks** (13 marks Maths + 15 marks Aptitude). They represent the highest ROI on your preparation time.
*   **Network Theory:** Your absolute foundation. Master nodal analysis, complex steady-state AC phasors, resonance equations, and transient calculations.
*   **Digital Electronics:** Extremely scoring and structured. Focus on Karnaugh maps, state reduction techniques in counters, and numerical logic conversions.

### Phase 2: Core Hardware & Math Engines (Months 4-7)
*   **Signals & Systems:** Focus heavily on Laplace, Z-Transform, and Fourier properties. If your concept of convolution and ROC (Region of Convergence) is clear, Control Systems will feel like a breeze.
*   **Control Systems:** Very direct and algorithmic. Master root locus angles, polar stability plots, and State-Space State Transition Matrices (STM).
*   **Analog Electronics:** Keep Op-Amps as your top priority. Ensure you master small-signal models of BJTs and MOSFETs. Do not get lost in extreme multi-stage BJT math, but focus heavily on single-stage gains and active filters.

### Phase 3: The Rank Makers (Months 8-9)
*   **Communication Systems:** Deals with random processes, noise analysis, BPSK/QPSK signal constellations, and Shannon's capacity equations. Practice 2-mark NAT questions from here daily.
*   **Electromagnetics (EMFT):** The Achilles' heel of ECE aspirants. Focus on transmission lines, Smith Chart matching, and Rectangular Waveguides TE/TM cutoff frequencies rather than deriving full vector waves.

### Phase 4: Test Series & Error Logging (Month 10)
Take full-length tests twice weekly. The goal is not just score monitoring, but checking your **Error Log**. Record every calculation mistake, silly formula confusion, and time management hazard.`,
    author: "Harsh Shukla",
    date: "2026-06-01",
    readTime: "6 mins read",
    tags: ["ECE", "Preparation", "Study Plan", "Topper Guide"]
  },
  {
    id: "psu-recruitment-through-gate",
    title: "PSU Recruitment via GATE: Eligibility, Package, and Cutoffs",
    category: "PSU Recruitment",
    excerpt: "An exhaustive compilation of major PSUs (ONGC, IOCL, BARC, NTPC) recruiting through the GATE scorecard. Understand pay scales, interview processes, and gate score criteria.",
    content: `## Gateway to Navratna and Maharatna PSUs

If you are aiming for high job stability and a lucrative career, recruiting through GATE into Public Sector Undertakings (PSUs) is an exceptional track.

### Who recruits through GATE?
1.  **Maharatnas:** IOCL, ONGC, NTPC, GAIL, HPCL, BPCL, BHEL.
2.  **Navratnas:** BEL, HAL, PowerGrid, Oil India, NALCO.
3.  **Research Organizations:** BARC, ISRO, DRDO (recruit via GATE or separate test).

### Expected Salary Packages (PSUs)
Most Maharatna PSUs offer packages ranging from **12 LPA to 20 LPA** (Cost to Company), which includes basic pay starting at ₹60,000/month, HRA/Lease, medical coverage, and performance-linked bonuses.

### GATE Score Cutoffs for General (ECE/CSE/EE)
*   **IOCL/ONGC/PowerGrid:** Usually requires an All India Rank (AIR) of **under 200** to guarantee an interview call.
*   **NTPC/BEL:** Call letters are often issued to ranks **up to 400-500** depending on student intakes and branching vacancies.`,
    author: "Harsh Shukla",
    date: "2026-06-05",
    readTime: "5 mins read",
    tags: ["PSU", "Jobs", "ONGC", "IOCL", "Salary"]
  },
  {
    id: "gate-ece-exam-analysis-key-takeaways",
    title: "GATE ECE Recent Exam Trends and Subject-wise Marks Weightage",
    category: "Exam Analysis",
    excerpt: "Detailed subject mark breakdowns and analysis of recent papers. Understand why Numerical Answer Type (NAT) questions are deciding the rank cutoffs.",
    content: `## Shifting Trends in GATE ECE Papers

Analyzing previous year papers shows an intensive shift towards **Numerical Answer Type (NAT)** and **Multiple Select Questions (MSQs)**. Traditional multiple choice questions are no longer sufficient to secure top ranks.

### Subject-wise Marks Distribution (GATE ECE)
Based on analytical paper grids, here is the average weightage of subjects:
*   **General Aptitude:** 15 Marks (Fixed)
*   **Engineering Mathematics:** 13 Marks (Fixed)
*   **Communications:** 10 - 12 Marks
*   **Analog Circuits:** 8 - 10 Marks
*   **Electromagnetics:** 8 - 9 Marks
*   **Signals and Systems:** 8 - 9 Marks
*   **Control Systems:** 7 - 8 Marks
*   **Network Theory:** 6 - 8 Marks
*   **Digital Circuits:** 5 - 6 Marks
*   **Electronic Devices (EDC):** 6 - 8 Marks

### Strategic Action Points
1.  **MSQ Defense:** Multiple Select Questions require absolute precision. You only get marks if ALL correct parameters are checked. Focus on conceptual textbook statements.
2.  **Virtual Calculator Speed:** NAT questions have no negative marks, but any typo results in 0. Practice inputs using only your mouse pointer as keyboard inputs are locked during the exam!`,
    author: "Harsh Shukla",
    date: "2026-06-10",
    readTime: "4 mins read",
    tags: ["Weightage", "Analysis", "ECE", "Cutoff Trends"]
  }
];
