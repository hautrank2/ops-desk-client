"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { LocationModel } from "@/types/location";
import { DepartmentModel } from "@/types/department";
import { httpClient } from "@/lib/httpClient";
import { TableResponse } from "@/types/api";

type AppContextValue = {
  locations: LocationModel[];
  locationsMap: Record<string, LocationModel>;
  locationsLoading: boolean;
  refetchLocations: () => Promise<void>;
  departments: DepartmentModel[];
  departmentsMap: Record<string, DepartmentModel>;
  departmentsLoading: boolean;
  refetchDepartments: () => Promise<void>;
};

const AppContext = createContext<AppContextValue>({
  locations: [],
  locationsMap: {},
  locationsLoading: false,
  refetchLocations: async () => {},
  departments: [],
  departmentsMap: {},
  departmentsLoading: false,
  refetchDepartments: async () => {},
});

async function fetchAll<T>(url: string): Promise<T[]> {
  const { data } = await httpClient.get<TableResponse<T> | T[]>(url, { params: { pageSize: 999 } });
  return Array.isArray(data) ? data : data.items;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);

  const refetchLocations = useCallback(async () => {
    setLocationsLoading(true);
    try { setLocations(await fetchAll<LocationModel>("/location")); } catch { /* silent */ }
    finally { setLocationsLoading(false); }
  }, []);

  const refetchDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    try { setDepartments(await fetchAll<DepartmentModel>("/department")); } catch { /* silent */ }
    finally { setDepartmentsLoading(false); }
  }, []);

  useEffect(() => {
    refetchLocations();
    refetchDepartments();
  }, [refetchLocations, refetchDepartments]);

  const locationsMap = locations.reduce<Record<string, LocationModel>>((acc, l) => { acc[l._id] = l; return acc; }, {});
  const departmentsMap = departments.reduce<Record<string, DepartmentModel>>((acc, d) => { acc[d._id] = d; return acc; }, {});

  return (
    <AppContext.Provider value={{
      locations, locationsMap, locationsLoading, refetchLocations,
      departments, departmentsMap, departmentsLoading, refetchDepartments,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
