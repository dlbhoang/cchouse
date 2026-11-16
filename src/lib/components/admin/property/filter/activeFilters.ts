import type { IPropAdminOpts } from '@/lib/interfaces/filter/ISearchOptions';

type FilterLabels = Record<string, Record<string, string>>;
export const additionalFilterSummary = (model: IPropAdminOpts, labels: FilterLabels = {}): string[] => {
  const summary: string[] = [];
  for (const [from, to, label] of [
    ['FloorFrm', 'FloorTo', 'Số tầng'],
    ['BedroomFrm', 'BedroomTo', 'Phòng ngủ'],
    ['BathroomFrm', 'BathroomTo', 'Phòng tắm, vệ sinh'],
  ] as const) {
    const low = model[from], high = model[to];
    if (low != null || high != null) {
      summary.push(`${label}: ${low != null && high != null ? String(low) === String(high) ? low : `${low}–${high}` : low != null ? `${low}+` : `≤ ${high}`}`);
    }
  }
  for (const [key, label] of [
    ['Direction', 'Hướng nhà'], ['Legal', 'Pháp lý'], ['FurnitureIds', 'Nội thất'],
    ['CustomerType', 'Nhận diện khách hàng'], ['UserAdminId', 'Nhân viên'],
  ] as const) {
    const value = model[key];
    const values = (Array.isArray(value) ? value : value == null ? [] : String(value).split(','))
      .map(String).filter((item) => item.trim() !== '' && item !== '0' && item !== 'all');
    if (values.length) summary.push(`${label}: ${values.map((item) => labels[key]?.[item] ?? (key === 'CustomerType' && item === '6' ? 'Đấu giá' : item)).join(', ')}`);
  }
  if (model.fromDate || model.toDate) summary.push(`Thời gian: ${model.fromDate ?? '…'} → ${model.toDate ?? '…'}`);
  if (model.IsMonopoly === true || String(model.IsMonopoly) === 'true') summary.push('Độc quyền');
  return summary;
};
const advancedFields = ['PriceFrm', 'PriceTo', 'AreaFrm', 'AreaTo', 'FloorAreaFrm', 'FloorAreaTo', 'LengthFrm', 'LengthTo', 'WidthFrm', 'WidthTo', 'FloorFrm', 'FloorTo', 'BedroomFrm', 'BedroomTo', 'BathroomFrm', 'BathroomTo', 'PropTypeIds', 'Direction', 'Legal', 'FurnitureIds', 'CustomerType', 'IsSaved', 'IsMonopoly', 'LastUpdateDate'] as const;
export const hasAdvancedFilters = (model: IPropAdminOpts) => advancedFields.some(key => {
  const value = model[key];
  return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== '' && value !== false && value !== 0;
});
