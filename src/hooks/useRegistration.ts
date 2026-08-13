import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { servicesApi } from '@/services/authApi';
import {
    UserRegistration,
    USER_ROLES,
    TeacherFormData,
    StudentFormData,
    ParentFormData,
} from '@/interfaces';
import { AssistantFormData } from '@/interfaces/assistant';
import {
    stepOneSchema,
    stepTwoSchema,
    stepThreeSchema,
    stepFourSchema,
    stepFiveTeacherSchema,
    stepFiveStudentSchema,
} from '@/components/shared/schema/registerSchema';
import { ZodError, ZodSchema } from 'zod';

interface UseRegistrationProps {
    userRole: number;
}

export const useRegistration = ({ userRole }: UseRegistrationProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors,    setErrors]    = useState<Record<string, string>>({});
    const router = useRouter();

    // ─── Schemas per role ─────────────────────────────────────────────────────
    const teacherSchemas = [
        { schema: stepOneSchema,          fields: ['firstName', 'lastName', 'email']        },
        { schema: stepTwoSchema,          fields: ['password', 'confirmPassword']            },
        { schema: stepThreeSchema,        fields: ['phoneNumber', 'gender']                  },
        { schema: stepFourSchema,         fields: ['address', 'birthDate']                   },
        { schema: stepFiveTeacherSchema,  fields: ['subjectId', 'experienceYears']           },
    ];

    const studentSchemas = [
        { schema: stepOneSchema,          fields: ['firstName', 'lastName', 'email']        },
        { schema: stepTwoSchema,          fields: ['password', 'confirmPassword']            },
        { schema: stepThreeSchema,        fields: ['phoneNumber', 'gender']                  },
        { schema: stepFourSchema,         fields: ['address', 'birthDate']                   },
        { schema: stepFiveStudentSchema,  fields: ['parentPhone', 'levelId', 'school']      },
    ];

    const parentSchemas = [
        { schema: stepOneSchema,          fields: ['firstName', 'lastName', 'email']        },
        { schema: stepTwoSchema,          fields: ['password', 'confirmPassword']            },
        { schema: stepThreeSchema,        fields: ['phoneNumber', 'gender']                  },
        { schema: stepFourSchema,         fields: ['address', 'birthDate']                   },
    ];

    const roleSchemas =
        userRole === USER_ROLES.STUDENT ? studentSchemas :
        userRole === USER_ROLES.PARENT  ? parentSchemas  :
        teacherSchemas;

    // ─── Step validation ──────────────────────────────────────────────────────
    const validateStep = (stepData: Partial<UserRegistration>, step: number): boolean => {
        try {
            const current = roleSchemas[step - 1];
            if (!current) return false;

            current.schema.parse(stepData);
            setErrors((prev) => {
                const next = { ...prev };
                current.fields.forEach((f) => delete next[f]);
                return next;
            });
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path.length > 0) newErrors[String(err.path[0])] = err.message;
                });
                setErrors((prev) => ({ ...prev, ...newErrors }));
            }
            return false;
        }
    };

    // ─── Real-time field validation ───────────────────────────────────────────
    const validateField = (fieldName: string, value: string | number | number[]): boolean => {
        try {
            const fieldSchema =
                roleSchemas
                    .map((item) => (item.schema.shape as Record<string, ZodSchema>)[fieldName])
                    .find(Boolean) ?? null;

            if (!fieldSchema) return false;

            fieldSchema.parse(value);
            setErrors((prev) => { const next = { ...prev }; delete next[fieldName]; return next; });
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors((prev) => ({ ...prev, [fieldName]: error.issues[0]?.message ?? 'قيمة غير صحيحة' }));
            }
            return false;
        }
    };

    // ─── Build payload per role ───────────────────────────────────────────────
    const buildPayload = (formData: Partial<UserRegistration>): UserRegistration => {
        const base: UserRegistration = {
            firstName:       formData.firstName       ?? '',
            lastName:        formData.lastName        ?? '',
            email:           formData.email           ?? '',
            password:        formData.password        ?? '',
            confirmPassword: formData.confirmPassword ?? '',
            phoneNumber:     formData.phoneNumber     ?? '',
            gender:          formData.gender          ?? 0,
            address:         formData.address         ?? '',
            birthDate:       formData.birthDate       ?? '',
        };

        if (userRole === USER_ROLES.TEACHER) {
            const ids = Array.isArray(formData.subjectId)
                ? formData.subjectId
                : formData.subjectId ? [formData.subjectId] : [];

            base.subjectId       = ids;
            base.experienceYears = formData.experienceYears ?? 0;
        }

        if (userRole === USER_ROLES.STUDENT) {
            base.parentPhone = formData.parentPhone ?? '';
            base.levelId     = formData.levelId;
            base.school      = formData.school ?? '';
        }

        // PARENT uses the base payload only — no extra fields

        return base;
    };

    // ─── Role → API function map ──────────────────────────────────────────────
    const getRoleApiCall = (payload: UserRegistration) => {
        switch (userRole) {
            case USER_ROLES.TEACHER:
                return servicesApi.registerTeacher(payload as TeacherFormData);
            case USER_ROLES.STUDENT:
                return servicesApi.registerStudent(payload as StudentFormData);
            case USER_ROLES.PARENT:
                return servicesApi.registerParent(payload as ParentFormData);
            case USER_ROLES.ASSISTANT:
                return servicesApi.registerAssistant(payload as AssistantFormData);
            default:
                throw new Error('Unsupported user role');
        }
    };

    // ─── Submit ───────────────────────────────────────────────────────────────
    const registerUser = async (formData: Partial<UserRegistration>) => {
        setIsLoading(true);
        setErrors({});

        try {
            // Validate all steps first
            const allValid = roleSchemas
                .map((_, i) => validateStep(formData, i + 1))
                .every(Boolean);

            if (!allValid) {
                toast.error('يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
                return;
            }

            const payload  = buildPayload(formData);
            const response = await getRoleApiCall(payload);

            if (response?.isSucceeded) {
                toast.success('تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني');
                router.push(
                    `/auth/register/confirm-email?email=${encodeURIComponent(payload.email)}`
                );
            } else {
                toast.error(response?.message ?? 'حدث خطأ أثناء التسجيل');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Utilities ────────────────────────────────────────────────────────────
    const clearErrors      = () => setErrors({});
    const clearFieldError  = (fieldName: string) =>
        setErrors((prev) => { const next = { ...prev }; delete next[fieldName]; return next; });
    const getFieldError    = (fieldName: string) => errors[fieldName] ?? '';

    return {
        registerUser,
        isLoading,
        errors,
        getFieldError,
        validateStep,
        validateField,
        clearErrors,
        clearFieldError,
    };
};