/** Deterministic data for local Figma QA. Never enabled by a browser parameter. */
export const adminUiQaEnabled = (env: { NODE_ENV?: string; ADMIN_UI_QA?: string }) =>
  env.NODE_ENV === "development" && env.ADMIN_UI_QA === "1";

const date = "2026-05-26T08:48:44";
const addressItem = (Id: number, Name: string, Type: string) => ({
  Id, Name, Type, ShortName: "", RefKey: String(Id), Slug: Name, Images: [], Status: 1,
});
const provinces = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Đồng Nai", "Khánh Hòa", "Cần Thơ", "Lâm Đồng", "Huế"]
  .map((name, index) => addressItem(index + 1, name, index < 3 || index === 5 || index === 7 ? "Thành phố" : "Tỉnh"));
const districts = ["Quận 1", "Quận 3", "Quận 7", "Quận 5"]
  .map((name, index) => ({ ...addressItem(index + 1, name, ""), ProvinceId: 1, ProvinceName: "Hồ Chí Minh" }));
const wardNames = ["Sài Gòn", "Cầu Ông Lãnh", "Bàn Cờ", "Bình Tây", "Vườn Lài", "Hạnh Thông", "Tân Sơn Hòa"];
const wards = wardNames.map((name, index) => ({
  ...addressItem(index + 1, `Phường ${name}`, "Phường"), ProvinceId: 1, DistrictId: 1,
  ProvinceName: "Hồ Chí Minh", DistrictName: "Quận 1", IsNew: true,
}));
const oldWards = ["Bến Nghé", "Phạm Ngũ Lão", "Đa Kao", "Võ Thị Sáu"].map((name, index) => ({
  ...addressItem(101 + index, `Phường ${name}`, "Phường"), ProvinceId: 1, DistrictId: index === 3 ? 2 : 1,
  ProvinceName: "Hồ Chí Minh", DistrictName: index === 3 ? "Quận 3" : "Quận 1", IsNew: false,
}));
const streets = ["Lê Duẩn", "Đồng Khởi", "Nguyễn Huệ", "Nam Kỳ Khởi Nghĩa", "Hai Bà Trưng", "Mạc Đĩnh Chi", "Pasteur"]
  .map((name, index) => ({ ...addressItem(index + 1, name, "Đường"), ProvinceId: 1, DistrictId: 1, WardId: 1, OldWardId: 101, IsNew: true }));
const merges = oldWards.map((ward, index) => ({
  Id: index + 1, OldWardId: ward.Id, OldWardName: ward.Name,
  OldDistrictId: ward.DistrictId, OldDistrictName: ward.DistrictName,
  NewWardId: index === 3 ? 3 : 1, NewWardName: index === 3 ? "Bàn Cờ" : "Sài Gòn",
}));

