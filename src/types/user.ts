export interface UserModel {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface DepartmentModel {
  id: string;
  name: string;
}
