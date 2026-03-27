import { Breadcrumb } from 'antd';
import Link from 'next/link';

type Props = {
  items: { url: string; name: string }[];
  current?: string;
};
const MyBreadcrumb = ({ items, current }: Props) => {
  const result = items?.map((e) => ({
    title: <Link href={e.url}>{e.name}</Link>,
  }));
  return (
    <Breadcrumb items={current ? [...result, { title: current }] : result} />
  );
};

export default MyBreadcrumb;
