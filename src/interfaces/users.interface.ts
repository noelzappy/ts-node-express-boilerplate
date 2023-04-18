import { roles } from '@/config/constants';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  id_number?: string;
  id_type?: string;
  is_verified?: boolean;
  is_email_verified?: boolean;
  role: (typeof roles)[number];
}