const propertyRows = [
  { Id: 41906, price: 49.5, address: "1", street: "Hoa Cau", ward: "Cầu Kiệu", oldWard: "Phường 7", district: "Phú Nhuận", structure: "1 hầm, trệt, lửng, 4 lầu, sân thượng", area: 105, width: 7, length: 19, location: "Hẻm", direction: "Tây Nam" },
  { Id: 42206, price: 50, address: "76A-76B-78", street: "Nguyễn Cư Trinh", ward: "Bến Thành", oldWard: "Phạm Ngũ Lão", district: "Quận 1", structure: "Trệt, 4 lầu", area: 78.85, width: 8.3, length: 9.5, location: "Mặt tiền", direction: "" },
  { Id: 41782, price: 87, address: "371/5-7", street: "Hai Bà Trưng", ward: "Võ Thị Sáu", oldWard: "Phường 8", district: "Quận 3", structure: "Trệt, lửng, mái che, thang máy", area: 239.6, width: 11.2, length: 22, location: "Hẻm 10m", direction: "Đông Nam" },
  { Id: 43308, price: 280, address: "119", street: "Trần Bình Trọng", ward: "Chợ Quán", oldWard: "Phường 2", district: "Quận 5", structure: "Trệt", area: 630, width: 21, length: 30, location: "Mặt tiền", direction: "Đông Bắc" },
  { Id: 41960, price: 1500, address: "142-144-146-148-150", street: "Lý Tự Trọng", ward: "Bến Thành", oldWard: "Bến Thành", district: "Quận 1", structure: "Trệt, 2 lầu", area: 1440, width: 24, length: 60, location: "Mặt tiền", direction: "" },
];
const properties = Array.from({ length: 68 }, (_, index) => {
  const p = propertyRows[index % propertyRows.length];
  return {
    Id: p.Id + Math.floor(index / propertyRows.length) * 10000, TransType: 1, CustomerType: (index % 4) + 1,
    CustomerTypeName: ["Tiêu dùng", "Môi giới", "Chính chủ", "Đầu tư"][index % 4],
    CustomerName: "Khách hàng mẫu", CustomerPhone: ["0900000000"], IsHidePhone: false,
    UserAdminId: 0, UserAdminName: "Nhân viên mẫu", Price: p.price, PriceVnd: p.price * 1e9,
    PaymentMethod: 1, DisplayPrice: `${p.price} Tỷ`, PricePerSquareMeter: "~ 471 Triệu/m²",
    Images: [], MainImage: { Id: index + 1, Path: "/home.jpg", Name: "Ảnh mẫu" }, Video: "",
    Note: index % 2 === 0 ? "Ghi chú bất động sản mẫu dùng để so sánh UI." : "",
    Commission: "1%", Status: 1, StatusName: "Đang bán", RootId: 0, NoBroker: false,
    FloorArea: index === 0 ? 502.1 : 0, Length: p.length, Width: p.width, Area: p.area, BackSide: 0,
    Furniture: "", Structures: [], Equipments: [], Utils: [], Basement: 0, Floors: 4, Bedroom: 3, Bathroom: 3,
    IsSaved: false, IsMonopoly: false, DisplayStructures: [], DisplayUtilities: [], DisplayEquipments: [],
    CustomDisplayStructures: p.structure, CreatedBy: "Nhân viên mẫu", CreatedDate: date, UpdatedBy: "Nhân viên mẫu", UpdatedDate: date,
    PropAddress: {
      Id: index + 1, PropName: "", ProvinceId: 1, ProvinceName: "Hồ Chí Minh", DistrictId: 1, DistrictName: "",
      WardId: 1, WardName: `Phường ${p.ward}`, StreetId: 1, StreetName: p.street, AddressNumber: p.address,
      OldAddressNumber: "", OldDistrictId: 1, OldWardId: 101, OldStreetId: null,
      OldDistrictName: p.district, OldWardName: p.oldWard.startsWith("Phường") ? p.oldWard : `Phường ${p.oldWard}`, OldStreetName: "",
      PropTypeId: 1, PropTypeName: "Nhà phố", Direction: 1, DirectionName: p.direction,
      Location: 1, LocationName: p.location, LocationFeature: 1,
      LocationFeatureName: p.location.startsWith("Hẻm") ? "Căn góc hẻm" : "",
      StreetWidth: 0, DistanceToFont: 0, AlleyTurns: 0, AlleyValues: [], IsOneWay: false,
      LengthLegal: p.length, WidthLegal: p.width, AreaLegal: p.area, BackSideLegal: 0,
      Errors: [], UsageLaw: 1, Laws: [], DisplayLaws: ["Sổ hồng"], StatusUsage: 1, StatusUsageName: "Đang ở",
      DisplayAddress: `${p.address} ${p.street}, Phường ${p.ward}, TP. Hồ Chí Minh`,
    },
  };
});

const newsTypes = ["Phong thủy", "Thiết kế - Nội thất", "Bất động sản", "Tài chính", "Pháp lý nhà đất"]
  .map((Name, index) => ({ Id: index + 1, Name, NewsCount: [11, 215, 21, 3, 0][index] }));
