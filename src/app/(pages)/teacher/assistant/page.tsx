"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Lock, Unlock, Trash2, MessageCircle, Mail, Phone, Search, UserX, CheckCircle, Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Assistant } from "@/interfaces/assistant";
import { AssistantForm } from "@/components";
import { getMockAssistants } from "@/lib/mockAssistantsData";
import { useSession } from "next-auth/react";



const TeacherAssistant = () => {
  const { data: session } = useSession();
  const teacherId = (session?.user as { id?: string })?.id ?? "";
 
  const [assistants,         setAssistants]         = useState<Assistant[]>([]);
  const [filteredAssistants, setFilteredAssistants] = useState<Assistant[]>([]);
  const [isLoading,          setIsLoading]          = useState(false);
  const [showForm,           setShowForm]           = useState(false);
  const [searchQuery,        setSearchQuery]        = useState("");
  const [filterStatus,       setFilterStatus]       = useState<"all" | "active" | "locked">("all");
 
  useEffect(() => {
    if (teacherId) fetchAssistants();
  }, [teacherId]);

  // Filter Assistants
  useEffect(() => {
    let filtered = assistants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === "active") {
      filtered = filtered.filter((a) => !a.isLocked);
    } else if (filterStatus === "locked") {
      filtered = filtered.filter((a) => a.isLocked);
    }

    setFilteredAssistants(filtered);
  }, [assistants, searchQuery, filterStatus]);

  const fetchAssistants = async () => {
    setIsLoading(true);
    try {
      const data = await getMockAssistants(teacherId);
      setAssistants(data as Assistant[]);
    } catch (error) {
      console.error("Error fetching assistants:", error);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };


  const handleFormSuccess = () => {
    setShowForm(false);
    fetchAssistants();
    toast.success("تم إضافة المساعد بنجاح");
  };

  const handleDelete = async (assistantId: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف المساعد "${name}"؟`)) {
      try {
        const response = await fetch(`/api/assistants/${assistantId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setAssistants((prev) => prev.filter((a) => a.id !== assistantId));
          toast.success("تم حذف المساعد بنجاح");
        }
      } catch (error) {
        console.error("Error deleting assistant:", error);
        toast.error("حدث خطأ أثناء حذف المساعد");
      }
    }
  };

  const handleToggleLock = async (assistantId: string, isLocked: boolean, name: string) => {
    try {
      const response = await fetch(`/api/assistants/${assistantId}/lock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isLocked }),
      });

      if (response.ok) {
        setAssistants((prev) =>
          prev.map((a) => (a.id === assistantId ? { ...a, isLocked } : a))
        );
        toast.success(
          isLocked ? `تم قفل حساب ${name}` : `تم إلغاء قفل حساب ${name}`
        );
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
      toast.error("حدث خطأ أثناء تحديث الحالة");
    }
  };

  const handleSendMessage = (assistant: Assistant) => {
    // Implement your messaging logic here
    toast.success(`فتح محادثة مع ${assistant.firstName}`);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getPermissionsCount = (assistant: Assistant) => {
    let count = 0;
    if (assistant.canManageStudents) count++;
    if (assistant.canManageSessions) count++;
    if (assistant.canManageAttendance) count++;
    if (assistant.canManageExams) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                المساعدين
              </h1>
              <p className="text-gray-600">
                إدارة ومتابعة فريق المساعدين الخاص بك
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              <Plus className="w-6 h-6" />
              <span>إضافة مساعد جديد</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">إجمالي المساعدين</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {assistants.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">الحسابات النشطة</p>
                  <p className="text-3xl font-bold text-green-600">
                    {assistants.filter((a) => !a.isLocked).length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">الحسابات المقفلة</p>
                  <p className="text-3xl font-bold text-red-600">
                    {assistants.filter((a) => a.isLocked).length}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">متوسط الصلاحيات</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {assistants.length > 0
                      ? Math.round(
                        assistants.reduce(
                          (acc, a) => acc + getPermissionsCount(a),
                          0
                        ) / assistants.length
                      )
                      : 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن مساعد بالاسم أو البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-400 transition-all text-right"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === "all"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilterStatus("active")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === "active"
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                نشط
              </button>
              <button
                onClick={() => setFilterStatus("locked")}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${filterStatus === "locked"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                مقفل
              </button>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : filteredAssistants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-md"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserX className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              لا توجد نتائج
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "لم يتم العثور على مساعدين مطابقين للبحث"
                : "لم يتم إضافة أي مساعدين بعد"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة مساعد جديد</span>
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssistants.map((assistant, index) => (
              <motion.div
                key={assistant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Card Content - 2/3 للصورة */}
                <div className="relative h-64 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${assistant.isLocked
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                        }`}
                    >
                      {assistant.isLocked ? "مقفل" : "نشط"}
                    </span>
                  </div>

                  {/* Profile Image or Initials */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {assistant.profileImage ? (
                        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                          <Image
                            src={assistant.profileImage}
                            alt={`${assistant.firstName} ${assistant.lastName}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-2xl">
                          <span className="text-6xl font-bold text-orange-600">
                            {getInitials(assistant.firstName, assistant.lastName)}
                          </span>
                        </div>
                      )}
                    </div>

                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full" />
                  </div>
                </div>

                {/* Card Info - 1/3 للمعلومات والأزرار */}
                <div className="p-6">
                  {/* Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1 text-right truncate">
                    {assistant.firstName} {assistant.lastName}
                  </h3>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm justify-end">
                      <span className="truncate" dir="ltr">
                        {assistant.email}
                      </span>
                      <Mail className="w-4 h-4 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm justify-end">
                      <span dir="ltr">{assistant.phoneNumber}</span>
                      <Phone className="w-4 h-4 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Permissions Count */}
                  <div className="flex items-center justify-end gap-2 mb-4 text-sm">
                    <span className="text-gray-600">
                      {getPermissionsCount(assistant)} صلاحيات
                    </span>
                    <Shield className="w-4 h-4 text-orange-500" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Send Message */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage(assistant)}
                      className="flex-1 p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                      title="إرسال رسالة"
                    >
                      <MessageCircle className="w-5 h-5 mx-auto" />
                    </motion.button>

                    {/* Toggle Lock */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleToggleLock(
                          assistant.id,
                          !assistant.isLocked,
                          assistant.firstName
                        )
                      }
                      className={`flex-1 p-3 rounded-xl transition-all ${assistant.isLocked
                        ? "bg-green-50 hover:bg-green-100 text-green-600"
                        : "bg-yellow-50 hover:bg-yellow-100 text-yellow-600"
                        }`}
                      title={assistant.isLocked ? "إلغاء القفل" : "قفل الحساب"}
                    >
                      {assistant.isLocked ? (
                        <Unlock className="w-5 h-5 mx-auto" />
                      ) : (
                        <Lock className="w-5 h-5 mx-auto" />
                      )}
                    </motion.button>

                    {/* Delete */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleDelete(
                          assistant.id,
                          `${assistant.firstName} ${assistant.lastName}`
                        )
                      }
                      className="flex-1 p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                      title="حذف المساعد"
                    >
                      <Trash2 className="w-5 h-5 mx-auto" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl my-8"
            >
              <div className="relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute -top-4 -left-4 z-10 p-3 bg-white rounded-full shadow-xl hover:bg-gray-100 transition-all"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>

                <AssistantForm
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherAssistant;