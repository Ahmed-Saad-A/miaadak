export const USER_ROLES = {
    ADMIN: 0,
    TEACHER: 1,
    STUDENT: 2,
    PARENT: 3,
    ASSISTANT: 4,
} as const;

export const GENDER = {
    MALE: 0,
    FEMALE: 1,
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type Gender = (typeof GENDER)[keyof typeof GENDER];
