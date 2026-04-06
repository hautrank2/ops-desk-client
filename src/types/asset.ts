import { UserModel } from './user';

export enum AssetType {
  Device = "Device",
  Appliance = "Appliance",
  Furniture = "Furniture",
  IT = "IT",
  Facility = "Facility",
}

export type AssetModel = {
  _id: string;
  code: string;
  name: string;
  type: AssetType;
  vendor?: string;
  model?: string;
  purchaseUrl?: string;
  description?: string;
  images: string[];
  active: boolean;
  createdBy?: string | UserModel;
  updatedBy?: string | UserModel | null;
  createdAt: string;
  updatedAt?: string | null;
  itemCount?: AssetItemCount;
}


export type AssetItemCount = {
  _id: string;
  total: number;
  Active: number;
  Faulty: number;
  Maintenance: number;
  Retired: number;
};
