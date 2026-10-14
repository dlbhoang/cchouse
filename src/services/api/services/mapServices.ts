const getPolygon = async (
  provinceId: string,
  districtId: string,
  wardId?: string
) => {
  const jsonPath = `/data/gis/${provinceId}.json`;
  const e1 = await fetch(jsonPath).then(
    (r) => r.json(),
    (reason) => console.error(reason)
  );
  if (!e1 || !Array.isArray(e1.level2s)) {
    console.error("Unexpected map polygon data", e1);
    return [];
  }

  return e1.level2s.filter(
    (e2: any) => e2?.level2_id?.toString() === districtId
  );
};

export const MapServices = {
  getPolygon,
};
