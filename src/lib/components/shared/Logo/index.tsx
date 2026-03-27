import { Image } from "antd";
import Link from "next/link";

import { AppRoutes } from "@/lib/core/configs/appRoutes";
import { ETransType } from "@/lib/core/enum";

const Logo = () => {
  return (
    <Link href={`${AppRoutes.property.url}?TransType=${ETransType.sell}`}>
      <Image
        src="/logo.png"
        alt="cchouse logo"
        preview={false}
        width={50}
        height={50}
      />
    </Link>
  );
};

export default Logo;
