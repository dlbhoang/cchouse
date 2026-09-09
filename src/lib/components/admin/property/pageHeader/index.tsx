import { Flex, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/button";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { buildFilterSummary } from "../filter/buildFilterSummary";

const { Title, Text } = Typography;

type Props = {
  total: number;
  searchOptions: IPropAdminOpts;
  onAdd?: () => void;
};

const PropertyPageHeader = ({ total, searchOptions, onAdd }: Props) => {
  const isRent = searchOptions.TransType === ETransType.rent;
  const title = isRent ? "QUẢN LÝ NHÀ CHO THUÊ" : "QUẢN LÝ NHÀ BÁN";
  const filterSummary = buildFilterSummary(searchOptions);

  return (
    <Flex
      align="flex-start"
      justify="space-between"
      wrap="wrap"
      gap={12}
      className="property-page-header"
    >
      <div>
        <Title level={4} style={{ margin: 0, letterSpacing: 0.2 }}>
          {title}
        </Title>
        <Text type="secondary">
          Hiện có <Text strong>{total}</Text> bất động sản được tìm kiếm theo:{" "}
          {filterSummary ? (
            <Text strong>{filterSummary}</Text>
          ) : (
            <Text strong>tất cả</Text>
          )}
        </Text>
      </div>

      {onAdd && (
        <Button type="button" onClick={onAdd} className="rounded-full">
          <PlusOutlined />
          Thêm mới
        </Button>
      )}
    </Flex>
  );
};

export default PropertyPageHeader;