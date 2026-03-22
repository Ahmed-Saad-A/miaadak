"use client";

import { useState } from "react";
import {
    Bell, BellOff, Check, CheckCheck, Trash2, X,
    CalendarDays, TrendingUp, CreditCard, MessageSquare,
    AlertTriangle, Award, Settings, Users,
    RefreshCw, Clock,
    BookOpen, GraduationCap, UserCheck, User,
} from "lucide-react";

export type UserRole = "teacher" | "student" | "parent" | "assistant";
type Cat = "session" | "grade" | "payment" | "message" | "absence" | "achievement" | "system" | "user";

interface Notif {
    id: number; cat: Cat; title: string; body: string;
    time: string; read: boolean; urgent?: boolean;
}

const ROLE_CFG: Record<UserRole, { label: string; icon: React.ElementType }> = {
    teacher: { label: "معلم", icon: BookOpen },
    student: { label: "طالب", icon: GraduationCap },
    parent: { label: "ولي أمر", icon: User },
    assistant: { label: "مساعد", icon: UserCheck },
};

const CAT_CFG: Record<Cat, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    session: { label: "جلسة", icon: CalendarDays, color: "text-amber-700", bg: "bg-amber-50" },
    grade: { label: "درجة", icon: TrendingUp, color: "text-orange-700", bg: "bg-orange-50" },
    payment: { label: "درجة", icon: CreditCard, color: "text-amber-800", bg: "bg-amber-50" },
    message: { label: "رسالة", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
    absence: { label: "غياب", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    achievement: { label: "إنجاز", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
    system: { label: "نظام", icon: Settings, color: "text-stone-500", bg: "bg-stone-50" },
    user: { label: "مستخدم", icon: Users, color: "text-amber-700", bg: "bg-amber-50" },
};

// fix label overrides
const CAT_LABEL: Record<Cat, string> = {
    session: "جلسة", grade: "درجة", payment: "دفع", message: "رسالة",
    absence: "غياب", achievement: "إنجاز", system: "نظام", user: "مستخدم",
};

const MOCK: Record<UserRole, Notif[]> = {
    teacher: [
        { id: 1, cat: "session", title: "جلسة على وشك البدء", body: "جلسة الرياضيات مع طلاب الصف الثالث تبدأ خلال 15 دقيقة، تأكد من الاستعداد الكامل", time: "منذ دقيقتين", read: false, urgent: true },
        { id: 2, cat: "user", title: "طالب جديد انضم لمادتك", body: "انضم أحمد محمود إلى مادة الرياضيات وينتظر موافقتك على طلب الاشتراك", time: "منذ 18 دقيقة", read: false },
        { id: 3, cat: "message", title: "رسالة واردة من طالب", body: 'نور خالد: "هل يمكن تعديل موعد الجلسة القادمة؟ لدي ظرف عائلي طارئ"', time: "منذ 42 دقيقة", read: false },
        { id: 4, cat: "absence", title: "تسجيل غياب طالب", body: "لم يحضر كريم سالم جلسة أمس ولم يُرسل أي إشعار مسبق، يُنصح بالتواصل معه", time: "منذ يوم", read: false },
        { id: 5, cat: "payment", title: "دفعة مستلمة بنجاح", body: "تم استلام 150 ج.م من الطالب عمر طارق، الرصيد محدّث في حسابك", time: "منذ يوم", read: true },
        { id: 6, cat: "session", title: "جلسة مجدولة تلقائياً", body: "تمت إضافة جلسة إنجليزي يوم الأحد القادم الساعة 3 مساءً بناءً على طلب الطالب", time: "منذ يومين", read: true },
        { id: 7, cat: "message", title: "رد من ولي الأمر", body: 'والد أحمد: "شكراً جزيلاً على المتابعة المستمرة، الطفل يتحسن بشكل واضح هذا الشهر"', time: "منذ 3 أيام", read: true },
        { id: 8, cat: "system", title: "تحديث بنود الاستخدام", body: "تم تعديل سياسة الاسترداد والإلغاء، يُرجى مراجعة الشروط الجديدة قبل الجلسة القادمة", time: "منذ أسبوع", read: true },
    ],
    student: [
        { id: 1, cat: "session", title: "جلسة تبدأ خلال 30 دقيقة", body: "جلسة الرياضيات مع أ. سارة إبراهيم — احرص على تجهيز الأوراق والآلة الحاسبة الآن", time: "منذ 4 دقائق", read: false, urgent: true },
        { id: 2, cat: "grade", title: "صدرت نتيجة اختبارك", body: "حصلت على 92 من 100 في اختبار الجبر — أداء استثنائي! أنت في المركز الأول على مستوى المجموعة", time: "منذ 3 ساعات", read: false },
        { id: 3, cat: "achievement", title: "فتحت إنجازاً جديداً!", body: "أكملت 10 جلسات متتالية دون انقطاع — حصلت على وسام المثابرة الذهبي و 100 نقطة في رصيدك", time: "منذ 5 ساعات", read: false },
        { id: 4, cat: "message", title: "ردّ جديد من المعلمة", body: 'أ. سارة: "أداء ممتاز في الاختبار! أسلوبك في حل المسائل المركبة تطور بشكل ملحوظ"', time: "منذ يوم", read: true },
        { id: 5, cat: "session", title: "تم إلغاء جلسة", body: "أُلغيت جلسة الإنجليزي يوم الثلاثاء القادم بسبب ظرف طارئ — سيتم إعادة الجدولة قريباً", time: "منذ يومين", read: true },
        { id: 6, cat: "grade", title: "تصحيح الواجب المنزلي", body: "تم تصحيح واجب المعادلات التربيعية — حصلت على 18 من 20، مراجعة السؤال الثالث مطلوبة", time: "منذ 3 أيام", read: true },
        { id: 7, cat: "achievement", title: "ارتقيت لمستوى جديد!", body: "وصلت إلى مستوى المتفوق بتراكم 500 نقطة — مبروك! استمر في هذا المستوى الرائع", time: "منذ 4 أيام", read: true },
        { id: 8, cat: "system", title: "اشتراكك ينتهي قريباً", body: "ينتهي اشتراكك الشهري خلال 5 أيام، تواصل مع ولي أمرك لإتمام التجديد وضمان الاستمرارية", time: "منذ أسبوع", read: true },
    ],
    parent: [
        { id: 1, cat: "absence", title: "تنبيه غياب عاجل لطفلك", body: "لم يحضر أحمد جلسة الإنجليزي المقررة أمس ولم يُبلّغ عن أي مبرر — يُرجى المتابعة فوراً", time: "منذ 8 دقائق", read: false, urgent: true },
        { id: 2, cat: "session", title: "جلسة طفلك تبدأ بعد ساعة", body: "جلسة الرياضيات لأحمد مع أ. سارة الساعة 4 مساءً — تأكد من جاهزيته وتوافره في المنزل", time: "منذ 25 دقيقة", read: false },
        { id: 3, cat: "grade", title: "نتيجة جديدة لأحمد", body: "حصل أحمد على 88 من 100 في اختبار اللغة العربية — أداء جيد جداً يستحق التشجيع والمكافأة", time: "منذ 4 ساعات", read: false },
        { id: 4, cat: "payment", title: "الاشتراك يستحق التجديد", body: "ينتهي الاشتراك الشهري لأحمد خلال 3 أيام — قيمة التجديد 450 ج.م لضمان استمرارية الدراسة", time: "منذ يوم", read: false },
        { id: 5, cat: "message", title: "رسالة من معلم أحمد", body: 'أ. سارة: "أحمد يُبدي تحسناً ملحوظاً هذا الشهر، يحتاج فقط لمزيد من التركيز في الهندسة"', time: "منذ يومين", read: true },
        { id: 6, cat: "achievement", title: "إنجاز رائع لأحمد", body: "أكمل أحمد 5 جلسات متتالية وحصل على وسام الاجتهاد الفضي — مبروك لك ولطفلك المجتهد", time: "منذ 3 أيام", read: true },
        { id: 7, cat: "session", title: "جلسة مكتملة بنجاح", body: "أتم أحمد جلسة العلوم مع أ. نهى خالد بنجاح تام — تقرير الجلسة متاح في ملفه الشخصي", time: "منذ 4 أيام", read: true },
        { id: 8, cat: "payment", title: "تأكيد استلام الدفعة", body: "تم استلام دفعة اشتراك شهر مارس بقيمة 450 ج.م — إيصال الدفع أُرسل على بريدك الإلكتروني", time: "منذ أسبوع", read: true },
    ],
    assistant: [
        { id: 1, cat: "session", title: "مطلوب حضورك في جلسة", body: "طلبت أ. سارة إبراهيم مساعدتك في جلسة الرياضيات المكثفة اليوم الساعة الرابعة مساءً", time: "منذ 3 دقائق", read: false, urgent: true },
        { id: 2, cat: "message", title: "تكليف من المعلمة", body: 'أ. سارة: "يرجى مراجعة وتصحيح واجبات مجموعة الصف الثالث وإرسال التقرير قبل الجلسة القادمة"', time: "منذ 22 دقيقة", read: false },
        { id: 3, cat: "user", title: "طالب يحتاج دعماً إضافياً", body: "انضم خالد يوسف حديثاً ويحتاج مساعدة مكثفة للحاق بالمنهج — يُرجى وضع خطة متابعة خاصة له", time: "منذ 50 دقيقة", read: false },
        { id: 4, cat: "session", title: "تغيير في الجدول", body: "نُقل موعد جلسة الأربعاء من الساعة الثالثة إلى الخامسة — يُرجى تحديث جدولك الشخصي", time: "منذ 3 ساعات", read: false },
        { id: 5, cat: "absence", title: "طالب غائب يتطلب متابعة", body: "لم يحضر محمد كريم الجلسة الصباحية للمرة الثانية هذا الأسبوع — يرجى التواصل معه اليوم", time: "منذ يوم", read: true },
        { id: 6, cat: "message", title: "تذكير إرسال التقرير", body: "التقرير الأسبوعي لمتابعة الطلاب مطلوب من المشرف قبل نهاية ساعات العمل اليوم", time: "منذ يومين", read: true },
        { id: 7, cat: "system", title: "صلاحيات محدّثة لحسابك", body: "تم توسيع صلاحياتك كمساعد — يمكنك الآن الاطلاع على تقارير الطلاب التفصيلية وتعديل الجدول", time: "منذ 3 أيام", read: true },
        { id: 8, cat: "session", title: "تقييم الجلسة مطلوب", body: "أضف ملاحظاتك وتقييمك لجلسة الأمس في النظام — مطلوب قبل الجلسة القادمة لإتمام السجل", time: "منذ 4 أيام", read: true },
    ],
};

function timeGroup(t: string) {
    if (t.includes("دقيق") || t.includes("ساعة") || t.includes("ساعتين")) return "اليوم";
    if (t.includes("يوم") && !t.includes("يومين") && !t.includes("أيام")) return "أمس";
    return "سابقاً";
}
const GROUP_ORDER = ["اليوم", "أمس", "سابقاً"];

// ── Single Card ──────────────────────────────────────────────────────────
function Card({ n, onRead, onDel }: { n: Notif; onRead: (id: number) => void; onDel: (id: number) => void }) {
    const [leaving, setLeaving] = useState(false);
    const cfg = CAT_CFG[n.cat];
    const Icon = cfg.icon;

    return (
        <div
            onClick={() => !n.read && onRead(n.id)}
            className={`group relative flex gap-4 p-4 rounded-2xl cursor-pointer
                  transition-all duration-300 hover:-translate-y-0.5
                  ${leaving ? "opacity-0 scale-95" : "opacity-100"}
                  ${n.read
                    ? "bg-gradient-to-br from-amber-700/10 to-amber-600/5 border border-amber-200/50"
                    : "bg-gradient-to-br from-amber-700 to-amber-600 shadow-lg shadow-amber-700/25"
                }`}
        >
            {/* Unread bar */}
            {!n.read && (
                <div className="absolute right-0 top-3 bottom-3 w-[3px] rounded-l-full bg-white/60" />
            )}

            {/* Icon bubble */}
            <div className={`relative flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center
                       transition-transform duration-200 group-hover:scale-105
                       ${n.read ? `${cfg.bg} border border-amber-200` : "bg-white/20 border border-white/30"}`}>
                <Icon size={18}
                    className={n.read ? cfg.color : "text-white"}
                    strokeWidth={1.8} />
                {!n.read && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-amber-600 bg-white" />
                )}
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-[13px] leading-snug font-bold truncate
                         ${n.read ? "text-amber-900" : "text-white"}`}>
                        {n.title}
                    </p>

                    {/* Hover actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {!n.read && (
                            <button
                                onClick={e => { e.stopPropagation(); onRead(n.id); }}
                                className="w-6 h-6 rounded-lg flex items-center justify-center
                           bg-white/20 hover:bg-white/40 transition-all">
                                <Check size={11} className="text-white" strokeWidth={2.5} />
                            </button>
                        )}
                        <button
                            onClick={e => { e.stopPropagation(); setLeaving(true); setTimeout(() => onDel(n.id), 280); }}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all
                          ${n.read
                                    ? "bg-amber-100 hover:bg-red-100 text-amber-400 hover:text-red-500"
                                    : "bg-white/20 hover:bg-red-400/40 text-white"}`}>
                            <X size={11} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                <p className={`text-xs leading-relaxed mb-2.5 line-clamp-2
                       ${n.read ? "text-amber-700/70" : "text-amber-100/90"}`}>
                    {n.body}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                            ${n.read
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-white/20 text-white border border-white/20"}`}>
                        {CAT_LABEL[n.cat]}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px]
                            ${n.read ? "text-amber-400" : "text-amber-200"}`}>
                        <Clock size={9} /> {n.time}
                    </span>
                    {n.urgent && !n.read && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full
                             bg-red-500/30 text-red-100 border border-red-300/30">
                            عاجل
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────
interface Props { role: UserRole }

export default function Notifications({ role }: Props) {
    const roleCfg = ROLE_CFG[role];
    const RoleIcon = roleCfg.icon;

    const [notifs, setNotifs] = useState<Notif[]>(MOCK[role]);
    const [filter, setFilter] = useState<Cat | "all">("all");
    const [spinning, setSpin] = useState(false);

    const unread = notifs.filter(n => !n.read).length;
    const urgent = notifs.filter(n => !n.read && n.urgent).length;

    const markOne = (id: number) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
    const markAll = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
    const delOne = (id: number) => setNotifs(p => p.filter(n => n.id !== id));
    const delAll = () => setNotifs([]);
    const refresh = async () => { setSpin(true); await new Promise(r => setTimeout(r, 900)); setSpin(false); };

    const visible = notifs.filter(n => filter === "all" || n.cat === filter);
    const cats = Array.from(new Set(notifs.map(n => n.cat)));

    const grouped = GROUP_ORDER.reduce<Record<string, Notif[]>>((acc, g) => {
        const items = visible.filter(n => timeGroup(n.time) === g);
        if (items.length) acc[g] = items;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-100 p-4 space-y-3" dir="rtl"
            style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        @keyframes fi  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rng { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-13deg)} 40%{transform:rotate(13deg)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(8deg)} }
        .fi  { animation: fi  .35s cubic-bezier(.22,1,.36,1) both; }
        .rng { animation: rng .65s ease both; }
        .no-scroll::-webkit-scrollbar{display:none} .no-scroll{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

            {/* ══ DIV 1 — HEADER & FILTERS ══════════════════════════════════════ */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Top row */}
                <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {/* Bell */}
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-600
                              flex items-center justify-center shadow-md shadow-amber-700/30">
                                <Bell size={20} className={`text-white ${unread > 0 ? "rng" : ""}`} strokeWidth={2.2} />
                            </div>
                            {unread > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full
                                bg-red-500 border-2 border-white flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white leading-none px-0.5">
                                        {unread > 9 ? "9+" : unread}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h1 className="text-lg font-black text-slate-800 leading-none">الإشعارات</h1>
                                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5
                                 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                                    <RoleIcon size={9} />
                                    {roleCfg.label}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400">
                                {unread > 0
                                    ? <><span className="font-bold text-amber-700">{unread}</span> إشعار غير مقروء</>
                                    : "لا توجد إشعارات جديدة"
                                }
                            </p>
                        </div>
                    </div>

                    <button onClick={refresh}
                        className="w-9 h-9 rounded-xl flex items-center justify-center
                       bg-amber-50 border border-amber-200 text-amber-700
                       hover:bg-amber-100 transition-all">
                        <RefreshCw size={14} className={spinning ? "animate-spin" : ""} />
                    </button>
                </div>

                {/* Urgent strip */}
                {urgent > 0 && (
                    <div className="mx-4 mb-3 flex items-center gap-2.5 px-4 py-2.5
                          rounded-xl bg-red-50 border border-red-100">
                        <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />
                        <p className="text-xs font-bold text-red-600">
                            {urgent} إشعار{urgent > 1 ? "ات" : ""} عاجلة تحتاج انتباهك الآن
                        </p>
                    </div>
                )}

                {/* Filter pills */}
                <div className="px-4 pb-4 flex items-center gap-2 overflow-x-auto no-scroll">
                    <button onClick={() => setFilter("all")}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                        text-xs font-bold transition-all duration-200
                        ${filter === "all"
                                ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-700/30"
                                : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"}`}>
                        <Bell size={10} />
                        الكل
                        {notifs.length > 0 && (
                            <span className={`text-[10px] font-black ${filter === "all" ? "opacity-80" : "opacity-60"}`}>
                                {notifs.length}
                            </span>
                        )}
                    </button>

                    {cats.map(c => {
                        const CIcon = CAT_CFG[c].icon;
                        const active = filter === c;
                        return (
                            <button key={c} onClick={() => setFilter(c)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full
                            text-xs font-bold transition-all duration-200
                            ${active
                                        ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-700/30"
                                        : "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"}`}>
                                <CIcon size={10} />
                                {CAT_LABEL[c]}
                            </button>
                        );
                    })}
                </div>

                {/* Bulk actions */}
                {unread > 0 && (
                    <div className="px-5 py-3 flex items-center gap-4 border-t border-slate-100">
                        <button onClick={markAll}
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors">
                            <CheckCheck size={13} /> تعيين الكل مقروءاً
                        </button>
                        <span className="text-slate-200">|</span>
                        <button onClick={delAll}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={12} /> مسح الكل
                        </button>
                    </div>
                )}
            </div>

            {/* ══ DIV 2 — NOTIFICATIONS LIST ════════════════════════════════════ */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {visible.length === 0 ? (
                    <div className="fi flex flex-col items-center justify-center py-24 gap-4">
                        <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-100
                            flex items-center justify-center">
                            <BellOff size={34} className="text-amber-300" strokeWidth={1.2} />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="font-black text-slate-600 text-sm">لا توجد إشعارات</p>
                            <p className="text-slate-400 text-xs">
                                {filter !== "all"
                                    ? `لا يوجد شيء في تصنيف "${CAT_LABEL[filter as Cat]}"`
                                    : "ستظهر هنا إشعاراتك الجديدة"}
                            </p>
                        </div>
                        {filter !== "all" && (
                            <button onClick={() => setFilter("all")}
                                className="text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors">
                                عرض كل الإشعارات ←
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {Object.entries(grouped).map(([group, items]) => (
                            <div key={group} className="fi space-y-2">
                                {/* Group label */}
                                <div className="flex items-center gap-3 px-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
                                        {group}
                                    </span>
                                    <div className="flex-1 h-px bg-slate-100" />
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50
                                   border border-slate-100 px-2 py-0.5 rounded-full">
                                        {items.length}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="space-y-2">
                                    {items.map(n => (
                                        <Card key={n.id} n={n} onRead={markOne} onDel={delOne} />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Footer */}
                        <div className="flex items-center justify-center gap-2 pt-2 pb-1">
                            <div className="w-1 h-1 rounded-full bg-amber-200" />
                            <span className="text-[11px] text-slate-400">
                                {notifs.length} إشعار · {notifs.filter(n => n.read).length} مقروء
                            </span>
                            <div className="w-1 h-1 rounded-full bg-amber-200" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}