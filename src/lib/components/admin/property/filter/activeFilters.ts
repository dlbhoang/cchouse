import type { IPropAdminOpts } from '@/lib/interfaces/filter/ISearchOptions';
const advancedFields = ['PriceFrm', 'PriceTo', 'AreaFrm', 'AreaTo', 'FloorAreaFrm', 'FloorAreaTo', 'LengthFrm', 'LengthTo', 'WidthFrm', 'WidthTo', 'FloorFrm', 'FloorTo', 'BedroomFrm', 'BedroomTo', 'BathroomFrm', 'BathroomTo', 'PropTypeIds', 'Direction', 'Legal', 'FurnitureIds', 'CustomerType', 'IsSaved', 'IsMonopoly', 'LastUpdateDate'] as const;
export const hasAdvancedFilters = (model: IPropAdminOpts) => advancedFields.some(key => {
  const value = model[key];
  return Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== '' && value !== false && value !== 0;
});
