
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

export interface Levels {
    id: number;
    name: string;
}