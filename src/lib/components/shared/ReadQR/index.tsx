import jsQR from 'jsqr';
import React, { useRef } from 'react';

type Props = {
  onSuccess: (data: string) => void;
};

const ReadQR = ({ onSuccess }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0, img.width, img.height);

          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );

          if (qrCode) {
            onSuccess(qrCode.data);
          }
        };
        img.src = event.target!.result as string;
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFile} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ReadQR;
