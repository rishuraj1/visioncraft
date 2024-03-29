"use client";

import { useToast } from "@/components/ui/use-toast";
import { IImage } from "@/lib/database/models/image.model";
import { dataUrl, getImageSize } from "@/lib/utils";
import { Image } from "lucide-react";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

interface MediaUploaderProps {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<React.SetStateAction<IImage | null>>;
  publicId: string;
  image: any;
  type: string;
}

const MediaUploader = ({
  onValueChange,
  setImage,
  publicId,
  image,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();
  const onUploadSuccessHandler = (response: any) => {
    setImage((prev: any) => ({
      ...prev,
      publicId: response?.info?.public_id,
      width: response?.info?.width,
      height: response?.info?.height,
      secureUrl: response?.info?.secure_url,
    }));
    onValueChange(response?.info?.public_id);
    toast({
      title: "Image uploaded successfully!",
      description: "1 credit was used to upload the image.",
      className: "bg-green-100 text-green-900",
      duration: 5000,
    });
  };
  const onUploadErrorHandler = () => {
    toast({
      title: "Something went wrong!",
      description: "An error occurred while uploading the image",
      className: "bg-red-100 text-red-900",
      duration: 5000,
    });
  };
  return (
    <CldUploadWidget
      uploadPreset="visioncraft"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-[30px] leading-[140%] text-dark-600">
            Original
          </h3>

          {publicId ? (
            <>
              <div className="cursor-pointer rounded-[10px] overflow-hidden">
                <CldImage
                  src={publicId}
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  alt="Uploaded image"
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  placeholder={dataUrl as PlaceholderValue}
                  className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 object-cover p-2"
                />
              </div>
            </>
          ) : (
            <div
              className="flex-center flex h-72 cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100/20 shadow-inner"
              onClick={() => open()}
            >
              <div className="rounded-[16px] flex justify-center items-center flex-col bg-white  p-5 shadow-sm shadow-purple-200/50">
                <Image className="h-20 w-20" />
                <p>Click to upload</p>
              </div>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
