import { IImage } from "@/lib/database/models/image.model";
import Image from "next/image";
import { DownloadCloud, Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

interface TransformedImageProps {
  image: IImage | null;
  type: TransformationTypeKey;
  title: string;
  isTransforming: boolean;
  setIsTransforming: React.Dispatch<React.SetStateAction<boolean>>;
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
  const downloadHandler = () => {};
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
              }, 8000);
            }}
            {...transformationConfig}
          />
          {isTransforming && <Loader2 className="absolute animate-spin" />}
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
