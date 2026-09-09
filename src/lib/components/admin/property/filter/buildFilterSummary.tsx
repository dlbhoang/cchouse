import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";

/**
 * Best-effort label for the "Status" filter.
 * Status=1 is the confirmed default ("Đang bán" / "Đang cho thuê", see
 * usePropertyFilter.handleRefresh). Other codes don't have a client-side
 * label available in this module, so we fall back to a generic count.
 * If TransStatusSelect exposes its options elsewhere, swap this out for
 * the real label lookup.
 */
const getStatusText = (
  status: IPropAdminOpts["Status"],
  transType?: number
) => {
  const raw = status as unknown;
  const ids: number[] | undefined = Array.isArray(raw)
    ? (raw as number[])
    : typeof raw === "string" || typeof raw === "number"
      ? String(raw)
          .split(",")
          .map(Number)
          .filter((n) => !Number.isNaN(n))
      : undefined;

  if (!ids || ids.length === 0) return undefined;

  if (ids.length === 1 && Number(ids[0]) === 1) {
    return transType === ETransType.rent ? "Đang cho thuê" : "Đang bán";
  }

  return `${ids.length} trạng thái`;
};

const getPriceText = (priceFrm?: number, priceTo?: number) => {
  if (!priceFrm && !priceTo) return undefined;
  if (priceFrm && priceTo) return `giá từ ${priceFrm} - ${priceTo} tỷ`;
  if (priceTo) return `giá dưới ${priceTo} tỷ`;
  return `giá trên ${priceFrm} tỷ`;
};

const getAreaText = (areaFrm?: number, areaTo?: number) => {
  if (!areaFrm && !areaTo) return undefined;
  if (areaFrm && areaTo) return `từ ${areaFrm}m² - ${areaTo}m²`;
  if (areaTo) return `dưới ${areaTo}m²`;
  return `trên ${areaFrm}m²`;
};

/**
 * Builds text like: "Đang bán, giá dưới 10 tỷ, từ 50m² - 100m²"
 * matching the summary line shown under the page title.
 */
export const buildFilterSummary = (opts: IPropAdminOpts) => {
  const parts = [
    getStatusText(opts.Status, opts.TransType),
    getPriceText(
      Number(opts.PriceFrm) || undefined,
      Number(opts.PriceTo) || undefined
    ),
    getAreaText(
      Number(opts.AreaFrm) || undefined,
      Number(opts.AreaTo) || undefined
    ),
  ].filter(Boolean);

  return parts.join(", ");
};