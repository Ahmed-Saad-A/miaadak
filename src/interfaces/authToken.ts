// import { Role } from '@/interfaces'

// export interface AuthToken {
//     id: string;
//     name: string;
//     email: string;
//     role: Role;
//     accessToken?: string;
//     expiresAt?: string;
// }

import { Role } from "@/interfaces";

export interface AuthToken {
    id: string;
    name: string;
    email: string;
    role: Role;

    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;

    error?: string;
}
