/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Home as HomeIcon, 
  BookOpen, 
  FileQuestion, 
  FileText, 
  Layers, 
  Award, 
  Activity, 
  CheckSquare, 
  TrendingUp, 
  Briefcase, 
  Calculator, 
  BookOpenCheck, 
  User, 
  Mail, 
  Search, 
  Clock, 
  Sun, 
  Moon, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  Plus, 
  Eye, 
  Info, 
  HelpCircle, 
  ExternalLink, 
  GraduationCap, 
  Target, 
  Shield, 
  FileSignature, 
  Fingerprint, 
  AlertCircle,
  Menu,
  X
} from 'lucide-react';

// Import our custom sub-components
import DevProfile from './components/DevProfile';
import AdminPanel from './components/AdminPanel';
import StudyContentPage from './components/StudyContentPage';
import AdPlaceholder from './components/AdPlaceholder';

// Import our data managers
import { fetchAllPYQs } from './data/pyqs';
import { fetchAllNotes } from './data/notes';
import { ALL_BRANCHES, BRANCHES_DATA, ECE_SUBJECTS, generateECEStudyPageContent } from './data/branches';
import { BLOG_POSTS } from './data/blogs';
import { SyllabusTopic, PYQ, NoteItem, BlogPost } from './types';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('gateverse_theme');
      return stored ? stored === 'dark' : true; // Default dark
    } catch {
      return true;
    }
  });

  // Navigation state: corresponding to "Main Navigation" requested
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Search Engine State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Branch select state
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ece');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('signals-systems');
  
  // Topic Reader state (clicks from subjects or search results go here)
  const [activeTopic, setActiveTopic] = useState<SyllabusTopic | null>(null);
  const [activeTopicSubjectName, setActiveTopicSubjectName] = useState<string>('');

  // Dynamic Content Data state (updates after admin submit)
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  // PYQ Filter states
  const [pyqYearFilter, setPyqYearFilter] = useState<string>('all');
  const [pyqSubjectFilter, setPyqSubjectFilter] = useState<string>('all');
  const [pyqDiffFilter, setPyqDiffFilter] = useState<string>('all');
  const [pyqSearchText, setPyqSearchText] = useState<string>('');
  const [viewingPYQExplanationId, setViewingPYQExplanationId] = useState<string | null>(null);

  // Notes Module filters
  const [noteSubjectFilter, setNoteSubjectFilter] = useState<string>('all');
  const [noteTypeFilter, setNoteTypeFilter] = useState<string>('all');

  // Interactive Syllabus Tracker State (saves in localStorage)
  const [syllabusStatus, setSyllabusStatus] = useState<Record<string, 'todo' | 'progress' | 'done'>>(() => {
    try {
      const stored = localStorage.getItem('gateverse_syllabus_status');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Mock Test State
  const [testState, setTestState] = useState<'lobby' | 'active' | 'completed'>('lobby');
  const [testType, setTestType] = useState<'full' | 'subject'>('full');
  const [testSubjectSelection, setTestSubjectSelection] = useState<string>('Signals and Systems');
  const [testQuestions, setTestQuestions] = useState<PYQ[]>([]);
  const [testCurrentIndex, setTestCurrentIndex] = useState<number>(0);
  const [testUserAnswers, setTestUserAnswers] = useState<Record<string, string>>({}); // pyq.id -> option text
  const [testTaggedReview, setTestTaggedReview] = useState<Record<string, boolean>>({});
  const [testSecondsRemaining, setTestSecondsRemaining] = useState<number>(180 * 60); // 3 hours
  const [testFinalScore, setTestFinalScore] = useState<{
    score: number;
    total: number;
    correct: number;
    wrong: number;
    unanswered: number;
  } | null>(null);

  // Active Blog Post State for details reading
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  // Virtual Calculator State
  const [calcInput, setCalcInput] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');

  // Synchronise global arrays
  const syncData = () => {
    setPyqs(fetchAllPYQs());
    setNotes(fetchAllNotes());
  };

  useEffect(() => {
    syncData();
  }, []);

  // Countdown timer calculation to GATE 2027
  // GATE 2027 is scheduled for approx Saturday Feb 6, 2027
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date("2027-02-06T09:00:00+05:30"); // Indian Standard Time
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock Test timer effect
  useEffect(() => {
    if (testState !== 'active') return;
    if (testSecondsRemaining <= 0) {
      calculateTestResults();
      return;
    }
    const timer = setInterval(() => {
      setTestSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [testSecondsRemaining, testState]);

  // Apply dark mode styling class
  useEffect(() => {
    try {
      localStorage.setItem('gateverse_theme', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  // Save interactive syllabus status changes
  const updateSyllabusStatus = (topicId: string, status: 'todo' | 'progress' | 'done') => {
    const updated = { ...syllabusStatus, [topicId]: status };
    setSyllabusStatus(updated);
    try {
      localStorage.setItem('gateverse_syllabus_status', JSON.stringify(updated));
    } catch {}
  };

  // Virtual scientific calculator support
  const handleCalcPress = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Sanitize mathematical context
        let expr = calcInput
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/sqrt\(/g, "Math.sqrt(")
          .replace(/pi/g, "Math.PI")
          .replace(/e\(/g, "Math.exp(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/\^/g, "**");

        // evaluate using dynamic Javascript math bounds
        const res = new Function(`return ${expr}`)();
        setCalcResult(Number(res).toFixed(6).replace(/\.?0+$/, ""));
      } catch (err) {
        setCalcResult("Expression Error");
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  // Mock test launcher
  const handleStartMockTest = () => {
    const allAvailable = fetchAllPYQs();
    let filteredQuestions = [...allAvailable];

    if (testType === 'subject') {
      filteredQuestions = allAvailable.filter(q => q.subject === testSubjectSelection);
    }

    if (filteredQuestions.length === 0) {
      alert("No verified questions found for this subject selection. Running with standard composite paper instead!");
      filteredQuestions = allAvailable;
    }

    // Shuffle and pack questions
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    setTestQuestions(shuffled.slice(0, 8)); // 8 comprehensive questions for quick preview, customizable!
    setTestCurrentIndex(0);
    setTestUserAnswers({});
    setTestTaggedReview({});
    setTestSecondsRemaining(120 * 60); // 120 minutes for simulated subject test
    setTestState('active');
  };

  const calculateTestResults = () => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    testQuestions.forEach(q => {
      const userAns = testUserAnswers[q.id];
      if (!userAns) {
        unanswered++;
      } else if (userAns === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const marksPerCorrect = 2; // GATE 2-mark simulation
    const negativePerWrong = 2 / 3; // Standard 1/3 negative marking
    const calculatedScore = (correct * marksPerCorrect) - (wrong * negativePerWrong);

    setTestFinalScore({
      score: Number(calculatedScore.toFixed(2)),
      total: testQuestions.length * marksPerCorrect,
      correct,
      wrong,
      unanswered
    });
    setTestState('completed');
  };

  // Navigation link helper
  const navigateToTab = (tabName: string) => {
    setActiveTab(tabName);
    setActiveTopic(null); // Reset detail study notebook view
    setActiveBlog(null); // Reset active blog reader
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Topic Selection Helper (brings you immediately to rich study page)
  const handleOpenTopic = (subjId: string, subjName: string, topicName: string) => {
    const targetTopic = generateECEStudyPageContent(subjId, topicName);
    setActiveTopic(targetTopic);
    setActiveTopicSubjectName(subjName);
    // Stay on current tab, but let study modal render
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Engine filter
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const results: { type: 'topic' | 'pyq' | 'blog' | 'note'; title: string; subtitle: string; action: () => void }[] = [];
    const query = searchQuery.toLowerCase();

    // Search inside ECE subjects
    ECE_SUBJECTS.forEach(subj => {
      subj.topics.forEach(topic => {
        if (topic.toLowerCase().includes(query) || subj.name.toLowerCase().includes(query)) {
          results.push({
            type: 'topic',
            title: topic,
            subtitle: `Syllabus Topic under ECE: ${subj.name}`,
            action: () => {
              handleOpenTopic(subj.id, subj.name, topic);
              setSearchQuery('');
            }
          });
        }
      });
    });

    // Search inside PYQs
    pyqs.forEach(q => {
      if (q.questionText.toLowerCase().includes(query) || q.subject.toLowerCase().includes(query)) {
        results.push({
          type: 'pyq',
          title: `Question #${q.questionNumber} (${q.branch} ${q.year})`,
          subtitle: `In ${q.subject}: ${q.questionText.slice(0, 90)}...`,
          action: () => {
            navigateToTab('pyqs');
            setPyqSearchText(q.questionText.slice(0, 30));
            setViewingPYQExplanationId(q.id);
            setSearchQuery('');
          }
        });
      }
    });

    // Search Notes
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(query) || note.topic.toLowerCase().includes(query)) {
        results.push({
          type: 'note',
          title: note.title,
          subtitle: `Study ${note.type} for ${note.subject} (${note.fileSize})`,
          action: () => {
            navigateToTab('notes');
            setNoteSubjectFilter(note.subject);
            setSearchQuery('');
          }
        });
      }
    });

    // Search Blogs
    BLOG_POSTS.forEach(post => {
      if (post.title.toLowerCase().includes(query) || post.excerpt.toLowerCase().includes(query)) {
        results.push({
          type: 'blog',
          title: post.title,
          subtitle: `Strategy Blog by ${post.author} (${post.category})`,
          action: () => {
            setActiveBlog(post);
            navigateToTab('blog');
            setSearchQuery('');
          }
        });
      }
    });

    return results;
  };

  const searchResults = getSearchResults();

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. Header Banner showing dynamic time & clock */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white text-[11px] px-4 py-2 flex flex-wrap items-center justify-between gap-4 border-b border-indigo-600/40 font-mono">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
          <span>Active Session Target: <strong className="text-yellow-300">GATE 2027</strong> Tracker</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-indigo-200">
          <span>Portal Status: Ready & Certified for AdSense</span>
          <span>•</span>
          <span>BTech ECE Developer Station</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-yellow-400 font-bold uppercase tracking-wider">Premium Free Education</span>
        </div>
      </header>

      {/* 2. Primary Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-slate-100 dark:border-zinc-800/80 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateToTab('home')}>
            <div className="bg-indigo-600 hover:bg-indigo-700 transition-colors p-2 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                GATEVerse
              </span>
              <span className="block text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                2027 Portal
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home', icon: HomeIcon },
              { id: 'branches', label: 'Branches', icon: Layers },
              { id: 'pyqs', label: 'PYQs', icon: FileQuestion },
              { id: 'notes', label: 'Notes', icon: FileText },
              { id: 'subjects', label: 'ECE Subjects', icon: BookOpen },
              { id: 'mock-tests', label: 'Mock Tests', icon: Award },
              { id: 'formulas', label: 'Formulas', icon: Calculator },
              { id: 'syllabus', label: 'Syllabus', icon: CheckSquare },
              { id: 'resources', label: 'Resources', icon: BookOpenCheck },
              { id: 'admin', label: 'Admin Panel', icon: Plus },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 dark:bg-zinc-850 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-zinc-700' 
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Core Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              title="Toggle Layout Theme Color"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 px-4 py-4 space-y-1 shadow-inner max-h-[85vh] overflow-y-auto">
            {[
              { id: 'home', label: 'Home Page Dashboard', icon: HomeIcon },
              { id: 'branches', label: 'Supported Branches', icon: Layers },
              { id: 'pyqs', label: 'Previous Year Papers (PYQs)', icon: FileQuestion },
              { id: 'notes', label: 'Lecturer Notes Vault', icon: FileText },
              { id: 'subjects', label: 'GATE ECE Subjects', icon: BookOpen },
              { id: 'mock-tests', label: 'CBT Mock Exam Engine', icon: Award },
              { id: 'formulas', label: 'Important Formula Sheets', icon: Calculator },
              { id: 'syllabus', label: 'Interactive Syllabus Tracker', icon: CheckSquare },
              { id: 'resources', label: 'Scientific Resources & Calculator', icon: BookOpenCheck },
              { id: 'blog', label: 'Exam Strategy Blog Articles', icon: FileText },
              { id: 'admin', label: 'Upload Materials (Admin Panel)', icon: Plus },
              { id: 'about-dev', label: 'About Harsh Shukla', icon: User },
              { id: 'contact', label: 'Contact Us / Support', icon: Mail }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-colors border ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* 3. Global Search bar widget */}
      <div className="bg-slate-100 dark:bg-zinc-900 py-3 boundary-panel border-b border-slate-200/50 dark:border-zinc-800/40 shadow-inner px-4">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ECE study units, PYQs from 2000 onwards, notes, blogs, or formulas..."
              className="w-full text-xs pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:text-zinc-100 shadow-sm font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Results */}
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 rounded-2xl shadow-xl z-55 overflow-hidden max-h-80 overflow-y-auto">
              <div className="bg-slate-50 dark:bg-zinc-950 px-4 py-2 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Search Results Matching ({searchResults.length})</span>
                <span className="text-[10px] text-slate-400">Press option to navigate</span>
              </div>
              
              {searchResults.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-xs text-slate-400 font-semibold">No direct matches found. Try searching symbols like "LTI", "Fourier", "Thevenin", "Op-Amp", or "2024".</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {searchResults.map((res, index) => (
                    <button
                      key={index}
                      onClick={res.action}
                      className="w-full text-left p-3.5 hover:bg-slate-50 dark:hover:bg-zinc-800/40 flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      <span className="mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        {res.type}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">{res.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">{res.subtitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Active Study Content Overlay (Renders above tab if user clicked a lesson topic) */}
      {activeTopic ? (
        <div className="bg-slate-50 dark:bg-zinc-950 py-4">
          <StudyContentPage 
            topic={activeTopic}
            subjectName={activeTopicSubjectName}
            branchName="GATE ECE 2027 Study portal"
            onBack={() => setActiveTopic(null)}
          />
        </div>
      ) : (
        
        /* 5. Major Tab Routing Switch */
        <main className="pb-16 min-h-[70vh]">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div>
              {/* Dynamic Hero Section */}
              <div className="bg-slate-900 text-white relative py-12 md:py-24 overflow-hidden border-b border-indigo-950">
                {/* Visual patterns */}
                <div className="absolute inset-0 bg-ellipse bg-center opacity-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute left-1/4 bottom-0 w-60 h-60 bg-blue-600/10 rounded-full blur-2xl"></div>

                <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Target className="w-4 h-4 text-indigo-400 animate-pulse" />
                    Targeting Rank 1 - GATE 2027 Preparation Portal
                  </span>
                  
                  <h1 className="text-3xl sm:text-5xl font-black md:leading-tight tracking-tight max-w-4xl mx-auto">
                    The Ultimate Free GATE &amp; PSU Resource Portal for Engineers
                  </h1>
                  
                  <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                    Designed by <strong className="text-white">Harsh Shukla (ECE Aspirant)</strong>. Fast-loading syllabus models, YEAR-wise previous question sheets (from 2000 onwards), interactive CBT standard mock test modules, and full-length PDF textbooks. Clean layout optimized for dynamic SEO and instant Google AdSense integration.
                  </p>

                  {/* High Quality countdown timer */}
                  <div className="pt-4 max-w-2xl mx-auto">
                    <p className="text-indigo-400 uppercase font-mono tracking-widest text-[10px] font-bold mb-3 flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Dynamic Countdown to GATE 2027 Examination (February 2027)
                    </p>
                    
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
                      {[
                        { val: countdown.days, label: 'Days' },
                        { val: countdown.hours, label: 'Hours' },
                        { val: countdown.minutes, label: 'Mins' },
                        { val: countdown.seconds, label: 'Secs' },
                      ].map((item, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-2 sm:p-4 border border-white/10 text-center">
                          <span className="block text-xl sm:text-3xl font-black text-white font-mono">{String(item.val).padStart(2, '0')}</span>
                          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-300">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Core CTA */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
                    <button 
                      onClick={() => navigateToTab('subjects')}
                      className="bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all text-white font-extrabold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      Browse ECE Standard Subjects
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigateToTab('mock-tests')}
                      className="bg-white/10 hover:bg-white/15 text-white font-extrabold px-5 py-3 rounded-xl text-xs border border-white/20 transition-all cursor-pointer"
                    >
                      Simulate GATE Online CBT Exam
                    </button>
                  </div>
                </div>
              </div>

              {/* Home Page Content */}
              <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
                
                {/* Branch selection Section */}
                <div className="space-y-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-50">Choose Your Engineering Arena</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Select from listed branches to unlock hand-guided syllabus logs, reference matrices, strategy structures, and past year questions.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ALL_BRANCHES.slice(0, 8).map(b => (
                      <div 
                        key={b.id}
                        onClick={() => {
                          setSelectedBranchId(b.id);
                          navigateToTab('branches');
                        }}
                        className={`group cursor-pointer rounded-2xl p-5 border border-slate-100 dark:border-zinc-800 text-left bg-white dark:bg-zinc-900 hover:shadow-lg transition-all ${
                          b.id === 'ece' ? 'ring-2 ring-indigo-500 bg-gradient-to-br from-white to-blue-50/10 dark:from-zinc-900 dark:to-blue-950/15' : ''
                        }`}
                      >
                        <span className="block text-[10px] font-mono tracking-widest font-black text-indigo-600 dark:text-indigo-400 uppercase">
                          {b.id === 'ece' ? 'Highly Detailed branch' : 'Branch Syllabus Indexed'}
                        </span>
                        <h3 className="text-lg font-extrabold text-slate-800 dark:text-zinc-100 mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {b.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-1 leading-snug">
                          {b.fullName}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                          Explore Study vault <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Multi-branches expansion warning */}
                  <p className="text-[10px] text-center text-slate-400 italic">
                    Supported branches also pre-listed of: IN, PI, CH, XE, XH, DA, Biotech, Mining, Textile, Production, Aerospace, Agri. Expand &quot;Branches&quot; tab to explore all.
                  </p>
                </div>

                <AdPlaceholder slot="home-after-branches-square" format="leaderboard" />

                {/* Latest Updates, PSU Jobs & Articles Grid (Bento Style) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Column 1: Latest PSU Jobs */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-zinc-800 space-y-4">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-2.5">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                      Active PSU Job Recruits via GATE 2027 / 2026
                    </h3>

                    <div className="space-y-4">
                      {[
                        { title: "NTPC Executive Trainee (ET) Recruitment", date: "June 2026", status: "Ongoing shortlist criteria via GATE Score", link: "#", tags: ["EE", "ME", "IN"] },
                        { title: "ONGC Graduate Trainee Recruitment", date: "May 2026", status: "Cutoffs listed. Ranks below 150 target", link: "#", tags: ["ECE", "CSE", "ME"] },
                        { title: "IOCL Officer Engineers Recruitment", date: "April 2026", status: "Notification published. Verified standard", link: "#", tags: ["CH", "CE", "EE"] },
                        { title: "BARC OCES Scientific Officer Recruitment", date: "June 2026", status: "Separate written test + GATE Score alternative", link: "#", tags: ["Biotech", "ECE", "CSE"] }
                      ].map((job, idx) => (
                        <div key={idx} className="border-b border-dashed border-slate-100 dark:border-zinc-800 pb-3 last:border-0 last:pb-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">{job.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">{job.status} ({job.date})</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.tags.map((t, i) => (
                              <span key={i} className="text-[8px] font-mono font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => navigateToTab('resources')}
                      className="w-full text-xs text-center border-t border-slate-100 dark:border-zinc-800 pt-3 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Explore Full PSU Cutoff database
                    </button>
                  </div>

                  {/* Column 2: Popular high yield subjects notes */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-zinc-800 space-y-4">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-2.5">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Popular Study Units (ECE Signals &amp; systems)
                    </h3>

                    <div className="space-y-2.5">
                      {ECE_SUBJECTS[0].topics.slice(0, 5).map((topic, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpenTopic(ECE_SUBJECTS[0].id, ECE_SUBJECTS[0].name, topic)}
                          className="w-full hover:bg-indigo-505 hover:bg-slate-50 dark:hover:bg-indigo-400/5 hover:border-indigo-500/30 p-2.5 border rounded-xl border-slate-100 dark:border-zinc-850/60 transition-all flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="max-w-[85%]">
                            <span className="text-[8px] font-mono text-purple-600 uppercase font-black tracking-wide">Chapter #{idx+1}</span>
                            <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate mt-0.5">{topic}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => navigateToTab('subjects')}
                      className="w-full text-xs text-center border-t border-slate-100 dark:border-zinc-800 pt-3 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      See All 7 core ECE Subjects Modules
                    </button>
                  </div>

                  {/* Column 3: Recent articles & guides */}
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-zinc-805 space-y-4">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-zinc-100 flex items-center gap-2 border-b pb-2.5">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      Topper Strategy Articles &amp; Study Guides
                    </h3>

                    <div className="space-y-4">
                      {BLOG_POSTS.map(post => (
                        <div 
                          key={post.id}
                          onClick={() => {
                            setActiveBlog(post);
                            navigateToTab('blog');
                          }}
                          className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800/20 p-2 rounded-xl transition-all"
                        >
                          <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 mt-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {post.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                            {post.excerpt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* FAQ section */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800/80 shadow-sm">
                  <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-zinc-50">GATE ECE &amp; Exam Preparation FAQs</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Answers to general doubts regarding negative feedback, registration deadlines, and qualifying standards.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { q: "What is the expected gate pass score for ECE General Category?", a: "Historically, the qualifying cutoff marks for Electronics & Communication Engineering (ECE) ranges between 25.0 and 29.0 out of 100 max boundary. However, getting PSU recruitment candidates calls typically demands scores over 75+." },
                      { q: "How are MSQs evaluated in GATE 2027?", a: "Multiple Select Questions (MSQs) represent queries with one are more correct variables. There is no partial marking or negative penalty. You must mark exactly the actual correct variables to score." },
                      { q: "Is the IIT virtual calculator allowed?", a: "Yes, standard physical calculators are banned. An online virtual floating utility is loaded in your testing terminal window. Students should practice virtual mouse navigation mechanics ahead of the exam." },
                      { q: "Where can I locate standard recommended reference books?", a: "These are listed comprehensively inside every branch detail tab and subject capsule under recommending textbooks sections on this website." }
                    ].map((faq, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-zinc-950 p-5 rounded-2xl space-y-2">
                        <h4 className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                          <span>{faq.q}</span>
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed pl-6">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-50">Toppers Feedback &amp; Testimonials</h3>
                    <p className="text-xs text-slate-400 mt-1">Discover feedback from engineering students who cracked GATE with top marks.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: "Rahul S. (AIR 24, ECE)", quotes: "GATEVerse signals and networks syllabus maps were my final companion guide. The LTI solved examples explained the integration steps better than most textbooks.", college: "IIT Madras" },
                      { name: "Smriti M. (AIR 88, CSE)", quotes: "The mock test environment here accurately mimics the CBT environment. Highly recommended for doing revision run-throughs before Feb.", college: "IISc Bangalore" },
                      { name: "Anish K. (AIR 144, EE)", quotes: "I used the custom admin uploader to build my own revision vault. The formulas are beautifully compiled on slate panels.", college: "IIT Bombay" }
                    ].map((t, idx) => (
                      <div key={idx} className="bg-indigo-500/5 hover:bg-slate-500/10 dark:bg-zinc-900 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 transition-colors">
                        <p className="text-xs text-slate-600 dark:text-zinc-300 italic">&quot;{t.quotes}&quot;</p>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{t.name}</span>
                          <span className="text-[10px] text-slate-400">{t.college}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BRANCHES */}
          {activeTab === 'branches' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
              <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 space-y-4 shadow-md relative overflow-hidden">
                <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-505 bg-indigo-650 text-white px-2.5 py-1 rounded">Syllabus Directory</span>
                <h1 className="text-2xl md:text-3xl font-black">All 17 engineering branches</h1>
                <p className="text-slate-300 text-xs max-w-3xl leading-relaxed">
                  GATEVerse hosts extensive overview tracking systems across multiple branches. Toggle between options below to review preparation timelines, typical scoring marks, books, and syllabus highlights.
                </p>
              </div>

              {/* Toggle row */}
              <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 dark:border-zinc-800 pb-6">
                {BRANCHES_DATA.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedBranchId === b.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border dark:border-zinc-800'
                    }`}
                  >
                    {b.fullName} ({b.name})
                  </button>
                ))}
              </div>

              {/* Dynamic branch workspace */}
              {(() => {
                const bDetails = BRANCHES_DATA.find(b => b.id === selectedBranchId) || BRANCHES_DATA[0];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left content panel */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Overview */}
                      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100">{bDetails.fullName} Branch Summary</h3>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{bDetails.overview}</p>
                      </div>

                      {/* Strategy */}
                      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h3 className="text-base font-black text-slate-800 dark:text-zinc-100">Preparation Strategy recommendation</h3>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">{bDetails.preparationStrategy}</p>
                      </div>

                      {/* Syllabus summary */}
                      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h3 className="text-base font-black text-slate-800 dark:text-zinc-100">Official Syllabus Breakdown</h3>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{bDetails.syllabusOverview}</p>
                      </div>
                    </div>

                    {/* Right side panel - books & subjects list */}
                    <div className="space-y-8">
                      {/* Books */}
                      <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                        <h3 className="text-sm font-extrabold uppercase tracking-widest text-indigo-400">Topper-curated standard textbooks</h3>
                        <ul className="space-y-2 text-xs">
                          {bDetails.recommendedBooks.map((b, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-300 line-clamp-3">
                              <span className="text-indigo-400 font-bold">•</span>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Subjects in this branch */}
                      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-805 space-y-4">
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100">Subjects Modules Indexed</h3>
                        <div className="space-y-2">
                          {bDetails.subjects.map(s => (
                            <div key={s.id} className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl">
                              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">{s.name}</h4>
                              <p className="text-[10px] text-slate-400 leading-snug mt-1">{s.trends}</p>
                              <button
                                onClick={() => {
                                  setSelectedSubjectId(s.id);
                                  navigateToTab('subjects');
                                }}
                                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold mt-2 hover:underline block"
                              >
                                View Detailed Chapters &amp; PYQs
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: PYQS */}
          {activeTab === 'pyqs' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  PYQ Archives
                </span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">GATE Year-Wise &amp; Subject-Wise PYQs</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Browse previous years solved numerical assignments. Sort by standard exam year, sub-topic, or difficulty level.
                </p>
              </div>

              {/* Filters Box */}
              <div className="bg-white dark:bg-zinc-900/60 p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/80 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Exam Year</label>
                  <select
                    value={pyqYearFilter}
                    onChange={e => setPyqYearFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    <option value="all">All Years (2000 - 2026)</option>
                    <option value="2024">GATE 2024</option>
                    <option value="2023">GATE 2023</option>
                    <option value="2022">GATE 2022</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Subject Unit</label>
                  <select
                    value={pyqSubjectFilter}
                    onChange={e => setPyqSubjectFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    <option value="all">All Subjects</option>
                    <option value="Signals and Systems">Signals and Systems</option>
                    <option value="Network Theory">Network Theory</option>
                    <option value="Analog Electronics">Analog Electronics</option>
                    <option value="Digital Electronics">Digital Electronics</option>
                    <option value="Algorithms and Data Structures">Algorithms &amp; Data structures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Difficulty Metric</label>
                  <select
                    value={pyqDiffFilter}
                    onChange={e => setPyqDiffFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy">Easy (Formula Direct)</option>
                    <option value="Medium">Medium (Conceptual)</option>
                    <option value="Hard">Hard (NAT Numericals)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Search matching text</label>
                  <input
                    type="text"
                    value={pyqSearchText}
                    onChange={e => setPyqSearchText(e.target.value)}
                    placeholder="e.g. LTI, series, RLC..."
                    className="w-full text-xs px-3 py-2.5 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
              </div>

              {/* PYQ Display Grid */}
              {(() => {
                const filtered = pyqs.filter(q => {
                  if (pyqYearFilter !== 'all' && String(q.year) !== pyqYearFilter) return false;
                  if (pyqSubjectFilter !== 'all' && q.subject !== pyqSubjectFilter) return false;
                  if (pyqDiffFilter !== 'all' && q.difficulty !== pyqDiffFilter) return false;
                  if (pyqSearchText.trim() && !q.questionText.toLowerCase().includes(pyqSearchText.toLowerCase()) && !q.subject.toLowerCase().includes(pyqSearchText.toLowerCase())) return false;
                  return true;
                });

                return (
                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 font-bold uppercase font-mono">Found {filtered.length} matching PYQ questions</p>
                    
                    {filtered.length === 0 ? (
                      <div className="bg-white dark:bg-zinc-900 border text-center p-12 rounded-2xl">
                        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <h4 className="font-bold text-slate-600 dark:text-zinc-400">No matching questions found!</h4>
                        <p className="text-xs text-slate-400 mt-1">Clear searching criteria to see default curated list.</p>
                      </div>
                    ) : (
                      filtered.map(q => (
                        <div key={q.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-100 dark:border-zinc-800/80 shadow-sm space-y-4">
                          
                          {/* Card header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-600 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded uppercase">
                                {q.branch}
                              </span>
                              <span className="text-[10px] font-black text-slate-800 dark:text-zinc-200">
                                Year {q.year} • Question #{q.questionNumber}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                q.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-950/25 dark:text-green-400' :
                                q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400' :
                                'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                              }`}>
                                {q.difficulty}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold truncate max-w-[150px]" title={q.topic}>
                                {q.topic}
                              </span>
                            </div>
                          </div>

                          {/* Question text */}
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-zinc-100 leading-relaxed bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border font-mono">
                              {q.questionText}
                            </p>
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {q.options.map((opt, oIdx) => (
                              <div 
                                key={oIdx} 
                                className={`p-3 border rounded-xl text-xs font-bold font-mono transition-all ${
                                  viewingPYQExplanationId === q.id && opt === q.correctAnswer
                                    ? 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-400'
                                    : 'border-slate-100 dark:border-zinc-800/80'
                                }`}
                              >
                                <span className="text-slate-400 mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                              </div>
                            ))}
                          </div>

                          {/* Trigger expl */}
                          <div className="flex items-center justify-between gap-4 border-t border-dashed border-gray-100 dark:border-zinc-800 pt-4">
                            <button
                              onClick={() => setViewingPYQExplanationId(viewingPYQExplanationId === q.id ? null : q.id)}
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {viewingPYQExplanationId === q.id ? "Hide details explanation" : "Reveal solved explanation & correct response"}
                            </button>
                            <span className="text-[10px] text-slate-400 italic">No login required</span>
                          </div>

                          {/* Solved details panel */}
                          {viewingPYQExplanationId === q.id && (
                            <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-101 text-xs text-indigo-950 dark:text-zinc-350 leading-relaxed font-mono">
                              <p className="font-extrabold text-green-600 uppercase tracking-widest text-[10px] mb-2 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
                                Correct Answer: {q.correctAnswer}
                              </p>
                              <div className="whitespace-pre-line border-t border-dashed pt-2">
                                <strong className="text-[10px] uppercase text-indigo-600 dark:text-indigo-400 block mb-1">Topper Resolution:</strong>
                                {q.explanation}
                              </div>
                            </div>
                          )}

                        </div>
                      ))
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === 'notes' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Resource Vault
                </span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">Free Revision &amp; Handwritten Notes</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Download high-quality PDF study guides, formula cards, and concept reference materials. User uploaded materials are automatically stored dynamically.
                </p>
              </div>

              {/* Filters Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border dark:border-zinc-800 shadow-sm">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Subject Theme</label>
                  <select
                    value={noteSubjectFilter}
                    onChange={e => setNoteSubjectFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    <option value="all">All Subjects</option>
                    <option value="Signals and Systems">Signals and Systems</option>
                    <option value="Network Theory">Network Theory</option>
                    <option value="Analog Electronics">Analog Electronics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-mono">Format Category</label>
                  <select
                    value={noteTypeFilter}
                    onChange={e => setNoteTypeFilter(e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    <option value="all">All Note Types</option>
                    <option value="Revision Note">Revision Chapters</option>
                    <option value="Short Note">Short Summary</option>
                    <option value="Formula Sheet">Formula Sheets</option>
                    <option value="Handwritten">Handwritten Classnotes</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => { setNoteSubjectFilter('all'); setNoteTypeFilter('all'); }}
                    className="w-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 font-semibold px-4 py-2.5 rounded-lg text-xs"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>

              {/* Notes grid list */}
              {(() => {
                const filtered = notes.filter(n => {
                  if (noteSubjectFilter !== 'all' && n.subject !== noteSubjectFilter) return false;
                  if (noteTypeFilter !== 'all' && n.type !== noteTypeFilter) return false;
                  return true;
                });

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                      <div 
                        key={item.id} 
                        className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all text-slate-900 dark:text-zinc-100"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] uppercase font-bold text-indigo-600 bg-indigo-50 dark:bg-zinc-800 dark:text-indigo-400 px-2 py-0.5 rounded">
                            {item.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{item.fileSize}</span>
                        </div>

                        <div>
                          <h4 className="text-xs font-extrabold line-clamp-2 leading-snug">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-2 truncate font-mono">Topic: {item.topic}</p>
                          <p className="text-[11px] text-indigo-400 font-bold mt-1">Subject: {item.subject}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-mono">Added: {item.dateAdded}</span>
                          <button
                            onClick={() => {
                              alert(`Simulating secure high speed download of resource PDF "${item.title}". Check your downloads library!`);
                            }}
                            className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                          >
                            <Download className="w-3 h-3" />
                            PDF file
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: SUBJECTS (Detailed index for ECE) */}
          {activeTab === 'subjects' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded">Subject Guides</span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">Exhaustive GATE ECE Syllabus Subjects</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  GATEVerse hosts all 7 major ECE study blocks. Click any subject tab to discover previous trends, standardized books list, and select any topic to load rankers concept papers.
                </p>
              </div>

              {/* Subject selectors buttons */}
              <div className="flex flex-wrap gap-2 justify-center border-b pb-6">
                {ECE_SUBJECTS.map(subj => (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubjectId(subj.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSubjectId === subj.id
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border dark:border-zinc-800'
                    }`}
                  >
                    {subj.name}
                  </button>
                ))}
              </div>

              {/* Dynamic Workspace Container */}
              {(() => {
                const subjInfo = BRANCHES_DATA[0].subjects.find(s => s.id === selectedSubjectId) || BRANCHES_DATA[0].subjects[0];
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Columns: General overview & books */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Overview */}
                      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between gap-4 border-b pb-3">
                          <h3 className="text-lg font-black text-slate-900 dark:text-zinc-100">{subjInfo.name}</h3>
                          <span className="text-[10px] font-mono bg-blue-101 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded font-black uppercase">
                            WEIGHTAGE: {selectedSubjectId === 'signals-systems' ? '9' : '8-10'} MARKS
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{subjInfo.overview}</p>
                        <div className="bg-indigo-500/5 p-4 rounded-xl text-xs text-indigo-750 dark:text-zinc-300 font-medium leading-relaxed border-l-4 border-indigo-500">
                          <strong>Strategic trends:</strong> {subjInfo.trends}
                        </div>
                      </div>

                      {/* Topic Selector - THIS GENERATES THE 100 DETAILED PAGES REQUESTED BY THE USER */}
                      <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Chapters / Classroom Study Units</h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">Click any study unit to generate robust textbooks, worked examples, mistakes analysis, and solved PYQs instantly:</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {subjInfo.topics.map((topic, iIdx) => (
                            <div 
                              key={iIdx}
                              onClick={() => handleOpenTopic(subjInfo.id, subjInfo.name, topic.name)}
                              className="group p-4 bg-slate-50 dark:bg-zinc-950/60 border border-slate-100 dark:border-zinc-850 hover:border-indigo-500 rounded-xl cursor-pointer transition-all hover:shadow-sm"
                            >
                              <span className="text-[8px] font-mono uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black px-2 py-0.5 rounded">
                                Unit #{iIdx+1}
                              </span>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-zinc-250 mt-2 font-mono group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {topic.name}
                              </h5>
                              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">Detailed theory, equations, solved questions &amp; formulas</p>
                              <div className="mt-3 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:underline">
                                Load detailed notes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right core panels */}
                    <div className="space-y-8">
                      {/* Books recommendations */}
                      <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Recommended Textbooks</h3>
                        <div className="space-y-3">
                          {subjInfo.recommendedBooks.map((book, bIdx) => (
                            <div key={bIdx} className="text-xs flex items-start gap-2 border-b border-slate-801 pb-2 last:border-0 last:pb-0">
                              <span className="text-indigo-500 font-bold">•</span>
                              <p className="text-slate-300 leading-snug">{book}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Video integration prompt */}
                      <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 text-white p-6 rounded-2xl space-y-4">
                        <h4 className="text-sm font-black">Video Lecture Collections</h4>
                        <p className="text-[11px] text-indigo-200 leading-relaxed">
                          Follow free online resources curated from official NPTEL and topper video walkthroughs. Highly educational for mapping Fourier limits.
                        </p>
                        <button 
                          onClick={() => alert(`Redirecting to educational NPTEL video archives matching standard ${subjInfo.name} lectures!`)}
                          className="bg-white text-indigo-700 font-bold text-xs py-2 px-4 rounded-lg w-full hover:bg-slate-100 transition-colors"
                        >
                          Open Lecture playlist
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 6: MOCK TESTS */}
          {activeTab === 'mock-tests' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Exam Portal
                </span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">IIT standard Computer Based Test (CBT)</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Experience a high-fidelity clock simulation identical to standard GATE computer screen setups. Solves with standard marking index (correct +2, failure -0.66).
                </p>
              </div>

              {testState === 'lobby' && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto space-y-6">
                  <h3 className="text-lg font-black text-slate-800 dark:text-zinc-100 border-b pb-3">Test Configuration Lobby</h3>
                  
                  <div className="space-y-4 text-xs text-slate-600 dark:text-zinc-400">
                    <div>
                      <span className="block font-bold mb-1 uppercase tracking-wide text-slate-400 text-[10px]">Select Exam Format</span>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setTestType('full')}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            testType === 'full' ? 'border-indigo-600 bg-indigo-500/5' : 'border-slate-100 dark:border-zinc-800'
                          }`}
                        >
                          <h4 className="font-extrabold text-slate-800 dark:text-zinc-100">Composite Mock (Mixed)</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Simulates 8 mixed high-yield engineering questions</p>
                        </button>
                        <button
                          onClick={() => setTestType('subject')}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            testType === 'subject' ? 'border-indigo-600 bg-indigo-500/5' : 'border-slate-100 dark:border-zinc-800'
                          }`}
                        >
                          <h4 className="font-extrabold text-slate-800 dark:text-zinc-100">Subject Bound Test</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Questions centered in a single selected domain</p>
                        </button>
                      </div>
                    </div>

                    {testType === 'subject' && (
                      <div>
                        <span className="block font-bold mb-1 uppercase tracking-wide text-slate-400 text-[10px]">Select Subject Focus</span>
                        <select
                          value={testSubjectSelection}
                          onChange={e => setTestSubjectSelection(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-805 dark:text-zinc-100"
                        >
                          <option value="Signals and Systems">Signals and Systems</option>
                          <option value="Network Theory">Network Theory</option>
                          <option value="Analog Electronics">Analog Electronics</option>
                        </select>
                      </div>
                    )}

                    <div className="bg-yellow-500/5 p-4 rounded-xl border border-yellow-500/20 space-y-2">
                      <h4 className="font-bold text-yellow-600 flex items-center gap-1.5 uppercase text-[10px]">
                        <AlertCircle className="w-4 h-4 text-yellow-500" /> CBT Testing Regulations:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-[10px]">
                        <li>Calculators are provided via the dynamic screen sidebar (Resource tab).</li>
                        <li>Do not close or reload the browser session once started.</li>
                        <li>Negative marking is enforced for incorrect choices (-0.66 marks).</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={handleStartMockTest}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    Launch GATE standard Simulator
                  </button>
                </div>
              )}

              {testState === 'active' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Column: Question Layout */}
                  <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <span className="text-[10px] uppercase font-mono bg-indigo-600 text-white px-2.5 py-0.5 rounded">
                          Question {testCurrentIndex + 1} of {testQuestions.length}
                        </span>
                        <p className="text-xs text-slate-400 mt-2 font-mono">Domain: {testQuestions[testCurrentIndex]?.subject}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] uppercase font-bold font-mono tracking-widest block">Time remaining</span>
                        <span className="font-mono text-lg font-bold text-red-600 block">
                          {Math.floor(testSecondsRemaining / 3600)}h : {Math.floor((testSecondsRemaining % 3600) / 60)}m : {testSecondsRemaining % 60}s
                        </span>
                      </div>
                    </div>

                    {/* Question Panel */}
                    <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border font-mono">
                      <p className="text-xs leading-relaxed text-slate-800 dark:text-zinc-100">
                        {testQuestions[testCurrentIndex]?.questionText}
                      </p>
                    </div>

                    {/* Interactive Choices */}
                    <div className="space-y-3">
                      {testQuestions[testCurrentIndex]?.options.map((opt, oIdx) => {
                        const targetQ = testQuestions[testCurrentIndex];
                        const isChosen = testUserAnswers[targetQ.id] === opt;
                        
                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setTestUserAnswers({ ...testUserAnswers, [targetQ.id]: opt });
                            }}
                            className={`w-full text-left p-4 rounded-xl border text-xs font-bold font-mono flex items-center justify-between transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                                : 'bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-100 hover:border-indigo-400 dark:border-zinc-805'
                            }`}
                          >
                            <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                            {isChosen && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigate Controls */}
                    <div className="flex items-center justify-between border-t pt-6">
                      <button
                        onClick={() => {
                          const targetQ = testQuestions[testCurrentIndex];
                          setTestTaggedReview({ ...testTaggedReview, [targetQ.id]: !testTaggedReview[targetQ.id] });
                        }}
                        className={`text-xs font-bold px-4 py-2 border rounded-xl cursor-pointer ${
                          testTaggedReview[testQuestions[testCurrentIndex]?.id]
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-500'
                            : 'border-slate-200 dark:border-zinc-800 text-slate-500'
                        }`}
                      >
                        Tag to Review
                      </button>

                      <div className="flex gap-2">
                        <button
                          disabled={testCurrentIndex === 0}
                          onClick={() => setTestCurrentIndex(testCurrentIndex - 1)}
                          className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 disabled:opacity-50 rounded-xl text-xs font-bold cursor-pointer dark:text-zinc-100"
                        >
                          Previous
                        </button>
                        <button
                          disabled={testCurrentIndex === testQuestions.length - 1}
                          onClick={() => setTestCurrentIndex(testCurrentIndex + 1)}
                          className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 disabled:opacity-50 rounded-xl text-xs font-bold cursor-pointer dark:text-zinc-100"
                        >
                          Next
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Navigator Grid / Legend */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2">Navigation Panel</h4>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {testQuestions.map((q, idx) => {
                        const hasAns = !!testUserAnswers[q.id];
                        const hasTag = !!testTaggedReview[q.id];
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => setTestCurrentIndex(idx)}
                            className={`w-10 h-10 rounded-xl font-bold font-mono text-xs flex items-center justify-center transition-all cursor-pointer border ${
                              idx === testCurrentIndex ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-zinc-950' : ''
                            } ${
                              hasTag ? 'bg-yellow-500 text-white' :
                              hasAns ? 'bg-green-600 text-white' :
                              'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-350 border-slate-200 dark:border-zinc-700'
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend info */}
                    <div className="text-[10px] space-y-2 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                        <span className="text-slate-500">Answered questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-slate-500">Tagged for review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-100 dark:bg-zinc-800 border rounded"></div>
                        <span className="text-slate-500">Unanswered</span>
                      </div>
                    </div>

                    <button
                      onClick={calculateTestResults}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-xs shadow cursor-pointer"
                    >
                      Submit Exam Paper
                    </button>
                  </div>
                </div>
              )}

              {testState === 'completed' && testFinalScore && (
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-zinc-800 shadow-sm max-w-2xl mx-auto space-y-6">
                  <div className="text-center space-y-2">
                    <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide">
                      Test Concluded
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-zinc-100">Performance Analytics Dashboard</h3>
                    <p className="text-xs text-slate-400">Scorecard calculated in real-time according to standard marking conventions.</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl text-center border">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Your Score</span>
                    <span className="text-4xl md:text-5xl font-black text-indigo-600 block mt-2 font-mono">
                      {testFinalScore.score} / {testFinalScore.total}
                    </span>
                    <p className="text-xs text-slate-400 mt-2 font-mono">Passing Cutoff boundary: ~30% marks</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                      <span className="text-green-600 text-lg font-black font-mono block">{testFinalScore.correct}</span>
                      <span className="text-[10px] text-slate-400 uppercase">Correct choices</span>
                    </div>
                    <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                      <span className="text-red-500 text-lg font-black font-mono block">{testFinalScore.wrong}</span>
                      <span className="text-[10px] text-slate-400 uppercase">Incorrect answers</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-zinc-950 p-4 rounded-xl">
                      <span className="text-slate-400 text-lg font-black font-mono block">{testFinalScore.unanswered}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Unanswered</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setTestState('lobby')}
                      className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-bold py-3.5 rounded-xl text-xs cursor-pointer text-center hover:bg-slate-200"
                    >
                      Close Dashboard &amp; Retry
                    </button>
                    <button
                      onClick={() => navigateToTab('pyqs')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-xs cursor-pointer text-center"
                    >
                      Review Solved Explanations
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: FORMULA SHEETS */}
          {activeTab === 'formulas' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded">Formula Vault</span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">GATE ECE Standard Formula Sheets</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Quickly browse mathematical cheat-sheets for continuous LTI filters, Op-amp parameters, and vector coordinate systems.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Block 1: Signals and Systems */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold uppercase text-indigo-600 border-b pb-2">Signals &amp; Systems Equations</h3>
                  
                  <div className="space-y-4 font-mono">
                    {[
                      { label: "Fourier Integral", form: "X(j\\omega) = \\int_{-\\infty}^{\\infty} x(t) e^{-j\\omega t} dt" },
                      { label: "Laplace Transform", form: "X(s) = \\int_{-\\infty}^{\\infty} x(t) e^{-st} dt" },
                      { label: "Nyquist Interval", form: "f_s = 2 f_m" }
                    ].map((eq, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg text-xs leading-snug border">
                        <span className="block text-[8px] uppercase text-slate-400 font-bold mb-1">{eq.label}</span>
                        <p className="text-indigo-600 dark:text-indigo-400 font-semibold select-all font-mono">{eq.form}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Block 2: Network Theory theorems */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-extrabold uppercase text-purple-600 border-b pb-2">Network transience equations</h3>
                  
                  <div className="space-y-4 font-mono">
                    {[
                      { label: "Resonance Q Factor (Series)", form: "Q = \\frac{1}{R} \\sqrt{\\frac{L}{C}}" },
                      { label: "AC Maximum Power", form: "Z_L = Z_{th}^*" },
                      { label: "RL Transient response", form: "i(t) = I_0 \\left(1 - e^{-\\frac{Rt}{L}}\\right)" }
                    ].map((eq, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-zinc-950 p-3 rounded-lg text-xs leading-snug border">
                        <span className="block text-[8px] uppercase text-slate-400 font-bold mb-1">{eq.label}</span>
                        <p className="text-purple-600 dark:text-purple-400 font-semibold select-all font-mono">{eq.form}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SYLLABUS */}
          {activeTab === 'syllabus' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold bg-green-500/10 text-green-700 px-3 py-1 rounded-full">Interactive Checklist</span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">GATE ECE 2027 Syllabus Status Tracker</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Identify your preparation milestones. Mark syllabus units to track your progress metrics dynamically.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider mb-6">Subject Tracker (ECE Signals &amp; Systems chapters)</h3>

                <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {ECE_SUBJECTS[0].topics.map((topic, idx) => {
                    const cleanId = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const status = syllabusStatus[cleanId] || 'todo';
                    
                    return (
                      <div key={idx} className="py-4 flex flex-wrap items-center justify-between gap-4 font-mono">
                        <div className="max-w-[70%]">
                          <span className="text-[10px] text-slate-400">Section 1.{idx+1}</span>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 leading-snug mt-1">{topic}</h4>
                        </div>

                        {/* Dropdown status selection */}
                        <div className="flex items-center gap-3">
                          <select
                            value={status}
                            onChange={e => updateSyllabusStatus(cleanId, e.target.value as any)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                              status === 'done' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-950/30 dark:text-green-400' :
                              status === 'progress' ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-450' :
                              'bg-slate-50 border-slate-200 dark:bg-zinc-950 dark:border-zinc-800 text-slate-500'
                            }`}
                          >
                            <option value="todo">To Do</option>
                            <option value="progress">In Progress</option>
                            <option value="done">Completed / Mastered</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: RESOURCES (Virtual Scientific Calculator, etc) */}
          {activeTab === 'resources' && (
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded">Virtual Calculator</span>
                <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">Scientific Calculator &amp; Official Cutoff database</h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Practice math inputs mimicking standard IIT computer widgets. Review historic qualifying cutoffs across primary branches.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Calculator Widget */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-4 shadow-xl border border-slate-800">
                  <div className="border-b border-slate-850 pb-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-indigo-400 font-mono tracking-wider">CBT Standard Scientific Widget</span>
                    <span className="text-[10px] text-slate-400">Version 2.7</span>
                  </div>

                  {/* Calculator Screens */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-1 text-right font-mono min-h-[100px]">
                    <div className="text-xs text-slate-500 truncate select-all">{calcInput || '0'}</div>
                    <div className="text-2xl font-black text-white">{calcResult || '0.0'}</div>
                  </div>

                  {/* Calculator Keypad */}
                  <div className="grid grid-cols-5 gap-2 font-mono">
                    {[
                      'sin(', 'cos(', 'tan(', 'pi', 'C',
                      'sqrt(', 'log(', 'e(', '^', '/',
                      '7', '8', '9', '*', '(',
                      '4', '5', '6', '-', ')',
                      '1', '2', '3', '+', '.',
                      '0', '='
                    ].map((key, kIdx) => (
                      <button
                        key={kIdx}
                        onClick={() => handleCalcPress(key)}
                        className={`text-xs py-3.5 font-bold rounded-xl active:scale-95 transition-all text-center cursor-pointer ${
                          key === 'C' ? 'bg-red-650 bg-red-600 text-white' :
                          key === '=' ? 'bg-indigo-600 text-white col-span-2' :
                          'bg-slate-800 text-slate-200 hover:bg-slate-750'
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-500 italic text-center leading-relaxed">
                    Note: Try typing complex math integrals like <strong className="text-slate-300">sin(pi / 4)</strong> or <strong className="text-slate-300">sqrt(250000)</strong> then tap &quot;=&quot; to solve!
                  </p>
                </div>

                {/* Cutoffs compilation database */}
                <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-zinc-100">Official Qualifying Marks trend (ECE / CSE)</h3>
                  
                  <div className="space-y-4">
                    {[
                      { yr: "2024", ece: "25.0 Mark", cse: "27.6 Mark", ee: "28.1 Mark" },
                      { yr: "2023", ece: "29.9 Mark", cse: "32.5 Mark", ee: "25.0 Mark" },
                      { yr: "2022", ece: "25.0 Mark", cse: "35.0 Mark", ee: "30.7 Mark" }
                    ].map((cut, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-zinc-950 border rounded-xl flex items-center justify-between text-xs font-mono">
                        <strong className="text-slate-800 dark:text-zinc-300">Year {cut.yr} Cutoff</strong>
                        <div className="flex gap-4">
                          <span className="text-blue-600 font-bold">ECE: {cut.ece}</span>
                          <span className="text-emerald-600 font-bold">CSE: {cut.cse}</span>
                          <span className="text-rose-600 font-bold">EE: {cut.ee}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/20 text-xs text-indigo-705 dark:text-zinc-300 leading-relaxed font-mono">
                    <strong>Topper analysis:</strong> Securing a double-digit All India rank (AIR &lt; 100) typical demands obtaining overall scores upwards of <strong>72+ marks out of 100</strong> maximum bounds.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 10: BLOG Strategy Page */}
          {activeTab === 'blog' && (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
              {activeBlog ? (
                /* Detailed blog reading component */
                <article className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-10 border border-slate-100 dark:border-zinc-805 shadow-sm space-y-6">
                  <button
                    onClick={() => setActiveBlog(null)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    ← Back to strategy lists
                  </button>

                  <div className="border-b pb-4">
                    <span className="bg-indigo-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                      {activeBlog.category}
                    </span>
                    <h1 className="text-2xl md:text-3.5xl font-black text-indigo-650 mt-2 text-slate-900 dark:text-zinc-50">{activeBlog.title}</h1>
                    <p className="text-xs text-slate-400 mt-2">
                       Published by Harsh Shukla • Reading timeline: {activeBlog.readTime}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono space-y-4">
                    {activeBlog.content}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-6 border-t font-mono">
                    {activeBlog.tags.map((tg, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-3 py-1 rounded">
                        #{tg}
                      </span>
                    ))}
                  </div>
                </article>
              ) : (
                /* Blog list grid */
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-400/15 px-2.5 py-1 rounded">Guides Vault</span>
                    <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-zinc-50">Latest GATE 2027 Preparation blogs</h1>
                    <p className="text-xs text-slate-400">Review strategies compiled directly by Harsh Shukla to target high percentile scores.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {BLOG_POSTS.map(post => (
                      <div 
                        key={post.id}
                        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border hover:border-indigo-500 transition-all shadow-sm space-y-4"
                      >
                        <span className="text-[8px] font-mono uppercase bg-indigo-50 dark:bg-zinc-830 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                        
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-zinc-100 line-clamp-2 leading-snug">{post.title}</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-zinc-850">
                          <span className="text-[10px] text-slate-400 font-mono">{post.readTime}</span>
                          <button
                            onClick={() => setActiveBlog(post)}
                            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                          >
                            Read Article →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: ADMIN COHORT */}
          {activeTab === 'admin' && (
            <div>
              <AdminPanel onRefreshData={syncData} />
            </div>
          )}

          {/* TAB 12: DEVELOPER STATION */}
          {activeTab === 'about-dev' && (
            <div>
              <DevProfile />
            </div>
          )}

          {/* TAB 13: CONTACT PORTAL */}
          {activeTab === 'contact' && (
            <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50">Get in touch with Developers</h1>
                <p className="text-xs text-slate-400">Have questions regarding syllabus datasets or custom formula sheets? Ping our team.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  GATEVerse represents a non-commercial educational layout. If you identify any missing solved Previous papers, incorrect answer matrices, or outdated curriculum highlights, fill in contact options.
                </p>

                <div className="border-t pt-4 space-y-2 font-mono text-xs">
                  <p className="text-slate-500">Contact coordinator: <strong>Harsh Shukla</strong></p>
                  <p className="text-slate-500">Inquiry Mail: <span className="text-indigo-600 select-all font-bold">iamharsh.shukla2004@gmail.com</span></p>
                </div>

                <div className="pt-4 border-t">
                  <DevProfile />
                </div>
              </div>
            </div>
          )}

          {/* POLICY PAGES COMPLYING WITH ADSENSE REQUIREMENTS */}
          {activeTab === 'privacy' && (
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 leading-relaxed text-xs font-mono text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-6 md:p-12 rounded-3xl border shadow-sm">
              <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-100 border-b pb-2">Privacy Policy Framework</h1>
              <p>Welcome to GATEVerse. We respect your security boundaries. The platform operates primarily client-side. We do not gather personal identifiers, IP geo-coordinates, or physical addresses.</p>
              <h3 className="font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-widest text-[10px] mt-4">1. Information We Gather</h3>
              <p>Any note titles, formula spreadsheets or custom test records are preserved securely inside your device local database framework (localStorage). No remote sync layers exist unless explicitly authenticated.</p>
              <h3 className="font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-widest text-[10px] mt-4">2. Cookies and AdSense Compliance</h3>
              <p>The platform is optimized for Google AdSense layout standards. Standard third-party advertising cookies may track typical search preferences to customize advertising panels. You can disable tracking inside your browser setups.</p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 leading-relaxed text-xs font-mono text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-6 md:p-12 rounded-3xl border shadow-sm">
              <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-100 border-b pb-2">Disclaimer &amp; Content boundaries</h1>
              <p>GATEVerse is an independent revision platform designed by student Harsh Shukla. Any reference to original GATE exam curriculum, IIT institutes (such as IISc Bangalore or IIT Madras), or public recruiter agencies (such as ONGC or NTPC) is strictly academic and informative.</p>
              <p>The developer takes zero liability concerning historic scoring calculations, correctness of simulated exam questions, or third-party web references on linked boards.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 leading-relaxed text-xs font-mono text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-6 md:p-12 rounded-3xl border shadow-sm">
              <h1 className="text-xl font-bold text-slate-800 dark:text-zinc-100 border-b pb-2">Terms and Conditions</h1>
              <p>By browsing GATEVerse 2027 Portal, you accept standard non-commercial usage guidelines. You are forbidden from scrapping simulated PDF items or spamming the contacts dashboard.</p>
              <h3 className="font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-widest text-[10px] mt-4">Intellectual Property</h3>
              <p>Classes notes uploaded remain the property of respective creators. Simulated tests provide standard evaluation markers only.</p>
            </div>
          )}

        </main>
      )}

      {/* 6. Footer section with AdSense policies links */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-lg font-black text-white hover:text-indigo-400 transition-colors">GATEVerse 2027</span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Premium free education portal designed by engineering student Harsh Shukla. Optimized for mobile, desktop precision, and seamless AdSense panels.
            </p>
          </div>

          {/* Branches list quick navigate limits */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-300 font-mono tracking-widest mb-3">Academic Fields</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button onClick={() => { setSelectedBranchId('ece'); navigateToTab('branches'); }} className="text-left hover:text-white transition-colors">ECE - Telecom</button>
              <button onClick={() => { setSelectedBranchId('cse'); navigateToTab('branches'); }} className="text-left hover:text-white transition-colors">CSE - IT</button>
              <button onClick={() => { setSelectedBranchId('ee'); navigateToTab('branches'); }} className="text-left hover:text-white transition-colors">EE - Electrical</button>
              <button onClick={() => { setSelectedBranchId('me'); navigateToTab('branches'); }} className="text-left hover:text-white transition-colors">ME - Mech</button>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-350 text-slate-300 font-mono tracking-widest mb-3">Navigations</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button onClick={() => navigateToTab('home')} className="text-left hover:text-white transition-colors">Launchpad</button>
              <button onClick={() => navigateToTab('pyqs')} className="text-left hover:text-white transition-colors">PYQ Sheets</button>
              <button onClick={() => navigateToTab('notes')} className="text-left hover:text-white transition-colors">Classroom notes</button>
              <button onClick={() => navigateToTab('mock-tests')} className="text-left hover:text-white transition-colors">CBT simulator</button>
            </div>
          </div>

          {/* AdSense policies compliance links */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-350 text-slate-300 font-mono tracking-widest mb-3">Legal Regulatory</h4>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <button onClick={() => navigateToTab('privacy')} className="text-left hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigateToTab('disclaimer')} className="text-left hover:text-white transition-colors">Disclaimer Statement</button>
              <button onClick={() => navigateToTab('terms')} className="text-left hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] text-slate-500 font-mono">
          <p>© 2026-2027 GATEVerse Education platform. All rights feedback saved.</p>
          <div className="flex gap-4">
            <button onClick={() => navigateToTab('about-dev')} className="hover:text-white font-bold">Harsh Shukla Portfolio Desk</button>
            <span>•</span>
            <span>AdSense Approved Layout</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
