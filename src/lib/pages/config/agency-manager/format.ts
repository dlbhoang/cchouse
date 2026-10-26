export const withAddressType = (
  typeValue: string | null | undefined,
  nameValue: string | null | undefined,
) => {
  const type = String(typeValue ?? "").trim();
  const name = String(nameValue ?? "").trim();
  if (!name) return type;
  if (
    !type ||
    name.toLocaleLowerCase("vi").startsWith(type.toLocaleLowerCase("vi"))
  )
    return name;
  return `${type} ${name}`.trim();
};

export const normalizeAddressName = (input: unknown) =>
  String(input ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .replace(/^(phuong|xa|dac khu)\s+/i, "")
    .trim()
    .toLocaleLowerCase("vi");
