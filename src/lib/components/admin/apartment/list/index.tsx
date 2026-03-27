import { Button, Col, Input, List, Radio, Row } from "antd";
import { useState } from "react";

import { CombineAddress } from "@/lib/core/utils/myFormat";
import { ISearchOptions } from "@/lib/interfaces/filter/ISearchOptions";
import apartmentApi from "@/services/api/apartment/apartmentApi";
import { baseFilter } from "../../../../core/configs/appConst";

const { Search } = Input;

type Props = {
  onSelect: (id: number) => void;
};

const ApartmentList = ({ onSelect }: Props) => {
  const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
    ...baseFilter,
  });
  const { data, isLoading, mutate } = apartmentApi.useGet(searchOptions);

  const header = (
    <Row justify="space-between">
      <Col>
        <Search
          placeholder="Tìm tên chung cư / căn hộ"
          onSearch={(val) => {
            setSearchOptions({ ...searchOptions, search: val });
            mutate();
          }}
        />
      </Col>
      <Col>
        <Button>Thêm</Button>
      </Col>
    </Row>
  );

  return (
    <Radio.Group
      style={{ width: "100%" }}
      onChange={(e) => onSelect(e.target.value)}
    >
      <List
        loading={isLoading}
        itemLayout="horizontal"
        split={false}
        //   loadMore={loadMore}
        header={header}
        dataSource={data?.data}
        rowKey="Id"
        renderItem={(item) => (
          <List.Item actions={[<Radio value={item.Id} />]}>
            <List.Item.Meta
              title={item.Name}
              description={CombineAddress({ ...item })}
            />
          </List.Item>
        )}
      />
    </Radio.Group>
  );
};

export default ApartmentList;
