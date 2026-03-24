"use client";

import { useState } from "react";
import {
  Star, BookOpen, Users, Search,
  ChevronLeft, GraduationCap, Clock,
  CheckCircle2, SlidersHorizontal, X,
} from "lucide-react";

// ─── Mock data (استبدل بـ API) ────────────────────────────────────────────────
const TEACHERS = [
  {
    id: 1, name: "أ. سارة إبراهيم", subject: "الرياضيات",
    rating: 4.9, reviews: 128, students: 94, sessions: 312,
    bio: "معلمة رياضيات بخبرة 8 سنوات، متخصصة في تبسيط المفاهيم الصعبة للمرحلة الإعدادية والثانوية.",
    tags: ["جبر", "هندسة", "تفاضل"], avatar: "س", available: true,
    price: 150, level: "إعدادي وثانوي",
  },
  {
    id: 2, name: "أ. محمد رضا", subject: "اللغة العربية",
    rating: 4.7, reviews: 85, students: 67, sessions: 198,
    bio: "أستاذ لغة عربية وأدب، حاصل على ماجستير في اللغويات. أساعد الطلاب على إتقان النحو والأدب.",
    tags: ["نحو", "أدب", "إنشاء"], avatar: "م", available: true,
    price: 120, level: "ابتدائي وإعدادي",
  },
  {
    id: 3, name: "أ. نهى خالد", subject: "العلوم",
    rating: 4.8, reviews: 102, students: 78, sessions: 245,
    bio: "معلمة علوم وكيمياء بخبرة 6 سنوات، تعتمد على الأمثلة العملية لتوضيح المفاهيم العلمية.",
    tags: ["فيزياء", "كيمياء", "أحياء"], avatar: "ن", available: false,
    price: 140, level: "إعدادي وثانوي",
  },
  {
    id: 4, name: "أ. عمر طارق", subject: "اللغة الإنجليزية",
    rating: 4.6, reviews: 74, students: 55, sessions: 167,
    bio: "متخصص في تدريس اللغة الإنجليزية للمحادثة والكتابة. حاصل على شهادة TEFL دولية.",
    tags: ["محادثة", "قواعد", "كتابة"], avatar: "ع", available: true,
    price: 160, level: "جميع المراحل",
  },
  {
    id: 5, name: "أ. لمياء حسن", subject: "التاريخ والجغرافيا",
    rating: 4.5, reviews: 58, students: 43, sessions: 134,
    bio: "معلمة دراسات اجتماعية بأسلوب تفاعلي وممتع، تجعل الطالب يعيش الأحداث التاريخية.",
    tags: ["تاريخ", "جغرافيا", "تربية"], avatar: "ل", available: true,
    price: 110, level: "إعدادي",
  },
  {
    id: 6, name: "أ. أحمد فؤاد", subject: "الفيزياء",
    rating: 4.9, reviews: 143, students: 112, sessions: 389,
    bio: "دكتوراه في الفيزياء النظرية، خبرة 12 سنة في التدريس الجامعي والثانوي. أعلى معدل نجاح.",
    tags: ["ميكانيكا", "كهرباء", "موجات"], avatar: "أ", available: true,
    price: 200, level: "ثانوي وجامعي",
  },
];

const SUBJECTS = ["الكل", "الرياضيات", "اللغة العربية", "العلوم", "اللغة الإنجليزية", "التاريخ والجغرافيا", "الفيزياء"];

// ─── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </div>
  );
}

