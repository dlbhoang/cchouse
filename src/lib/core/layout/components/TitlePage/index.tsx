import { Typography } from "antd";

import { useAdminContext } from "@/lib/stored";

const TitlePage = ({ title }: { title?: string }) => {
  const { smallScreen } = useAdminContext();
  return (
    <Typography.Title
      level={smallScreen ? 5 : 4}
      style={{ margin: "0px 0px 10px 0px" }}
    >
      {title?.toUpperCase()}
    </Typography.Title>
  );
};

export default TitlePage;
