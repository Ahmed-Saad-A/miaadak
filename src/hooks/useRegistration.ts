import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { servicesApi } from '@/services/authApi';
import { UserRegistration, USER_ROLES } from '@/interfaces';
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    const teacherSchemas = [
        { schema: stepOneSchema, fields: ['firstName', 'lastName', 'email'] },
        { schema: stepTwoSchema, fields: ['password', 'confirmPassword'] },
        { schema: stepThreeSchema, fields: ['phoneNumber', 'gender'] },
        { schema: stepFourSchema, fields: ['address', 'birthDate'] },
        { schema: stepFiveTeacherSchema, fields: ['subjectId', 'experienceYears'] },
    ];

    const studentSchemas = [
        { schema: stepOneSchema, fields: ['firstName', 'lastName', 'email'] },
        { schema: stepTwoSchema, fields: ['password', 'confirmPassword'] },
        { schema: stepThreeSchema, fields: ['phoneNumber', 'gender'] },
        { schema: stepFourSchema, fields: ['address', 'birthDate'] },
        { schema: stepFiveStudentSchema, fields: ['parentPhone', 'levelId', 'school'] },
    ];

    const parentSchemas = [
        { schema: stepOneSchema, fields: ['firstName', 'lastName', 'email'] },
        { schema: stepTwoSchema, fields: ['password', 'confirmPassword'] },
        { schema: stepThreeSchema, fields: ['phoneNumber', 'gender'] },
        { schema: stepFourSchema, fields: ['address', 'birthDate'] },
    ];

    const roleSchemas =
        userRole === USER_ROLES.STUDENT
            ? studentSchemas
            : userRole === USER_ROLES.PARENT
                ? parentSchemas
                : teacherSchemas;

    // Validate step-by-step using the right schema
    const validateStep = (stepData: Partial<UserRegistration>, step: number) => {
        try {
            const current = roleSchemas[step - 1];
            if (!current) return false;

            current.schema.parse(stepData);

            // Clear passed field errors
            setErrors((prev) => {
                const newErrors = { ...prev };
                current.fields.forEach((field) => {
                    delete newErrors[field];
                });
                return newErrors;
            });

            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path && err.path.length > 0) {
                        const fieldName = String(err.path[0]);
                        newErrors[fieldName] = err.message;
                    }
                });
                setErrors((prev) => ({ ...prev, ...newErrors }));
            }
            return false;
        }
    };

    //  Real-time single-field validation
    const validateField = (fieldName: string, value: string | number | number[]) => {
        try {
            const allSchemas = roleSchemas.map((item) => item.schema);
            const fieldSchema =
                allSchemas
                    .map((schema) => (schema.shape as Record<string, ZodSchema>)[fieldName])
                    .find((s) => !!s) || null;

            if (fieldSchema) {
                fieldSchema.parse(value);
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                });
                return true;
            }
            return false;
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.issues[0]?.message || 'قيمة غير صحيحة';
                setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
            }
            return false;
        }
    };

    //  Submit the full form (only after all steps pass)
    const registerUser = async (formData: Partial<UserRegistration>) => {
        setIsLoading(true);
        setErrors({});

        try {
            // Validate all steps before submitting
            const allValid = roleSchemas
                .map((_, index) => validateStep(formData, index + 1))
                .every((isValid) => isValid);

            if (!allValid) {
                toast.error('يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
                return;
            }

            // Convert birthDate to ISO format if it exists
            const birthDateISO = formData.birthDate ? new Date(formData.birthDate).toISOString() : '';

            const registrationData: UserRegistration = {
                firstName: formData.firstName || '',
                lastName: formData.lastName || '',
                email: formData.email || '',
                password: formData.password || '',
                confirmPassword: formData.confirmPassword || '',
                phoneNumber: formData.phoneNumber || '',
                gender: formData.gender ?? 0,
                userRole: userRole,
                address: formData.address || '',
                birthDate: birthDateISO,
            };

            if (userRole === USER_ROLES.TEACHER) {
                // Handle subjectId - send as array if multiple, or single number if one
                const subjectIds = Array.isArray(formData.subjectId)
                    ? formData.subjectId
                    : formData.subjectId
                        ? [formData.subjectId]
                        : [];
                const subjectIdValue = subjectIds.length === 1 ? subjectIds[0] : subjectIds;

                registrationData.subjectId = subjectIdValue;
                registrationData.experienceYears = formData.experienceYears ?? 0;
            } else if (userRole === USER_ROLES.STUDENT) {
                registrationData.parentPhone = formData.parentPhone || '';
                registrationData.levelId = formData.levelId ?? undefined;
                registrationData.school = formData.school || '';
            }

            const response = await servicesApi.registerUser(registrationData);

            if (response.isSucceeded) {
                toast.success('تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني');
                router.push(`/auth/register/confirm-email?email=${encodeURIComponent(registrationData.email)}`);
            } else {
                toast.error(response.message || 'حدث خطأ أثناء التسجيل');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
        } finally {
            setIsLoading(false);
        }
    };

    // Utility functions
    const clearErrors = () => setErrors({});
    const clearFieldError = (fieldName: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };
    const getFieldError = (fieldName: string) => errors[fieldName] || '';

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
