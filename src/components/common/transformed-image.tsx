"use client";

import { IImage } from "@/lib/database/models/image.model";
import Image from "next/image";
import { DownloadCloud, Loader2 } from "lucide-react";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import React from "react";

interface TransformedImageProps {
  image: IImage | null;
  type: TransformationTypeKey;
  title: string;
  isTransforming: boolean;
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
  transformationConfig: Transformations | null;
  hasDownload?: boolean;
}

const TransformedImage = ({
  image,
  type,
  title,
  isTransforming,
  setIsTransforming,
  transformationConfig,
  hasDownload = false,
}: TransformedImageProps) => {
  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId as string,
        ...transformationConfig,
      }),
      title,
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-[30px] leading-[140%] text-dark-600">
          Transformed
        </h3>
        {hasDownload && (
          <button
            className="p-14-medium mt-2 flex items-center gap-2 px-2"
            onClick={downloadHandler}
          >
            <DownloadCloud size={24} />
          </button>
        )}
      </div>

      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            src={image?.publicId}
            sizes={"(max-width: 767px) 100vw, 50vw"}
            alt={image?.title}
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            placeholder={dataUrl as PlaceholderValue}
            className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 dark:bg-transparent object-cover p-2"
            onLoad={() => setIsTransforming && setIsTransforming(false)}
            onError={() => {
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            {...transformationConfig}
          />
          {isTransforming && (
            <div className="flex-center absolute left-[50%] top-[50%] size-full -translate-x-1/2 -translate-y-1/2 flex-col gap-2 rounded-[10px] border bg-dark-700/90">
              <Loader2 className="animate-spin " />
              <p className="text-white/80">Please Wait...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-center p-14-medium h-full min-h-72 flex-col gap-5 rounded-[16px] border border-dashed dark:bg-none bg-purple-100/20 shadow-inner">
          Transformed Image
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