// ─── Teacher Card ──────────────────────────────────────────────────────────────
function TeacherCard({ teacher, onRegister }: {
  teacher: typeof TEACHERS[0];
  onRegister: (t: typeof TEACHERS[0]) => void;
}) {
  const avatarColors = [
    "from-amber-400 to-amber-500",
    "from-orange-400 to-orange-500",
    "from-amber-500 to-orange-500",
    "from-yellow-400 to-amber-500",
  ];
  const color = avatarColors[teacher.id % avatarColors.length];

  return (
    <div
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden
                 transition-all duration-300 hover:-translate-y-1 flex flex-col"
      style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(245,158,11,0.15), 0 0 0 1.5px #fbbf2440";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(15,23,42,0.06)";
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-l from-amber-400 to-orange-400" />

      <div className="p-5 flex flex-col flex-1">

        {/* Header: avatar + name + availability */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color}
                             flex items-center justify-center text-white text-xl font-black
                             shadow-md`}>
              {teacher.avatar}
            </div>
            {/* Available indicator */}
            <div className={`absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-full border-2 border-white
                             ${teacher.available ? "bg-emerald-400" : "bg-slate-300"}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-black text-slate-800 text-base leading-tight truncate">
              {teacher.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-0.5">
              <BookOpen size={11} className="text-amber-500 flex-shrink-0" />
              <span className="text-amber-600 text-xs font-semibold truncate">{teacher.subject}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <StarRating rating={teacher.rating} />
              <span className="text-xs font-bold text-slate-700">{teacher.rating}</span>
              <span className="text-xs text-slate-400">({teacher.reviews} تقييم)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 text-center">
            <p className="text-lg font-black text-amber-500 leading-none">{teacher.price}</p>
            <p className="text-[10px] text-slate-400">ج.م/ساعة</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {teacher.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {teacher.tags.map(tag => (
            <span key={tag}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg
                         bg-amber-50 text-amber-700 border border-amber-100">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: Users, label: "طالب", value: teacher.students },
            { icon: Clock, label: "جلسة", value: teacher.sessions },
            { icon: GraduationCap, label: "المرحلة", value: null, text: teacher.level },
          ].map(({ icon: Icon, label, value, text }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-2 text-center">
              <Icon size={12} className="text-amber-400 mx-auto mb-1" strokeWidth={1.8} />
              {text
                ? <p className="text-[10px] font-bold text-slate-600 leading-tight">{text}</p>
                : <p className="text-sm font-black text-slate-700 leading-none">{value?.toLocaleString("ar-EG")}</p>
              }
              {!text && <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onRegister(teacher)}
          disabled={!teacher.available}
          className={`w-full mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl
                      text-sm font-bold transition-all duration-200
                      ${teacher.available
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300 hover:-translate-y-0.5 active:translate-y-0"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
        >
          {teacher.available
            ? <><CheckCircle2 size={14} /> سجّل معه الآن</>
            : "غير متاح حالياً"
          }
        </button>
      </div>
    </div>
  );
}

// ─── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({ teacher, onConfirm, onClose }: {
  teacher: typeof TEACHERS[0];
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <X size={15} />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500
                          flex items-center justify-center text-white text-2xl font-black mx-auto mb-3 shadow-md shadow-amber-200">
            {teacher.avatar}
          </div>
          <h3 className="font-black text-slate-800 text-lg">{teacher.name}</h3>
          <p className="text-amber-600 text-sm font-semibold">{teacher.subject}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <StarRating rating={teacher.rating} />
            <span className="text-xs text-slate-500">{teacher.rating} · {teacher.reviews} تقييم</span>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 text-center">
          <p className="text-xs text-amber-700 font-medium">
            سيتم إرسال طلب التسجيل للأستاذ وسيتواصل معك قريباً
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600
                       text-white text-sm font-bold transition-all shadow-md shadow-amber-200"
          >
            تأكيد التسجيل
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200
                       text-slate-600 text-sm font-semibold transition-all"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Page() {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("الكل");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "students">("rating");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<typeof TEACHERS[0] | null>(null);
  const [registered, setRegistered] = useState<number[]>([]);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleConfirm = () => {
    if (!selectedTeacher) return;
    setRegistered(prev => [...prev, selectedTeacher.id]);
    showToast(`✅ تم إرسال طلب التسجيل مع ${selectedTeacher.name}`);
    setSelectedTeacher(null);
  };

  const filtered = TEACHERS
    .filter(t => {
      const matchSearch = t.name.includes(search) || t.subject.includes(search) || t.tags.some(tag => tag.includes(search));
      const matchSubject = activeSubject === "الكل" || t.subject === activeSubject;
      const matchAvail = !showAvailableOnly || t.available;
      return matchSearch && matchSubject && matchAvail;
    })
    .sort((a, b) =>
      sortBy === "rating" ? b.rating - a.rating :
        sortBy === "price" ? a.price - b.price :
          b.students - a.students
    );

  return (
    <div
      className="min-h-screen bg-slate-50 p-5"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl
                        bg-white border border-amber-100 shadow-xl text-sm font-semibold text-amber-700
                        flex items-center gap-2 pointer-events-none">
          {toast}
        </div>
      )}

      {/* Confirm Modal */}
      {selectedTeacher && (
        <ConfirmModal
          teacher={selectedTeacher}
          onConfirm={handleConfirm}
          onClose={() => setSelectedTeacher(null)}
        />
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-800 mb-0.5">المعلمون المتاحون</h1>
        <p className="text-slate-400 text-xs">اختر المعلم المناسب وسجّل معه مباشرة</p>
      </div>

      {/* ── Search + Filters ─────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-6">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث باسم المعلم أو المادة..."
            className="w-full pr-10 pl-4 py-3 text-sm rounded-2xl border border-slate-200 bg-white
                       focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400
                       text-slate-700 placeholder:text-slate-300 transition-all shadow-sm"
          />
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Sort */}
          <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
            <SlidersHorizontal size={12} className="text-slate-400 mr-1" />
            {(["rating", "price", "students"] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                            ${sortBy === s
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-500 hover:text-amber-600"}`}
              >
                {s === "rating" ? "الأعلى تقييماً" : s === "price" ? "الأقل سعراً" : "الأكثر طلاباً"}
              </button>
            ))}
          </div>

          {/* Available toggle */}
          <button
            onClick={() => setShowAvailableOnly(p => !p)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all
                        ${showAvailableOnly
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-slate-100 text-slate-500 hover:border-amber-200"}`}
          >
            <div className={`w-2 h-2 rounded-full ${showAvailableOnly ? "bg-emerald-400" : "bg-slate-300"}`} />
            متاحون فقط
          </button>

          {/* Count */}
          <span className="text-xs text-slate-400 mr-auto">
            <span className="font-bold text-slate-600">{filtered.length}</span> معلم
          </span>
        </div>

        {/* Subject tabs — scrollable */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUBJECTS.map(subj => (
            <button
              key={subj}
              onClick={() => setActiveSubject(subj)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all
                          ${activeSubject === subj
                  ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200"
                  : "bg-white text-slate-500 border-slate-100 hover:border-amber-300 hover:text-amber-600"}`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* ── Cards Grid ───────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-300">
          <GraduationCap size={48} strokeWidth={1} />
          <p className="text-sm font-medium">لا توجد نتائج مطابقة</p>
          <button onClick={() => { setSearch(""); setActiveSubject("الكل"); }}
            className="text-xs text-amber-500 hover:text-amber-600 font-bold underline underline-offset-2">
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(teacher => (
            <TeacherCard
              key={teacher.id}
              teacher={registered.includes(teacher.id)
                ? { ...teacher, available: false }
                : teacher}
              onRegister={setSelectedTeacher}
            />
          ))}
        </div>
      )}

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}