const news = Array.from({ length: 68 }, (_, index) => ({
  Id: 451341 + index, NewsTypeId: (index % 5) + 1,
  Title: "Hạ Tầng Giao Thông Hiện Đại Góp Phần Định Hình Diện Mạo Đô Thị",
  Summary: "Nội dung mẫu dùng để đối chiếu các thành phần giao diện.", Content: "<p>Nội dung bài viết mẫu để kiểm tra trình soạn thảo.</p>",
  Thumbnail: "/home.jpg", Source: index % 2 ? "https://example.com" : "", SourceType: index % 2 ? "share" : "write",
  Status: index % 3 === 0 ? 2 : 1, StatusName: index % 3 === 0 ? "Chờ duyệt" : "Đã duyệt",
  ViewCount: 234, CreatedBy: "Phạm Văn Anh", CreatedDate: date, UpdatedDate: date,
  ApprovedBy: index % 3 === 0 ? undefined : "Phạm Văn Anh", ApprovedDate: index % 3 === 0 ? undefined : date,
}));

const agencies = [{
  WardId: 1, WardName: "Sài Gòn", WardType: "phường", UBNDAddress: "45 Lê Duẩn", MergedFrom: ["Bến Nghé (Q1)"],
  Agencies: {
    "Văn phòng công chứng": [
      { name: "Văn phòng Công chứng số 1", address: "97 Pasteur, Phường Sài Gòn, TP. Hồ Chí Minh", status: "active", updatedAt: "2026-07-03" },
      { name: "Văn phòng công chứng Bến Thành", address: "99 - 101 Nguyễn Công Trứ, Phường Sài Gòn, TP. Hồ Chí Minh", status: "active", updatedAt: "2026-07-03" },
      { name: "Văn phòng công chứng số 6", address: "123 Hai Bà Trưng, Phường Sài Gòn, TP. Hồ Chí Minh", status: "hidden", updatedAt: "2026-07-03" },
    ],
    "Văn phòng đất đai": [], "Chi cục thuế": [], "Ủy ban nhân dân phường": [], "Tòa án": [], "Sở tư pháp": [], "Thừa phát lại": [],
  },
}];

const list = (data: unknown[], totalRow = data.length) => ({ data, totalRow, message: "Dữ liệu mẫu — local UI QA", status: 200 });

/** null means this endpoint continues through the existing API proxy. */
export function getAdminUiFixture(path: string, query: URLSearchParams): unknown | null {
  const route = path.toLowerCase();
  const empty = [...query.values()].some((value) => value.includes("__empty__"));
  const page = <T,>(rows: T[], total = rows.length) => {
    if (empty) return list([]);
    const size = Math.max(1, Math.min(10000, Number(query.get("pageSize")) || 10));
    const index = Math.max(1, Number(query.get("pageIndex")) || 1);
    return list(rows.slice((index - 1) * size, index * size), total);
  };
  if (route === "property") return page(properties, 68);
  if (route === "property/meta") return { data: { Title: "Quản lý nhà bán" } };
  if (/^property\/\d+$/.test(route)) return { data: properties.find((p) => p.Id === Number(route.split("/")[1])) ?? properties[0] };
  if (route === "news") {
    const selected = query.get("NewsTypeIds")?.split(",").filter(Boolean);
    return page(selected?.length ? news.filter((row) => selected.includes(String(row.NewsTypeId))) : news, 68);
  }
  if (route === "news/count") return { data: empty ? 0 : 68 };
  if (/^news\/\d+$/.test(route)) return { data: news.find((n) => n.Id === Number(route.split("/")[1])) ?? news[0] };
  if (route === "newstype") return list(newsTypes);
  if (route === "province") return list(provinces);
  if (route === "district") return list(districts.filter((d) => !query.has("ProvinceId") || d.ProvinceId === Number(query.get("ProvinceId"))));
  if (route === "ward") {
    const rows = query.get("IsNew") === "false" ? oldWards : wards;
    return list(rows.filter((w) => (!query.has("ProvinceId") || w.ProvinceId === Number(query.get("ProvinceId"))) && (!query.has("DistrictId") || w.DistrictId === Number(query.get("DistrictId")))));
  }
  if (route === "street") return list(streets.filter((s) => !query.has("WardId") || s.WardId === Number(query.get("WardId"))));
  if (route === "mergeward") return list(merges);
  if (route === "lookup/ward-agencies") return list(agencies);
  return null;
}
