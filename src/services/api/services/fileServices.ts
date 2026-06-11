import { Upload } from "antd";
import type { RcFile } from "antd/es/upload";
import Compressor from "compressorjs";
import jsQR from "jsqr";
import JSZip from "jszip";

import { UploadFile } from "antd/lib";
import { NotiBase } from "@/lib/components/shared/NotiBase";
import { IMyUploadFile } from "@/lib/interfaces/custom/IMyUploadFile";
import imagesApi, { IFileUploadResponse } from "../imagesApi";
import utilsApi from "../utilsApi";

const FILE_VALIDATION_RULES = {
  DOCUMENT: {
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    maxSizeMB: 20,
  },
  IMAGE: {
    allowedTypes: ["image/jpeg", "image/png"],
    maxSizeMB: 8,
  },
  VIDEO: {
    allowedTypes: ["video/mp4"],
    maxSizeMB: 20,
  },
};

type ValidationConfig = {
  allowedTypes: readonly string[];
  maxSizeMB: number;
};

type UploadType =
  | "Property"
  | "Apartment"
  | "ApartmentUnit"
  | "User"
  | "Document"
  | "Notifications"
  | "ConfigAddress"
  | "Feed"
  | "News"
  | "Website/Feed";

type UploadResult = {
  newFiles: FormData;
  curFiles: string[];
};

