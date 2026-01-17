

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

