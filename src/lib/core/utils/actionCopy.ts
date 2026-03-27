import type { IPropResponse } from "@/lib/interfaces/Property/IProp";
import type { IApartmentUnitResponse } from "@/services/api/apartment/unit/IApartmentUnit";

import { appConst } from "../configs/appConst";
import { CombineAddress } from "./myFormat";

export const CopyProp = (data: IPropResponse) => {
	return `
  Mã: ${data.Id}
  Loại: ${data.PropAddress.PropTypeName}
  Giá: ${data.DisplayPrice}
  Vị trí: ${data.PropAddress.LocationName} ${
		data.PropAddress.IsOneWay ? "(1 chiều)" : ""
	} ${
		data.PropAddress.AlleyValues?.length === 1
			? `\n${data.PropAddress.AlleyValues[0] ?? 0}m`
			: ""
	}
  Địa chỉ: ${CombineAddress(data.PropAddress)}
  Kết cấu: ${data.CustomDisplayStructures}
  DTTT: ${data.Area ? `${data.Area}m2` : ""} ${
		data.Length > 0 ? `(${data.Width}x${data.Length})m` : ""
	}${data.BackSide ? `\nMH: ${data.BackSide}m` : ""}
  Hướng: ${data.PropAddress.DirectionName ?? "Chưa cập nhật"}
  ${
		data.PropAddress.DisplayPriceForRent
			? `Có hợp đồng thuê: ${data.PropAddress.DisplayPriceForRent} (Thời hạn: ${
					data.PropAddress.EndTimeRent ?? "Chưa cập nhật"
				})`
			: ""
	}
`;
};

export const CopyApartmentUnit = (data: IApartmentUnitResponse) => {
	return `Mã căn hộ: ${data.Code}
  Chung cư/Căn hộ: ${data.Apartment.Name} (${data.Apartment.DistrictName})
  Loại: ${data.PropTypeName}
  Giá: ${data.Contact.DisplayPrice}
  Diện tích: ${data.Area}m2
  Block: ${data.Block ?? appConst.TEXT_DEFAULT}
  Tầng số: ${data.FloorNumber}
  Hướng cửa: ${data.DirectionName ?? appConst.TEXT_DEFAULT}
  Số phòng: ${data.Bedroom}
  Số toilet: ${data.Bathroom}
`;
};
