// interfaces/assistant.ts

export enum GENDER {
    MALE = 0,
    FEMALE = 1,
}

export interface AssistantFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    gender: GENDER;
    address: string;
    birthDate: string;
    teacherId: string;
    canManageStudents: boolean;
    canManageSessions: boolean;
    canManageAttendance: boolean;
    canManageExams: boolean;
}

export interface Assistant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender: GENDER;
    address: string;
    birthDate: string;
    teacherId: string;
    isLocked: boolean;
    canManageStudents: boolean;
    canManageSessions: boolean;
    canManageAttendance: boolean;
    canManageExams: boolean;
    createdAt: string;
    updatedAt?: string;
    profileImage?: string;
}

export interface TeacherAssistantProps {
    teacherId: string;
}