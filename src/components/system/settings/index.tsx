"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Camera, Bell, BellOff, Check, X, Save,
  Pencil, Lock, Mail, Phone, User,
  AlertTriangle, Eye, EyeOff, ZoomIn, ZoomOut,
  Move, CheckCircle2, Shield, Smartphone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface SettingsUser {
  id:          number;
  role:        UserRole;
  firstName:   string;
  lastName:    string;
  email:       string;
  phone:       string;
  avatarUrl?:  string;
  // role-specific extra fields (optional)
  subject?:    string;   // teacher
  level?:      string;   // student
  childName?:  string;   // parent
}

interface SettingsProps {
  user:     SettingsUser;
  onSave?:  (data: Partial<SettingsUser> & { avatarBase64?: string }) => Promise<void>;
}

// ─── Notification config per role ────────────────────────────────────────────

interface NotifOption { key: string; label: string; desc: string; }

const NOTIF_CONFIG: Record<UserRole, NotifOption[]> = {
  admin: [
    { key: "newUser",      label: "مستخدم جديد",       desc: "عند تسجيل أي مستخدم جديد في النظام"     },
    { key: "newPackage",   label: "طلب باقة",           desc: "عند طلب تفعيل أو تجديد باقة"           },
    { key: "systemAlert",  label: "تنبيهات النظام",     desc: "أخطاء أو تحديثات على مستوى النظام"      },
    { key: "reports",      label: "التقارير الأسبوعية", desc: "ملخص أسبوعي بإحصائيات المنصة"           },
  ],
  teacher: [
    { key: "sessionStart", label: "بدء الجلسة",         desc: "تذكير قبل 15 دقيقة من موعد الجلسة"     },
    { key: "newStudent",   label: "طالب جديد",          desc: "عند انضمام طالب جديد لمادتك"            },
    { key: "studentMsg",   label: "رسائل الطلاب",       desc: "عند إرسال طالب رسالة لك"               },
    { key: "payment",      label: "تأكيد الدفع",        desc: "عند إتمام عملية دفع من طالب"           },
  ],
  student: [
    { key: "sessionRemind",label: "تذكير الجلسة",       desc: "تذكير قبل 30 دقيقة من موعد الجلسة"     },
    { key: "homework",     label: "الواجبات",           desc: "عند إضافة واجب جديد من المعلم"          },
    { key: "grade",        label: "الدرجات",            desc: "عند رصد درجة جديدة"                    },
    { key: "achievement",  label: "الإنجازات",          desc: "عند تحقيق إنجاز أو حصولك على نقاط"     },
  ],
  parent: [
    { key: "childSession", label: "جلسة طفلك",          desc: "تذكير بموعد جلسة طفلك"                 },
    { key: "childGrade",   label: "درجات طفلك",         desc: "عند رصد درجة جديدة لطفلك"              },
    { key: "absence",      label: "الغياب",             desc: "عند تغيب طفلك عن جلسة"                 },
    { key: "payment",      label: "الدفع",              desc: "تذكيرات الاشتراك الشهري"               },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "مدير النظام", teacher: "معلم", student: "طالب", parent: "ولي أمر",
};
const ROLE_COLORS: Record<UserRole, string> = {
  admin:   "from-amber-500 to-orange-500",
  teacher: "from-amber-400 to-amber-600",
  student: "from-orange-400 to-amber-500",
  parent:  "from-stone-400 to-amber-500",
};

// ─── Max size ─────────────────────────────────────────────────────────────────
const MAX_SIZE_MB = 5;
const MAX_SIZE_B  = MAX_SIZE_MB * 1024 * 1024;

// ─── Image Cropper (canvas-based, no lib) ─────────────────────────────────────
interface CropperProps {
  src: string;
  onCrop: (base64: string) => void;
  onCancel: () => void;
}

function ImageCropper({ src, onCrop, onCancel }: CropperProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const imgRef     = useRef<HTMLImageElement | null>(null);
  const [zoom,     setZoom]     = useState(1);
  const [offset,   setOffset]   = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart  = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const SIZE = 300; // output square

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // clip circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    const scale = zoom * Math.min(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
    const w = img.naturalWidth  * scale;
    const h = img.naturalHeight * scale;
    const x = (SIZE - w) / 2 + offset.x;
    const y = (SIZE - h) / 2 + offset.y;
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();

    // ring
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();
  }, [zoom, offset]);

  useEffect(() => {
    const img   = new Image();
    img.onload  = () => { imgRef.current = img; draw(); };
    img.src     = src;
  }, [src]);
  useEffect(() => { draw(); }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.mx),
      y: dragStart.current.oy + (e.clientY - dragStart.current.my),
    });
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onCrop(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
           style={{ boxShadow: "0 30px 80px rgba(0,0,0,0.3)" }}>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-slate-800 text-base">اقتص الصورة</p>
            <p className="text-xs text-slate-400 mt-0.5">اسحب لتحريك · كبّر أو صغّر</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="rounded-full cursor-move"
            style={{ width: 240, height: 240 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
          />
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-all">
            <ZoomOut size={15} />
          </button>
          <input
            type="range" min={0.5} max={3} step={0.05} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-amber-500"
          />
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))}
            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-all">
            <ZoomIn size={15} />
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCrop}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold
                       shadow-md shadow-amber-200 transition-all">
            <Check size={14} /> حفظ الصورة
          </button>
          <button onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all">
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0
                  ${on ? "bg-amber-500 shadow-md shadow-amber-200" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                        transition-all duration-300 ${on ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return <span className="w-4 h-4 rounded-full border-2 border-amber-200 border-t-white animate-spin inline-block" />;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Settings({ user }: SettingsProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  // form
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName,  setLastName]  = useState(user.lastName);
  const [phone,     setPhone]     = useState(user.phone);
  const [extra,     setExtra]     = useState(
    user.subject || user.level || user.childName || ""
  );

  // avatar
  const [avatarSrc,    setAvatarSrc]    = useState(user.avatarUrl || "");
  const [cropSrc,      setCropSrc]      = useState("");
  const [showCropper,  setShowCropper]  = useState(false);
  const [sizeError,    setSizeError]    = useState("");

  // password
  const [oldPass,   setOldPass]   = useState("");
  const [newPass,   setNewPass]   = useState("");
  const [showOld,   setShowOld]   = useState(false);
  const [showNew,   setShowNew]   = useState(false);
  const [passError, setPassError] = useState("");

  // notifications
  const defaultNotifs = Object.fromEntries(
    NOTIF_CONFIG[user.role].map(n => [n.key, true])
  );
  const [notifs, setNotifs] = useState<Record<string, boolean>>(defaultNotifs);

  // saving states
  const [savingProfile,  setSavingProfile]  = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifs,   setSavingNotifs]   = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok"|"err" }|null>(null);

  const showToast = (msg: string, type: "ok"|"err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Image pick ──────────────────────────────────────────────────────────────
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SIZE_B) {
      setSizeError(`حجم الصورة أكبر من ${MAX_SIZE_MB} ميجا — اختر صورة أصغر`);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await onSave?.({
        firstName, lastName, phone,
        ...(user.subject  !== undefined && { subject:   extra }),
        ...(user.level    !== undefined && { level:     extra }),
        ...(user.childName!== undefined && { childName: extra }),
        ...(avatarSrc.startsWith("data:") && { avatarBase64: avatarSrc }),
      });
      showToast("تم حفظ البيانات بنجاح");
    } catch { showToast("فشل الحفظ، حاول مرة أخرى", "err"); }
    finally { setSavingProfile(false); }
  };

  // ── Save password ──────────────────────────────────────────────────────────
  const handleSavePassword = async () => {
    if (!oldPass || !newPass) { setPassError("يرجى ملء الحقلين"); return; }
    if (newPass.length < 8)   { setPassError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return; }
    setPassError("");
    setSavingPassword(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // replace with real API
      showToast("تم تغيير كلمة المرور");
      setOldPass(""); setNewPass("");
    } catch { showToast("فشل تغيير كلمة المرور", "err"); }
    finally { setSavingPassword(false); }
  };

  // ── Save notifications ─────────────────────────────────────────────────────
  const handleSaveNotifs = async () => {
    setSavingNotifs(true);
    await new Promise(r => setTimeout(r, 600));
    showToast("تم حفظ إعدادات الإشعارات");
    setSavingNotifs(false);
  };

  const extraLabel: Record<UserRole, string> = {
    admin:   "", teacher: "التخصص / المادة",
    student: "المستوى الدراسي", parent: "اسم الطفل",
  };

  return (
    <div
      className="min-h-screen bg-slate-50 p-5 space-y-5"
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&display=swap');
        @keyframes fu { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fu { animation: fu .35s ease both; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl shadow-xl
                         text-sm font-bold flex items-center gap-2 pointer-events-none
                         ${toast.type === "ok"
                           ? "bg-white text-amber-700 border border-amber-100"
                           : "bg-white text-red-500 border border-red-100"}`}>
          {toast.type === "ok" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Cropper */}
      {showCropper && (
        <ImageCropper
          src={cropSrc}
          onCrop={b64 => { setAvatarSrc(b64); setShowCropper(false); }}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFilePick} />

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="fu" style={{ animationDelay: "0ms" }}>
        <h1 className="text-xl font-black text-slate-800">الإعدادات والملف الشخصي</h1>
        <p className="text-slate-400 text-xs mt-0.5">إدارة بياناتك وتفضيلات الإشعارات</p>
      </div>

      {/* ── Profile card ─────────────────────────────────────────────────────── */}
      <div className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
           style={{ animationDelay: "60ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>

        {/* Cover banner */}
        <div className={`h-24 w-full bg-gradient-to-l ${ROLE_COLORS[user.role]} relative`}>
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 mb-5">
            <div className="relative">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden
                              bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-amber-600">
                    {user.firstName.charAt(0)}
                  </span>
                )}
              </div>
              {/* Camera button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -left-1 w-7 h-7 rounded-xl bg-amber-500 hover:bg-amber-600
                           flex items-center justify-center shadow-md shadow-amber-200
                           border-2 border-white transition-all hover:scale-110"
              >
                <Camera size={12} className="text-white" />
              </button>
            </div>

            <div className="text-left mb-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-xl
                                bg-gradient-to-l ${ROLE_COLORS[user.role]} text-white shadow-sm`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>

          {/* Name */}
          <p className="font-black text-slate-800 text-lg leading-tight">
            {firstName} {lastName}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>

          {/* Size error */}
          {sizeError && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-red-500 bg-red-50
                          px-3 py-2 rounded-xl border border-red-100">
              <AlertTriangle size={12} className="flex-shrink-0" /> {sizeError}
            </p>
          )}
        </div>
      </div>

      {/* ── Personal info ──────────────────────────────────────────────────────── */}
      <div className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
           style={{ animationDelay: "120ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>

        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <User size={14} className="text-amber-600" />
          </div>
          <h2 className="font-bold text-slate-700 text-sm">البيانات الشخصية</h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* First name */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">الاسم الأول</label>
              <input value={firstName} onChange={e => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 focus:bg-white
                           text-slate-700 transition-all" />
            </div>
            {/* Last name */}
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">اسم العائلة</label>
              <input value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 focus:bg-white
                           text-slate-700 transition-all" />
            </div>
          </div>

          {/* Email — readonly */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Mail size={11} className="text-amber-500" /> البريد الإلكتروني
              <span className="text-slate-300 font-normal">(لا يمكن تغييره)</span>
            </label>
            <input value={user.email} readOnly
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-100 bg-slate-50
                         text-slate-400 cursor-not-allowed" />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Phone size={11} className="text-amber-500" /> رقم الهاتف
            </label>
            <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50
                         focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 focus:bg-white
                         text-slate-700 transition-all" dir="ltr" />
          </div>

          {/* Extra field (role-specific) */}
          {user.role !== "admin" && (
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Pencil size={11} className="text-amber-500" /> {extraLabel[user.role]}
              </label>
              <input value={extra} onChange={e => setExtra(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 focus:bg-white
                           text-slate-700 transition-all" />
            </div>
          )}

          <button onClick={handleSaveProfile} disabled={savingProfile}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold
                       transition-all shadow-md shadow-amber-200 disabled:opacity-60">
            {savingProfile ? <Spinner /> : <Save size={14} />}
            حفظ البيانات
          </button>
        </div>
      </div>

      {/* ── Password ──────────────────────────────────────────────────────────── */}
      <div className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
           style={{ animationDelay: "180ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>

        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
            <Shield size={14} className="text-amber-600" />
          </div>
          <h2 className="font-bold text-slate-700 text-sm">تغيير كلمة المرور</h2>
        </div>

        <div className="p-5 space-y-3">
          {/* Old password */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Lock size={11} className="text-amber-500" /> كلمة المرور الحالية
            </label>
            <div className="relative">
              <input type={showOld ? "text" : "password"} value={oldPass}
                onChange={e => setOldPass(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 text-sm rounded-xl border border-slate-200 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 focus:bg-white
                           text-slate-700 transition-all" />
              <button onClick={() => setShowOld(s => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors">
                {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Lock size={11} className="text-amber-500" /> كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={newPass}
                onChange={e => setNewPass(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 text-sm rounded-xl border border-slate-200 bg-slate-50
                           focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400 focus:bg-white
                           text-slate-700 transition-all" />
              <button onClick={() => setShowNew(s => !s)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors">
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {/* Strength bar */}
            {newPass && (
              <div className="mt-2">
                <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500
                    ${newPass.length < 6 ? "w-1/4 bg-red-400" : newPass.length < 10 ? "w-2/4 bg-amber-400" : "w-full bg-emerald-400"}`} />
                </div>
                <p className={`text-[10px] mt-1 font-medium
                  ${newPass.length < 6 ? "text-red-400" : newPass.length < 10 ? "text-amber-500" : "text-emerald-500"}`}>
                  {newPass.length < 6 ? "ضعيفة" : newPass.length < 10 ? "متوسطة" : "قوية"}
                </p>
              </div>
            )}
          </div>

          {passError && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
              <AlertTriangle size={11} /> {passError}
            </p>
          )}

          <button onClick={handleSavePassword} disabled={savingPassword}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold
                       transition-all shadow-md shadow-amber-200 disabled:opacity-60">
            {savingPassword ? <Spinner /> : <Lock size={14} />}
            تغيير كلمة المرور
          </button>
        </div>
      </div>

      {/* ── Notifications ─────────────────────────────────────────────────────── */}
      <div className="fu bg-white rounded-2xl border border-slate-100 overflow-hidden"
           style={{ animationDelay: "240ms", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>

        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <Smartphone size={14} className="text-amber-600" />
            </div>
            <h2 className="font-bold text-slate-700 text-sm">إعدادات الإشعارات</h2>
          </div>
          {/* Master toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">الكل</span>
            <Toggle
              on={Object.values(notifs).every(Boolean)}
              onChange={v => setNotifs(Object.fromEntries(Object.keys(notifs).map(k => [k, v])))}
            />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {NOTIF_CONFIG[user.role].map((opt, i) => (
            <div key={opt.key}
                 className="fu flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 transition-colors"
                 style={{ animationDelay: `${280 + i * 40}ms` }}>
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                                 ${notifs[opt.key] ? "bg-amber-50" : "bg-slate-50"}`}>
                  {notifs[opt.key]
                    ? <Bell     size={14} className="text-amber-500" />
                    : <BellOff  size={14} className="text-slate-400" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{opt.label}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                </div>
              </div>
              <Toggle on={notifs[opt.key]} onChange={v => setNotifs(n => ({ ...n, [opt.key]: v }))} />
            </div>
          ))}
        </div>

        <div className="px-5 pb-5 pt-3">
          <button onClick={handleSaveNotifs} disabled={savingNotifs}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                       bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold
                       transition-all shadow-md shadow-amber-200 disabled:opacity-60">
            {savingNotifs ? <Spinner /> : <Bell size={14} />}
            حفظ إعدادات الإشعارات
          </button>
        </div>
      </div>
    </div>
  );
}