import { ExternalLink, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  icon: LucideIcon;
  trend: "up" | "down";
  change: string;
  value: string;
  label: string;
  href: string;
};

const StatisticCard = ({
  icon: IconComponent,
  trend,
  // change,
  value,
  label,
  href,
}: Props) => {
  return (
    <Card className="border-gray-200">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-gray-600" />
          </div>
          <Link href={href} target="_blank">
            <Button variant="ghost" size="icon">
              <ExternalLink />
            </Button>
          </Link>
        </div>
        <div className="text-2xl font-semibold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
