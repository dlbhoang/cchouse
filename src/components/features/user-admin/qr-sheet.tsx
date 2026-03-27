import { QRCode } from "antd";
import { Copy, QrCode, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "../../../lib/hooks/use-mobile";

type Props = {
  title?: string;
  description?: string;
  value: string;
};

const QrSheet = ({ title, description, value }: Props) => {
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <QrCode className="w-4 h-4" />
            {title}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex justify-center">
            <QRCode
              size={150}
              errorLevel="Q"
              value={value}
              icon="/logo.png"
              iconSize={32}
            />
          </div>
          <SheetFooter>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(value);
              }}
            >
              <Copy className="w-4 h-4" />
              Sao chép
            </Button>
            <Button variant="outline">
              <Share className="w-4 h-4" />
              Chia sẻ
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="w-4 h-4" />
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <QRCode
            size={150}
            errorLevel="Q"
            value={value}
            icon="/logo.png"
            iconSize={32}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(value);
            }}
          >
            <Copy className="w-4 h-4" />
            Sao chép
          </Button>
          <Button variant="outline">
            <Share className="w-4 h-4" />
            Chia sẻ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrSheet;
