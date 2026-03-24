export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  gender: number;
  // userRole: number;
  address?: string;
  birthDate?: string;
  subjectId?: number | number[];
  experienceYears?: number;
  parentPhone?: string;
  levelId?: number;
  school?: string;
  teacherIdC?: string;
  canManageStudents?: boolean;
  canManageSessions?: boolean;
  canManageAttendance?: boolean;
  canManageExams?: boolean;
}
