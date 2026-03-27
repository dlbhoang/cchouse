import { Card } from "antd";
import { useEffect, useState } from "react";
import { baseFilter } from "@/lib/core/configs/appConst";
import type { IBaseOpts } from "@/services/api/base";
import imageCloudApi from "@/services/api/image-cloud/imageCloudApi";
import type { IImageCloud } from "@/services/api/image-cloud/model";
import ImageCloudFilter from "./filter";
import ImageCloudTable from "./table";

const ImageCloudPage = () => {
  const [data, setData] = useState<IImageCloud[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [opts, setOpts] = useState<IBaseOpts>(baseFilter);

  const handleFilter = (opts: IBaseOpts) => {
    setOpts(opts);
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await imageCloudApi.get(opts);
      setData(result.data);
      setTotal(result.totalRow ?? 0);
      setLoading(false);
    };
    fetch();
  }, [opts]);

  return (
    <Card>
      <ImageCloudFilter onSubmit={handleFilter} model={opts} />

      <ImageCloudTable
        data={data}
        total={total}
        loading={loading}
        searchOptions={opts}
        onPageIndexChange={() => {}}
        handleRequestModal={() => {}}
        handleMutate={() => {}}
      />
      {/* <HappyBirthdayModal /> */}
    </Card>
  );
};

export default ImageCloudPage;
