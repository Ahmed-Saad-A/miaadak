
export interface StudentFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    gender: number;
    address: string;
    birthDate: string;
    parentPhone: string;
    levelId: number;
    school: string;
}

export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    imageUrl: string | null;
    gender: number;
    age: number;
    birthDate: string;
    createdAt: string;
    isLocked: boolean;
    parentPhone: string;
    parentId: number;
    levelId: number;
    school: string;
    code: string;
}

export interface Levels {
    id: number;
    name: string;
}
