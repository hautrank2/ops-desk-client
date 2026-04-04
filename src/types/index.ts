export enum AssetType {
  Device = "Device",
  Appliance = "Appliance",
  Furniture = "Furniture",
  IT = "IT",
  Facility = "Facility",
}

export enum TicketType {
  Repair = "Repair",
  Maintenance = "Maintenance",
  Request = "Request",
  Incident = "Incident",
}

export enum TicketPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Urgent = "Urgent",
}

export enum TicketStatus {
  New = "New",
  Assigned = "Assigned",
  Doing = "Doing",
  Waiting = "Waiting",
  Done = "Done",
  Cancelled = "Cancelled",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  type: AssetType;
  vendor?: string;
  model?: string;
  purchaseUrl?: string;
  description?: string;
  images: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  updatedBy?: User;
}

export interface Ticket {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  assetItemIds: string[];
  cause?: string;
  note?: string;
  locationId?: string;
  assigneeId?: string;
  teamId?: string;
  dueAt?: string;
  closedAt?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  updatedBy?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
