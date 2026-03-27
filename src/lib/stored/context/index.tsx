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
        const branchResult = await branchApi.get(opts);
        const managerResult = await userAdminApi.getUserAdminPublic(true);
        const roleResult = await roleApi.get(opts);
        const provinceResult = await provinceApi.get(opts);
        const districtResult = await districtApi.get(opts);
        const propTypeResult = await propTypeApi.get(opts);
        const userAdminResult = await lookupApi.getUserAdmin();
        const managedUsersResult = await axiosClient.get<
          any,
          IApiResponse<IUserItem[]>
        >(meRoutes.managedUsers);

        const enumListResult = await utilsApi.enumList();
        set(() => ({
          enumList: enumListResult.data,
          branches: branchResult.data,
          managers: managerResult.data,
          provinces: provinceResult.data,
          districts: districtResult.data,
          roles: roleResult.data,
          propType: propTypeResult.data,
          listUserAdmin: userAdminResult.data,
          loading: false,
          managedUsers: managedUsersResult?.data || [],
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
