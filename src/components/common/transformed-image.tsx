import { IImage } from "@/lib/database/models/image.model";
import Image from "next/image";
import { DownloadCloud } from "lucide-react";

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
        <div className="relative"></div>
      ) : (
        <div className="flex-center p-14-medium h-full min-h-72 flex-col gap-5 rounded-[16px] border border-dashed dark:bg-none bg-purple-100/20 shadow-inner">
          Transformed Image
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
