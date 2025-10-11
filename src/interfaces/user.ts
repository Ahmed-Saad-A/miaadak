export interface UserRegistration {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: number; // 0 = Male, 1 = Female
    specialization?: string; // Optional, only for teachers
    userRole: number; // 1 = Teacher, 2 = Student, 3 = Parent
    password: string;
    confirmPassword: string;
    studentCode?: string; // Optional, only for parents
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    user?: {
        id?: string;
        name?: string;
        email?: string;
        role?: string;
    };
    error?: string;
}


// Role constants for better type safety
export const USER_ROLES = {
    TEACHER: 1,
    STUDENT: 2,
    PARENT: 3,
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Gender constants
export const GENDER = {
    MALE: 0,
    FEMALE: 1,
} as const;

export type Gender = typeof GENDER[keyof typeof GENDER];
