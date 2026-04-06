import { UserModel } from './user';

export type DepartmentModel = {
  _id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy?: string | UserModel;
  updatedBy?: string | UserModel | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export type CreateDepartmentDto = {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
