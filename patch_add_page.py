import pathlib

def sub(path, old, new, count=1):
    p = pathlib.Path(path)
    s = p.read_text()
    assert old in s, f"Khong tim thay doan can sua trong {path}:\n{old[:80]}"
    p.write_text(s.replace(old, new, count))

pathlib.Path("src/app/admin/property/add/page.tsx").write_text('''import type { Metadata } from "next";
import PropAddEdit from "@/lib/components/admin/property/form/propAddEdit";
import { ETransType } from "@/lib/core/enum";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export const metadata: Metadata = { title: "Thêm bất động sản mới" };

export default async function Page({ searchParams }: Props) {
  const sParams = await searchParams;
  const transType = first(sParams.TransType)
    ? Number(first(sParams.TransType))
    : ETransType.sell;

  return (
    <PropAddEdit
      key={transType}
      transType={transType}
      query={{
        AddressNumber: first(sParams.AddressNumber),
        ProvinceId: first(sParams.ProvinceId),
        DistrictId: first(sParams.DistrictId),
        WardId: first(sParams.WardId),
        StreetId: first(sParams.StreetId),
      }}
    />
  );
}
''')

f = "src/lib/pages/property/index.tsx"
sub(f, 'import { mutate } from "swr";\n', '')
sub(f, 'import PropertyFormModal from "@/lib/pages/property/prop-detail";\n', '')
sub(f, '''  const [formModalOpen, setFormModalOpen] = useState(false);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [addTransType, setAddTransType] = useState(transType);
  const [addQuery, setAddQuery] = useState<{
    AddressNumber?: string;
    ProvinceId?: string;
    DistrictId?: string;
    WardId?: string;
    StreetId?: string;
  }>();
''', '''  const [resultsTotal, setResultsTotal] = useState(0);
''')
sub(f, 'const { data: meta, mutate: mutateMeta } = propertyApi.useGetMeta(', 'const { data: meta } = propertyApi.useGetMeta(')

a = f and pathlib.Path(f).read_text()
start = a.index('  const clearModalParams = useCallback(')
end = a.index('  const handleOpenDetail = useCallback(')
a = a[:start] + a[end:]
start = a.index('  const handleOpenAdd = useCallback(')
end = a.index('  const handleFilter = ')
new_block = '''  const handleOpenAdd = useCallback(
    (opts?: {
      transType?: ETransType;
      query?: {
        AddressNumber?: string;
        ProvinceId?: string;
        DistrictId?: string;
        WardId?: string;
        StreetId?: string;
      };
    }) => {
      const params = new URLSearchParams({
        TransType: String(opts?.transType ?? transType),
      });
      for (const [key, value] of Object.entries(opts?.query ?? {})) {
        if (value) params.set(key, String(value));
      }
      router.push(`/admin/property/add?${params.toString()}`);
    },
    [router, transType]
  );

  useEffect(() => {
    if (modalParams.openPropId) {
      router.replace(`/admin/property/${modalParams.openPropId}`);
      return;
    }

    if (modalParams.isAddAction) {
      handleOpenAdd({
        transType,
        query: {
          AddressNumber: modalParams.addressNumber,
          ProvinceId: modalParams.provinceId,
          DistrictId: modalParams.districtId,
          WardId: modalParams.wardId,
          StreetId: modalParams.streetId,
        },
      });
    }
  }, [
    handleOpenAdd,
    modalParams.addressNumber,
    modalParams.districtId,
    modalParams.isAddAction,
    modalParams.openPropId,
    modalParams.provinceId,
    modalParams.streetId,
    modalParams.wardId,
    transType,
    router,
  ]);

'''
a = a[:start] + new_block + a[end:]
pathlib.Path(f).write_text(a)

sub(f, '''        <PropertyFormModal
          open={formModalOpen}
          onClose={handleCloseModal}
          onSuccess={() => {
            mutate(propertyApi.mutateKey);
            mutateMeta();
          }}
          transType={addTransType}
          query={addQuery}
        />

''', '')

sub("src/app/admin/property/page.tsx", 'href={`?action=add&TransType=${transType}`}', 'href={`/admin/property/add?TransType=${transType}`}')
print("OK")