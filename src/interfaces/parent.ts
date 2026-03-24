export interface ParentFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    gender: number;
    birthDate: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface Parent {
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
}