const validateFileUpload = (fileUpload: IMyUploadFile): boolean => {
  console.log("Validating file:", fileUpload.type, fileUpload.size);

  // Detect file type and get corresponding validation rules
  let validationRule: ValidationConfig | undefined;

  if (
    FILE_VALIDATION_RULES.DOCUMENT.allowedTypes.includes(fileUpload.type ?? "")
  ) {
    validationRule = FILE_VALIDATION_RULES.DOCUMENT;
  } else if (
    FILE_VALIDATION_RULES.IMAGE.allowedTypes.includes(fileUpload.type ?? "")
  ) {
    validationRule = FILE_VALIDATION_RULES.IMAGE;
  } else if (
    FILE_VALIDATION_RULES.VIDEO.allowedTypes.includes(fileUpload.type ?? "")
  ) {
    validationRule = FILE_VALIDATION_RULES.VIDEO;
  }

  if (!validationRule) {
    NotiBase("error", `Không hỗ trợ định dạng "${fileUpload.type}"`);
    return Upload.LIST_IGNORE as any;
  }

  const isValidSize =
    (fileUpload.size ?? 0) / 1024 / 1024 < validationRule.maxSizeMB;
  if (!isValidSize) {
    NotiBase("error", `Dung lượng <= ${validationRule.maxSizeMB}MB!`);
  }

  return isValidSize || (Upload.LIST_IGNORE as any);
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const compressImage = (file: File): Promise<File> => {
  return new Promise<File>((resolve, reject) => {
    // eslint-disable-next-line no-new
    new Compressor(file, {
      quality: 0.6,
      success: (result) => {
        resolve(new File([result], file.name, { type: result.type }));
      },
      error: (error: Error) => reject(error),
    });
  });
};

// const compressImage = (file: File): Promise<File> => {
//   return new Promise<File>((resolve, reject) => {
//     // eslint-disable-next-line no-new
//     new Compressor(file, {
//       quality: 0.8,
//       maxWidth: 1200,
//       success: (result) => {
//         console.log('result', (result.size / 1024 / 1024).toFixed(2));
//         if (result.size > 1000 * 1024) {
//           // Nếu ảnh nén vẫn > 1MB, thử giảm quality thêm lần nữa
//           new Compressor(result, {
//             quality: 0.75,
//             maxWidth: 1200,
//             success(recompressed) {
//               resolve(
//                 new File([recompressed], file.name, { type: recompressed.type })
//               );
//             },
//             error(err) {
//               reject(err);
//             },
//           });
//         } else {
//           resolve(new File([result], file.name, { type: result.type }));
//         }
//       },
//       error: (error: Error) => reject(error),
//     });
//   });
// };

const mapFromFileUpload = (files: IFileUploadResponse[]): IMyUploadFile[] =>
  files.map((item) => ({
    uid: item.Id.toString(),
    name: item.FileName,
    url: item.Path,
    createdBy: item.CreatedBy,
    createdDate: item.CreatedDate,
    blobName: item.BlobName,
    type: "image/png",
    status: "done",
  }));

const mapFromString = (
  files?: string | string[]
): IMyUploadFile[] | undefined => {
  if (!files) return undefined;

  const fileArray = Array.isArray(files) ? files : files.split("|");
  return fileArray.map((item) => ({
    uid: item,
    name: item,
    url: item,
    type: "image/png",
    createdBy: "",
    createdDate: "",
  }));
};

type Props = {
  images: IMyUploadFile[];
  type: UploadType;
  compress?: boolean;
};

const handleFilesV2 = async ({
  images,
  type,
  compress,
}: Props): Promise<UploadResult> => {
  const keepImages: string[] = [];
  const filesData = new FormData();
  filesData.append("type", type);

  console.log(images);

  const compressPromises = images.map((e) => {
    if (e.originFileObj) {
      if (compress) return compressImage(e.originFileObj as File);
      filesData.append("files", e.originFileObj as File);
    }
    if (e.url) {
      keepImages.push(e.url);
    }
    return Promise.resolve(null);
  });
  try {
    const compressedFiles = await Promise.all(compressPromises);

    compressedFiles.forEach((e) => {
      if (e) {
        filesData.append("files", e);
      }
    });
  } catch (error) {
    NotiBase("error", "xử lý ảnh thất bại!");
    console.error("Error processing images:", error);
    throw error;
  }

  return {
    curFiles: keepImages,
    newFiles: filesData,
  };
};

const uploadImages = async (
  images: IMyUploadFile[],
  type: UploadType
): Promise<string[]> => {
  const files = await handleFilesV2({ images, type, compress: true });
  if (files.newFiles.has("files")) {
    files.newFiles.append("TableName", type);
    const result = await utilsApi.upload(files.newFiles);
    if (result?.data) {
      return files.curFiles ? [...files.curFiles, ...result.data] : result.data;
    }
  }
  return files.curFiles;
};

const uploadOriginImages = async (
  images: File[],
  TableName: number,
  resize?: boolean,
  watermark?: boolean
): Promise<string[]> => {
  const filesData = new FormData();
  filesData.append("tableName", tableName.toString());
  filesData.append("resize", resize?.toString() ?? "false");
  filesData.append("watermark", watermark?.toString() ?? "false");
  const compressPromises = images.map((e) => {
    return compressImage(e);
  });
  try {
    const compressedFiles = await Promise.all(compressPromises);

    compressedFiles.forEach((e) => {
      if (e) {
        filesData.append("files", e);
      }
    });

    const result = await imagesApi.upload(filesData);

    return result?.data;
  } catch (error) {
    NotiBase("error", "xử lý ảnh thất bại!");
    console.error("Error processing images:", error);
    throw error;
  }
};

const uploadFiles = async (
  images: IMyUploadFile[],
  type: UploadType
): Promise<string[]> => {
  const files = await handleFilesV2({ images, type, compress: false });
  if (files.newFiles.has("files")) {
    files.newFiles.append("TableName", type);
    const result = await utilsApi.upload(files.newFiles);
    if (result?.data) {
      return files.curFiles ? [...files.curFiles, ...result.data] : result.data;
    }
  }
  return files.curFiles;
};

const uploadVideo = async (file: File, type: UploadType): Promise<string> => {
  const filesData = new FormData();
  filesData.append("type", type);
  filesData.append("files", file);
  const result = await utilsApi.video(filesData);
  return result.data.toString();
};

const readQR = (file?: RcFile): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

        if (qrCode) {
          resolve(qrCode.data);
        } else {
          reject(new Error("Không tìm thấy QR"));
        }
      };
      img.src = event.target!.result as string;
    };
    if (file) reader.readAsDataURL(file);
  });
};

