"use client";

import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getCldImageUrl } from "next-cloudinary";
import { useRouter } from "next/navigation";

import { IImage } from "@/lib/database/models/image.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
  FormItem,
  useFormField,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputField } from "./input-field";
import {
  aspectRatioOptions,
  creditFee,
  transformationTypes,
} from "@/constants";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import MediaUploader from "./media-uploader";
import TransformedImage from "./transformed-image";
import { updateCredits } from "@/lib/actions/user.actions";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { InsufficientCreditsModal } from "./insufficient-credits-modal";

interface TransformationFormProps {
  action: "Add" | "Update";
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  data?: IImage | null;
  config?: Transformations | null;
}

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const router = useRouter();
  const transformationType = transformationTypes[type];

  const [image, setImage] = useState<IImage | null>(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] =
    useState<Transformations | null>(config);
  const [isPending, startTransition] = useTransition();

  const initialFormValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsSubmitting(true);
    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId as string,
        ...transformationConfig,
      });

      const imageData = {
        title: values.title as string,
        publicId: image?.publicId as string,
        transformationType: type as string,
        width: image?.width as number,
        height: image?.height as number,
        config: transformationConfig as any,
        secureUrl: image?.secureUrl as string,
        transformationUrl: transformationUrl as string,
        aspectRatio: values?.aspectRatio,
        prompt: values?.prompt,
        color: values?.color,
      };
      console.log(imageData);

      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: "/",
          });
          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage?._id}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
      if (action === "Update") {
        try {
          const updatedImage = await updateImage({
            image: {
              ...imageData,
              _id: data?._id,
            },
            userId,
            path: `/transformations/${data?._id}`,
          });
          if (updatedImage) {
            router.push(`/transformations/${updatedImage?._id}`);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    setIsSubmitting(false);
  }

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void,
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prev: any) => ({
      ...prev,
      aspectRatio: imageSize?.aspectRatio,
      width: imageSize?.width,
      height: imageSize?.height,
    }));
    setNewTransformation(transformationType.config);

    return onChangeField(value);
  };

  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: TransformationTypeKey,
    onChangeField: (value: string) => void,
  ) => {
    debounce(() => {
      setNewTransformation((prev: any) => ({
        ...prev,
        [type]: {
          ...prev?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));

      return onChangeField(value);
    }, 1000);
  };

  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig),
    );

    setNewTransformation(null);

    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  };

  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config);
    }
  }, [image, transformationType.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}
        <InputField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => (
            <Input
              placeholder="Enter title of the image"
              {...field}
              className="rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 dark:text-zinc-400 disabled:opacity-100 p-16-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent !important"
            />
          )}
        />
        {type === "fill" && (
          <InputField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full outline-none"
            render={({ field }) => (
              <Select
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
                value={field.value}
              >
                <SelectTrigger className="w-full border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 rounded-[16px] h-[50px] md:h-[54px] text-dark-600 p-16-semibold disabled:opacity-100 placeholder:text-dark-400/50 px-4 py-3 focus:ring-offset-0 focus-visible:ring-transparent focus:ring-transparent focus-visible:ring-0 focus-visible:outline-none !important">
                  <SelectValue placeholder="Type of Aspect Ratio" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="py-3 cursor-pointer hover:bg-purple-100"
                    >
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
            <InputField
              control={form.control}
              name="color"
              formLabel={
                type === "remove" ? "Object to Remove" : "Object to Recolor"
              }
              className="w-full"
              render={({ field }) => (
                <Input
                  placeholder="Enter object to remove"
                  value={field.value}
                  className="rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 dark:text-zinc-400 disabled:opacity-100 p-16-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent !important"
                  onChange={(e) =>
                    onInputChangeHandler(
                      "prompt",
                      e.target.value,
                      type,
                      field.onChange,
                    )
                  }
                />
              )}
            />

            {type === "recolor" && (
              <InputField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    placeholder="Enter replacement color"
                    value={field.value}
                    className="rounded-[16px] border-2 border-purple-200/20 shadow-sm shadow-purple-200/15 text-dark-600 dark:text-zinc-400 disabled:opacity-100 p-16-semibold h-[50px] md:h-[54px] focus-visible:ring-offset-0 px-4 py-3 focus-visible:ring-transparent !important"
                    onChange={(e) =>
                      onInputChangeHandler(
                        "color",
                        e.target.value,
                        "recolor",
                        field.onChange,
                      )
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
          <InputField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
            className="bg-purple-gradient hover:bg-purple-700 dark:text-zinc-300 bg-cover rounded-full py-4 px-6 p-16-semibold h-[50px] w-full md:h-[54px] capitalize"
          >
            {isTransforming ? (
              <Loader2 className="animate-spin h-6 w-6 text-white" />
            ) : (
              "Transform"
            )}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-purple-gradient hover:bg-purple-700 dark:text-zinc-300 bg-cover rounded-full py-4 px-6 p-16-semibold h-[50px] w-full md:h-[54px] capitalize"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-6 w-6 text-white" />
            ) : (
              "Save Image"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
