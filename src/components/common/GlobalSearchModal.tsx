import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  FileText,
  BookOpen,
  Award,
  Sparkles,
  Command,
  ArrowRight,
  X,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  FileCheck,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Filter
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { User, AssessmentRecord, TermReportCard, Announcement, Assignment } from '../../types';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportCardModal?: (studentId: string) => void;
  onSelectUser?: (user: User) => void;
}

type SearchCategory = 'all' | 'students' | 'teachers' | 'documents' | 'assessments';

interface SearchResultItem {
  id: string;
  type: 'student' | 'teacher' | 'document' | 'assessment' | 'class';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  dateOrCode?: string;
  avatarUrl?: string;
  data: any;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenReportCardModal,
  onSelectUser,
}) => {
  const {
    currentSchool,
    allUsers,
    assessments,
    reportCards,
    announcements,
    assignments,
    financePublications,
    isDemoMode,
  } = useSchool();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoadingEffect, setIsLoadingEffect] = useState(true);
  const [previewItem, setPreviewItem] = useState<SearchResultItem | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Trigger futuristic scanning effect whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingEffect(true);
      setQuery('');
      setSelectedIndex(0);
      setPreviewItem(null);
      const timer = setTimeout(() => {
        setIsLoadingEffect(false);
        inputRef.current?.focus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle global keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (previewItem) {
          setPreviewItem(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        if (filteredResults[selectedIndex]) {
          e.preventDefault();
          handleSelectItem(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Compile all searchable telemetry items
  const allIndexedItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Students
    allUsers
      .filter((u) => u.role === 'student' && u.schoolId === currentSchool.id)
      .forEach((u) => {
        items.push({
          id: `stu_${u.id}`,
          type: 'student',
          title: u.fullName,
          subtitle: `${u.studentProfile?.className || 'Student'} • Reg: ${u.studentProfile?.studentNumber || 'STU-2026'} • ECZ: ${u.studentProfile?.eczCandidateNumber || 'Active'}`,
          badge: u.studentProfile?.className || 'Student',
          badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
          dateOrCode: u.studentProfile?.studentNumber || 'STU-001',
          avatarUrl: u.avatarUrl,
          data: u,
        });
      });

    // 2. Teachers and Faculty
    allUsers
      .filter((u) => (u.role === 'teacher' || u.role === 'head_teacher' || u.role === 'deputy_head_teacher') && u.schoolId === currentSchool.id)
      .forEach((u) => {
        const roleLabel =
          u.role === 'head_teacher'
            ? 'Head Teacher'
            : u.role === 'deputy_head_teacher'
            ? 'Deputy Head'
            : 'Faculty Teacher';
        items.push({
          id: `tea_${u.id}`,
          type: 'teacher',
          title: u.fullName,
          subtitle: `${roleLabel} • Dept: ${u.teacherProfile?.specialization || 'Academic Staff'} • Emp ID: ${u.teacherProfile?.employeeNumber || 'TS-2026'}`,
          badge: roleLabel,
          badgeColor:
            u.role === 'head_teacher'
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dateOrCode: u.teacherProfile?.employeeNumber || 'FACULTY',
          avatarUrl: u.avatarUrl,
          data: u,
        });
      });

    // 3. Official Documents & Circulars & Report Cards
    reportCards.forEach((rc) => {
      items.push({
        id: `rc_${rc.id}`,
        type: 'document',
        title: `Official Term Report Card: ${rc.studentName}`,
        subtitle: `${rc.className} • ECZ Agg: ${rc.aggregatePoints} pts • Avg: ${rc.averagePercentage}% • Position: ${rc.positionInClass}/${rc.totalStudentsInClass}`,
        badge: 'ECZ Report Card',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        dateOrCode: rc.studentNumber,
        data: rc,
      });
    });

    announcements.forEach((ann) => {
      items.push({
        id: `ann_${ann.id}`,
        type: 'document',
        title: ann.title,
        subtitle: `${ann.category} Circular • Authored by ${ann.authorName} (${ann.authorRole.replace('_', ' ')})`,
        badge: 'Official Circular',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        dateOrCode: new Date(ann.createdAt).toLocaleDateString(),
        data: ann,
      });
    });

    financePublications.forEach((pub) => {
      items.push({
        id: `pub_${pub.id}`,
        type: 'document',
        title: pub.title,
        subtitle: `Official Finance Publication • ${pub.category.toUpperCase().replace('_', ' ')} • Authored by ${pub.authorName}`,
        badge: 'Finance Circular',
        badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        dateOrCode: new Date(pub.createdAt).toLocaleDateString(),
        data: pub,
      });
    });

    // 4. Continuous Assessments & Mock Exams
    assessments.forEach((ass) => {
      items.push({
        id: `ass_${ass.id}`,
        type: 'assessment',
        title: ass.title,
        subtitle: `${ass.className} • ${ass.subjectName} • Max Mark: ${ass.maxScore} • Teacher: ${ass.teacherName} • Status: ${ass.status.toUpperCase()}`,
        badge: ass.type.toUpperCase().replace('_', ' '),
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        dateOrCode: `Week ${ass.weekNumber}`,
        data: ass,
      });
    });

    assignments.forEach((asg) => {
      items.push({
        id: `asg_${asg.id}`,
        type: 'assessment',
        title: asg.title,
        subtitle: `${asg.className} • ${asg.subjectName} • Due: ${asg.dueDate} • Teacher: ${asg.teacherName}`,
        badge: 'Homework / Assignment',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        dateOrCode: asg.dueDate,
        data: asg,
      });
    });

    return items;
  }, [allUsers, currentSchool.id, reportCards, announcements, financePublications, assessments, assignments]);

  // Filter based on search query and category
  const filteredResults = useMemo(() => {
    let list = allIndexedItems;

    if (activeCategory === 'students') {
      list = list.filter((i) => i.type === 'student');
    } else if (activeCategory === 'teachers') {
      list = list.filter((i) => i.type === 'teacher');
    } else if (activeCategory === 'documents') {
      list = list.filter((i) => i.type === 'document');
    } else if (activeCategory === 'assessments') {
      list = list.filter((i) => i.type === 'assessment');
    }

    if (!query.trim()) {
      return list.slice(0, 24);
    }

    const q = query.toLowerCase().trim();
    return list
      .filter((i) => {
        return (
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          i.badge.toLowerCase().includes(q) ||
          (i.dateOrCode && i.dateOrCode.toLowerCase().includes(q))
        );
      })
      .slice(0, 30);
  }, [allIndexedItems, activeCategory, query]);

  const handleSelectItem = (item: SearchResultItem) => {
    if (item.type === 'student') {
      if (onSelectUser) {
        onSelectUser(item.data);
      }
      setPreviewItem(item);
    } else if (item.type === 'teacher') {
      if (onSelectUser) {
        onSelectUser(item.data);
      }
      setPreviewItem(item);
    } else if (item.type === 'document') {
      if (item.data.studentId && onOpenReportCardModal) {
        onOpenReportCardModal(item.data.studentId);
        onClose();
      } else {
        setPreviewItem(item);
      }
    } else {
      setPreviewItem(item);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xl flex items-start justify-center p-3 sm:p-6 sm:pt-14 animate-in fade-in duration-200">
      {/* Outer Glow & Holographic Card */}
      <div className="relative w-full max-w-3xl bg-slate-900/95 border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden text-slate-100 flex flex-col max-h-[88vh]">
        
        {/* Holographic Top Banner with Radar Status */}
        <div className="bg-linear-to-r from-slate-950 via-cyan-950/40 to-slate-950 px-5 py-3 border-b border-cyan-500/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute opacity-75"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            </div>
            <span className="font-mono text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
              SchoolLink Quantum Telemetry Search
            </span>
            <span className="hidden sm:inline text-slate-500 font-mono text-[10px]">
              [{currentSchool.code} • {isDemoMode ? 'SANDBOX DEMO' : 'LIVE PRODUCTION'}]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
              INDEXED: <strong className="text-cyan-400">{allIndexedItems.length} RECORDS</strong>
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Search Input Box with Cyber HUD Styling */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search students, faculty, report cards, circulars, ECZ marks..."
              className="w-full bg-slate-900/90 text-white pl-12 pr-12 py-3.5 rounded-2xl border border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm sm:text-base placeholder-slate-500 outline-hidden font-medium transition shadow-inner"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="absolute right-4 hidden sm:flex items-center gap-1 font-mono text-[10px] bg-slate-800/90 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700">
                <Command className="w-3 h-3 text-cyan-400" />
                <span>K</span>
              </div>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-1">
            {[
              { id: 'all', label: 'All Records', count: allIndexedItems.length },
              { id: 'students', label: 'Students', count: allIndexedItems.filter((i) => i.type === 'student').length },
              { id: 'teachers', label: 'Teachers', count: allIndexedItems.filter((i) => i.type === 'teacher').length },
              { id: 'documents', label: 'Documents & Reports', count: allIndexedItems.filter((i) => i.type === 'document').length },
              { id: 'assessments', label: 'Assessments', count: allIndexedItems.filter((i) => i.type === 'assessment').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as SearchCategory);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900/80 text-slate-400">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Container / Scanning Loading Effect */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-[260px] max-h-[50vh] divide-y divide-slate-800/60">
          {isLoadingEffect ? (
            /* Futuristic Holographic Scanning Loader */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Rotating Cyber Grid Circles */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-spin border-t-cyan-400"></div>
                <div className="absolute inset-2 rounded-full border border-emerald-500/30 animate-ping"></div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  INITIALIZING REALTIME QUANTUM INDEX...
                </p>
                <p className="text-[11px] text-slate-400">
                  Scanning verified learners, faculty rosters, ECZ report cards & circulars
                </p>
              </div>
              {/* Holographic Pulse Skeletons */}
              <div className="w-full max-w-md space-y-2 pt-2 opacity-60">
                <div className="h-10 bg-slate-800/50 rounded-xl animate-pulse"></div>
                <div className="h-10 bg-slate-800/30 rounded-xl animate-pulse"></div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            /* Empty State */
            <div className="py-14 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">No matching school records found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No items match “{query}”. Try searching by student name, grade (e.g. “9A”), candidate number, or subject.
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-3 sm:p-3.5 rounded-2xl transition cursor-pointer flex items-center justify-between gap-3 group ${
                    isSelected
                      ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-xs'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Item Icon or Avatar */}
                    <div className="shrink-0">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.title}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-cyan-500/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                          {item.type === 'student' && <Users className="w-5 h-5 text-sky-400" />}
                          {item.type === 'teacher' && <GraduationCap className="w-5 h-5 text-emerald-400" />}
                          {item.type === 'document' && <FileText className="w-5 h-5 text-amber-400" />}
                          {item.type === 'assessment' && <Award className="w-5 h-5 text-rose-400" />}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition truncate">
                          {item.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right Action Hint */}
                  <div className="shrink-0 flex items-center gap-2 text-slate-400">
                    {item.dateOrCode && (
                      <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
                        {item.dateOrCode}
                      </span>
                    )}
                    <div className={`p-1.5 rounded-lg transition ${isSelected ? 'text-cyan-300 bg-cyan-500/20' : 'text-slate-500'}`}>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Keyboard Shortcuts and Telemetry Status */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">↵</kbd>
              <span>Select Item</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">Esc</kbd>
              <span>Dismiss</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SYSTEM ACTIVE • REALTIME SYNC</span>
          </div>
        </div>

        {/* Inline Dossier / Document Inspection Modal Popover */}
        {previewItem && (
          <div className="absolute inset-0 bg-slate-950/95 z-30 p-5 overflow-y-auto flex flex-col justify-between animate-in fade-in duration-150">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${previewItem.badgeColor}`}>
                    {previewItem.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ITEM DOSSIER RECORD</span>
                </div>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-4">
                <div className="flex items-start gap-4">
                  {previewItem.avatarUrl ? (
                    <img
                      src={previewItem.avatarUrl}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/40"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-white">{previewItem.title}</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-0.5">{previewItem.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Institution: <strong className="text-slate-200">{currentSchool.name}</strong> ({currentSchool.code})
                    </p>
                  </div>
                </div>

                {/* Additional Detailed Fields */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                  {previewItem.type === 'student' && previewItem.data.studentProfile && (
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div>
                        <span className="text-slate-500 block">Class & Stream:</span>
                        <span className="text-white font-bold">{previewItem.data.studentProfile.className}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Student Number:</span>
                        <span className="text-cyan-300 font-bold">{previewItem.data.studentProfile.studentNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Admission Date:</span>
                        <span className="text-slate-300">{previewItem.data.studentProfile.admissionDate || '2026-01-10'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Gender:</span>
                        <span className="text-slate-300">{previewItem.data.studentProfile.gender}</span>
                      </div>
                    </div>
                  )}

                  {previewItem.type === 'teacher' && previewItem.data.teacherProfile && (
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div>
                        <span className="text-slate-500 block">Employee Code:</span>
                        <span className="text-emerald-300 font-bold">{previewItem.data.teacherProfile.employeeNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Qualification:</span>
                        <span className="text-white font-bold">{previewItem.data.teacherProfile.qualification}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Specialization:</span>
                        <span className="text-slate-300">{previewItem.data.teacherProfile.specialization}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Official Email:</span>
                        <span className="text-slate-300">{previewItem.data.email}</span>
                      </div>
                    </div>
                  )}

                  {previewItem.type === 'document' && (
                    <div className="space-y-2">
                      <p className="text-slate-300 leading-relaxed font-sans">
                        {previewItem.data.content || previewItem.data.details || previewItem.subtitle}
                      </p>
                      {previewItem.data.targetRoles && (
                        <p className="text-slate-400 font-mono text-[11px]">
                          Audience: {previewItem.data.targetRoles.join(', ')}
                        </p>
                      )}
                    </div>
                  )}

                  {previewItem.type === 'assessment' && (
                    <div className="grid grid-cols-2 gap-3 font-mono">
                      <div>
                        <span className="text-slate-500 block">Max Assessment Mark:</span>
                        <span className="text-rose-400 font-bold">{previewItem.data.maxScore || 100}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Subject:</span>
                        <span className="text-white font-bold">{previewItem.data.subjectName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Back to Results
              </button>
              {previewItem.type === 'student' && onOpenReportCardModal && (
                <button
                  onClick={() => {
                    onOpenReportCardModal(previewItem.data.id);
                    onClose();
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open ECZ Report Card</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
