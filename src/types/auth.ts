export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  terms:boolean;
}
export interface LoginFormData {
  email: string;
  password: string;
  terms: boolean;
}