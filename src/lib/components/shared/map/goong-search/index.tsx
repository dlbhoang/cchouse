import { Input, List, Popover } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import { useState } from "react";
import { useAdminContext } from "@/lib/stored";
import type { IGeocode, IGeocodeItem } from "@/services/api/base/IGeocode";
import utilsApi from "@/services/api/utilsApi";

type Props = {
  handleSearch: (item: IGeocodeItem) => void;
};
const GoongSearch = ({ handleSearch }: Props) => {
  const { smallScreen } = useAdminContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [geocode, setGeocode] = useState<IGeocode>();
  const onSearch: SearchProps["onSearch"] = async (value, _e, info) => {
    console.log(value);

    setLoading(true);
    setOpen(true);
    const result = await utilsApi.geocode(value);
    setGeocode(result.data);
    setLoading(false);
  };

  const ListGeocode = (
    <List
      itemLayout="horizontal"
      loading={loading}
      style={{ width: smallScreen ? 250 : 350 }}
      dataSource={geocode?.results ?? []}
      renderItem={(item, index) => (
        <List.Item
          key={item.place_id}
          onClick={() => {
            setSearch(item.formatted_address);
            handleSearch(item);
            setOpen(false);
          }}
        >
          <List.Item.Meta title={item.formatted_address.split(",")?.[0]} />
          {`${item.compound.commune}, ${item.compound.district}, ${item.compound.province}`}
        </List.Item>
      )}
    />
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      content={ListGeocode}
      trigger="click"
      placement="bottom"
    >
      <Input.Search
        style={{ width: smallScreen ? 250 : 400 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onSearch={onSearch}
        loading={loading}
      />
    </Popover>
  );
};

export default GoongSearch;
