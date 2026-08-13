export interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Teacher" | "Student" | "Parent";
  exp: number;
  [key: string]: string | number;
}
