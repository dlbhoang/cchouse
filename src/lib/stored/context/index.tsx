import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { IUserItem } from "@/components/features/user-admin/types/user-item";
import { meRoutes } from "@/constants/routes/me-routes";
import type { IApiResponse } from "@/lib/interfaces/base/IResponseBase";
import type { IEnumList } from "@/lib/interfaces/base/ISelectListBase";
import type {
  IDistrictResponse,
  IProvinceResponse,
} from "@/lib/interfaces/ConfigAddress/IConfigAddress";
import type { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import type { IRoleResponse } from "@/lib/interfaces/IRole";
import type { IPropTypeResponse } from "@/lib/interfaces/Property/IPropType";
import { axiosClient } from "@/services/api/api_config";
import branchApi from "@/services/api/branch/branchApi";
import type { IBranchResponse } from "@/services/api/branch/IBranch";
import districtApi from "@/services/api/districtApi";
import lookupApi from "@/services/api/lookupApi";
import propTypeApi from "@/services/api/property/propTypeApi";
import provinceApi from "@/services/api/provinceApi";
import roleApi from "@/services/api/roleApi";
import type { IUserAdminPublic } from "@/services/api/userAdmin/IUserAdmin";
import userAdminApi from "@/services/api/userAdmin/userAdminApi";
import utilsApi from "@/services/api/utilsApi";

type State = {
  branches: IBranchResponse[];
  managers: IUserAdminPublic[];
  provinces: IProvinceResponse[];
  districts: IDistrictResponse[];
  roles: IRoleResponse[];
  propType: IPropTypeResponse[];
  listUserAdmin: IUserAdminPublic[];
  managedUsers: IUserItem[];

  enumList: IEnumList;
  loading: boolean;
  collapsed: boolean;
  smallScreen: boolean;
};

type Action = {
  init: () => void;
  setCollapsed: (val: boolean) => void;
  setSmallScreen: (val: boolean) => void;
};

const opts: ISearchOptions = {
  pageIndex: 1,
  pageSize: 100,
};

export const useAdminContext = create(
  persist<State & Action>(
    (set) => ({
      loading: false,
      collapsed: false,
      smallScreen: false,
      enumList: {
        ApartmentUnitType: [],
        CustomerType: [],
        Direction: [],
        Equipments: [],
        Errors: [],
        Law: [],
        Literacy: [],
        Location: [],
        LocationFeature: [],
        MobileNetwork: [],
        PaymentMethod: [],
        Purpose: [],
        RequimentStatus: [],
        Root: [],
        Sex: [],
        StatusBase: [],
        NewsStatus: [],
        StatusUsage: [],
        Structures: [],
        SubAddresses: [],
        TransStatus: [],
        UsageLaw: [],
        UserStatus: [],
        Utilities: [],
        UserWebsiteStatus: [],
        UserWebsiteType: [],
      },
      managedUsers: [],

      branches: [],
      managers: [],
      provinces: [],
      districts: [],
      roles: [],
      propType: [],
      listUserAdmin: [],

      init: async () => {
        set(() => ({
          loading: true,
        }));

        const [
          branchResult,
          managerResult,
          roleResult,
          provinceResult,
          districtResult,
          propTypeResult,
          userAdminResult,
          managedUsersResult,
          enumListResult,
        ] = await Promise.allSettled([
          branchApi.get(opts),
          userAdminApi.getUserAdminPublic(true),
          roleApi.get(opts),
          provinceApi.get(opts),
          districtApi.get(opts),
          propTypeApi.get(opts),
          lookupApi.getUserAdmin(),
          axiosClient.get<any, IApiResponse<IUserItem[]>>(meRoutes.managedUsers),
          utilsApi.enumList(),
        ]);

        const safeData = <T,>(result: PromiseSettledResult<T | undefined>) =>
          result.status === "fulfilled" ? (result.value as any)?.data ?? [] : [];

        set(() => ({
          enumList:
            enumListResult.status === "fulfilled"
              ? enumListResult.value.data ?? {}
              : {
                  ApartmentUnitType: [],
                  CustomerType: [],
                  Direction: [],
                  Equipments: [],
                  Errors: [],
                  Law: [],
                  Literacy: [],
                  Location: [],
                  LocationFeature: [],
                  MobileNetwork: [],
                  PaymentMethod: [],
                  Purpose: [],
                  RequimentStatus: [],
                  Root: [],
                  Sex: [],
                  StatusBase: [],
                  NewsStatus: [],
                  StatusUsage: [],
                  Structures: [],
                  SubAddresses: [],
                  TransStatus: [],
                  UsageLaw: [],
                  UserStatus: [],
                  Utilities: [],
                  UserWebsiteStatus: [],
                  UserWebsiteType: [],
                },
          branches: safeData(branchResult),
          managers: safeData(managerResult),
          provinces: safeData(provinceResult),
          districts: safeData(districtResult),
          roles: safeData(roleResult),
          propType: safeData(propTypeResult),
          listUserAdmin: safeData(userAdminResult),
          loading: false,
          managedUsers:
            managedUsersResult.status === "fulfilled"
              ? managedUsersResult.value?.data ?? []
              : [],
        }));
      },

      setCollapsed(val) {
        set({ collapsed: val });
      },
      setSmallScreen(val) {
        set({ smallScreen: val });
      },
    }),
    {
      name: "context-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
