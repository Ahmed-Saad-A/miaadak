

export interface TeacherFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    gender: number;
    address: string;
    birthDate: string;
    subjectId: number[];
    experienceYears: number;
}

export interface Teacher {
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
    experienceYears: number;
    bio: string | null;
    promoEndDate: string;
    subjectId: number;
}


export interface Subject {
    id: number;
    name: string;
};

// =========== Package Interface ===========
export interface Package {
    id: number;
    name: number;
    monthlyPrice: number;
    description: string;
    maxSessionsPerMonth: number;
    maxStudentsPerSession: number;
    maxAssistantsPerTeacher: number;
}

