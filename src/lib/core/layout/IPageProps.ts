import { Session } from 'next-auth';

export interface IPageProps {
  session?: Session | null;
  titleProp?: string;
  breadcrumbItems?: { url: string; name: string }[];
  breadcrumbCurrent?: string;
  addUrl?: string;
  hideMobileMenu?: boolean;
  // ...
}
