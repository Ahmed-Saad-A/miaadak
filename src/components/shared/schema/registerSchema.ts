import { z } from "zod";
import { GENDER, USER_ROLES } from "@/interfaces";

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
        .nonempty("الاسم الأول مطلوب")
        .regex(/^01[0-9]{9}$/, "رقم الهاتف غير صالح")
        .min(11, "رقم الهاتف يجب أن يكون 11 رقمًا"),
});

