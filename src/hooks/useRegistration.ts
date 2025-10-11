import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { servicesApi } from '@/services/api';
import { UserRegistration, USER_ROLES } from '@/interfaces';
import { stepOneSchema, stepTwoSchema, stepThreeSchema } from '@/components/shared/schema/registerSchema';
import { ZodError, ZodSchema } from 'zod';

interface UseRegistrationProps {
    userRole: number;
}

export const useRegistration = ({ userRole }: UseRegistrationProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    // Validate step-by-step using the right schema
    const validateStep = (stepData: Partial<UserRegistration>, step: number) => {
        try {
            let schema;
            let stepFields: string[] = [];

            switch (step) {
                case 1:
                    schema = stepOneSchema;
                    stepFields = ['firstName', 'lastName', 'email'];
                    break;
                case 2:
                    schema = stepTwoSchema;
                    stepFields = ['password', 'confirmPassword'];
                    break;
                case 3:
                    schema = stepThreeSchema;
                    stepFields = ['phoneNumber', 'gender'];
                    break;
                default:
                    return false;
            }

            schema.parse(stepData);

            // Clear passed field errors
            setErrors((prev) => {
                const newErrors = { ...prev };
                stepFields.forEach((field) => {
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

    // ✅ Real-time single-field validation
    const validateField = (fieldName: string, value: string | number) => {
        try {
            const allSchemas = [stepOneSchema, stepTwoSchema, stepThreeSchema];
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

    // ✅ Submit the full form (only after all steps pass)
    const registerUser = async (formData: Partial<UserRegistration>) => {
        setIsLoading(true);
        setErrors({});

        try {
            // Validate all steps before submitting
            const allValid =
                validateStep(formData, 1) &&
                validateStep(formData, 2) &&
                validateStep(formData, 3);

            if (!allValid) {
                toast.error('يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
                return;
            }

            const registrationData: UserRegistration = {
                firstName: formData.firstName || '',
                lastName: formData.lastName || '',
                email: formData.email || '',
                password: formData.password || '',
                confirmPassword: formData.confirmPassword || '',
                phoneNumber: formData.phoneNumber || '',
                gender: formData.gender ?? 0,
                userRole: userRole,
            };

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

    // ✅ Utility functions
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
