import { UserModel } from './user';

export enum FloorType {
  B2 = "B2",
  B1 = "B1",
  G = "G",
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
  L4 = "L4",
  L5 = "L5",
}

export type LocationModel = {
  _id: string;
  code: string;
  name: string;
  floor?: FloorType | null;
  description?: string;
  isActive: boolean;
  createdBy?: string | UserModel;
  updatedBy?: string | UserModel | null;
  createdAt: string;
  updatedAt?: string | null;
}

export type CreateLocationDto = {
  code: string;
  name: string;
  floor?: FloorType | null;
  description?: string;
  isActive?: boolean;
}

export type UpdateLocationDto = Partial<CreateLocationDto>;

export type LocationQueryDto = {
  page?: number;
  pageSize?: number;
  code?: string;
  name?: string;
  floor?: FloorType;
  isActive?: boolean;
}