const downloadAsync = async (images: IMyUploadFile[]) => {
  console.log("images", images);

  const zip = new JSZip();

  const promises = images.map((e) =>
    fetch(e.url ?? "", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "origin",
      },
    })
  );
  const results = await Promise.all(promises);
  for (let idx = 0; idx < results.length; idx += 1) {
    const e = results[idx];
    // eslint-disable-next-line no-await-in-loop
    const blob = await e.blob();
    const path = images[idx].url?.split("/").pop();
    zip.file(path ?? "", blob);
  }

  const zipData = await zip.generateAsync({
    type: "blob",
    streamFiles: true,
  });
  console.log(zipData);
  // Create a download link for the zip file
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(zipData);
  link.download = "hinh-anh.zip";
  link.click();
};

const uploadFilesNoAuth = async (
  images: IMyUploadFile[],
  type: UploadType
): Promise<string[]> => {
  const files = await handleFilesV2({ images, type, compress: false });
  if (files.newFiles.has("files")) {
    const result = await utilsApi.uploadNoAuth(files.newFiles);
    if (result?.data) {
      return files.curFiles ? [...files.curFiles, ...result.data] : result.data;
    }
  }
  return files.curFiles;
};

const beforeUpload = (file: RcFile) => {
  const isValid = fileServices.validateFileUpload(file);
  if (!isValid) return false;

  if (isValid && file.type.includes("image")) {
    try {
      console.log(
        "Original file size:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      const data = compressImage(file);
      data.then((compressedFile) => {
        console.log(
          "Compressed file size:",
          (compressedFile.size / 1024 / 1024).toFixed(2),
          "MB"
        );
      });
      return data;
    } catch (error) {
      NotiBase("error", "xử lý ảnh thất bại!");
      console.error("Error processing images:", error);
      throw error;
    }
  }
  return true;
};

const processFiles = (files: UploadFile<{ data: string[] }>[]): string[] => {
  const hasError = files.some((file) => file.status === "error");
  if (hasError) {
    NotiBase("error", "Thông tin hình ảnh không hợp lệ!");
    return [];
  }
  return files.flatMap((file) => {
    if (file.response?.data) return file.response.data;
    return file?.url ?? [];
  });
};

const fileTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const validateFile = (fileUpload: IMyUploadFile): boolean => {
  console.log("fileUpload.type", fileUpload.type);

  const isJpgOrPng = fileTypes.includes(fileUpload.type ?? "");
  if (!isJpgOrPng) {
    NotiBase("error", `định dạng "${fileUpload.type}" không hợp lệ`);
  }
  const isLt2M = (fileUpload.size ?? 0) / 1024 / 1024 < 20;
  if (!isLt2M) {
    NotiBase("error", "Dung lượng <= 20MB!");
  }

  return (isJpgOrPng && isLt2M) || (Upload.LIST_IGNORE as any);
};
const validateImg = (fileUpload: IMyUploadFile): boolean => {
  console.log("size", fileUpload.size);

  const isJpgOrPng =
    fileUpload.type === "image/jpeg" || fileUpload.type === "image/png";
  if (!isJpgOrPng) {
    NotiBase("error", `định dạng "${fileUpload.type}" không hợp lệ`);
  }
  const isLt2M = (fileUpload.size ?? 0) / 1024 / 1024 < 8;
  if (!isLt2M) {
    NotiBase("error", "Dung lượng <= 8MB!");
  }

  return (isJpgOrPng && isLt2M) || (Upload.LIST_IGNORE as any);
};

export const fileServices = {
  beforeUpload,
  processFiles,

  validateFile,
  validateImg,
  getBase64,
  mapFromFileUpload,
  mapFromString,
  uploadImages,
  uploadOriginImages,
  uploadFilesNoAuth,
  uploadVideo,
  uploadFiles,
  readQR,
  downloadAsync,

  validateFileUpload,
};
