import type { ISingleData } from "@/lib/interfaces/base/IResponseBase";

import { axiosClient } from "./api_config";

const serverConfigApi = {
  getServerIp() {
    return axiosClient.get<any, ISingleData<string>>(
      "ServerConfig/ServerIp"
    );
  },
  updateServerIp(serverIp: string) {
    return axiosClient.put<any, ISingleData<string>>(
      "ServerConfig/ServerIp",
      { ServerIp: serverIp }
    );
  },
};

export default serverConfigApi;