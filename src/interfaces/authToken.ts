import { Role } from '@/interfaces'

export interface AuthToken {
    id: string;
    name: string;
    email: string;
    role: Role;
    accessToken?: string;
    expiresAt?: string;
}