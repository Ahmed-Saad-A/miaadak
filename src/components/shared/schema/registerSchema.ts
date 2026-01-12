import { z } from "zod";

export const stepOneSchema = z.object({
    firstName: z.string().nonempty("الاسم الأول مطلوب").min(3, "الاسم يجب ألا يقل عن 3 أحرف"),
    lastName: z.string().nonempty("الاسم الأخير مطلوب").min(3, "الاسم الأخير يجب ألا يقل عن 3 أحرف"),
    email: z.string().email("البريد الإلكتروني غير صالح"),
});

export const stepTwoSchema = z
    .object({
        password: z
            .string()
            .nonempty("الاسم الأول مطلوب")
            .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
            .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
            .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
            .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
            .regex(/[@$!%*?&]/, "يجب أن تحتوي على رمز خاص واحد على الأقل"),
        confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "كلمتا المرور غير متطابقتين",
        path: ["confirmPassword"],
    });

export const stepThreeSchema = z.object({
    phoneNumber: z
        .string()
        .nonempty("رقم الهاتف مطلوب")
        .regex(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
        .min(11, "رقم الهاتف يجب أن يكون 11 رقمًا"),
    gender: z.number().min(0).max(1, "الجنس مطلوب"),
});

export const stepFourSchema = z.object({
    address: z.string().nonempty("العنوان مطلوب").min(3, "العنوان يجب ألا يقل عن 3 أحرف"),
    birthDate: z.string().nonempty("تاريخ الميلاد مطلوب").refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        return selectedDate < today;
    }, "تاريخ الميلاد يجب أن يكون في الماضي"),
});

export const stepFiveTeacherSchema = z.object({
    subjectId: z.array(z.number()).min(1, "يرجى اختيار مادة واحدة على الأقل"),
    experienceYears: z.number().min(0, "سنوات الخبرة يجب ألا تكون أقل من 0"),
});

// الحفاظ على الاسم السابق للتوافق
export const stepFiveSchema = stepFiveTeacherSchema;

export const stepFiveStudentSchema = z.object({
    parentPhone: z
        .string()
        .nonempty("رقم هاتف ولي الأمر مطلوب")
        .regex(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
        .min(11, "رقم الهاتف يجب أن يكون 11 رقمًا"),
    levelId: z.number().min(1, "الصف الدراسي مطلوب").max(12, "الصف غير صالح"),
    school: z.string().nonempty("اسم المدرسة مطلوب").min(2, "اسم المدرسة قصير جدًا"),
});

