"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { convertTime, formUrlQuery } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Icon } from "./link-item";
import { Search } from "@/components/common/search";
import { SearchX } from "lucide-react";
import { UserAvatar } from "./user-avatar";

export const Collection = ({
  hasSearch = false,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // PAGINATION HANDLER
  const onPageChange = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams: searchParams.toString(),
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="md:flex-between mb-6 flex flex-col gap-5 md:flex-row">
        <h2 className="text-[30px] font-bold md:text-[36px] leading-[110%] text-dark-600 dark:text-dark-400">
          Recent Edits
        </h2>
        {hasSearch && <Search />}
      </div>

      {images?.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image) => (
            <Card image={image} key={image._id} />
          ))}
        </ul>
      ) : (
        <div className="flex justify-center items-center flex-col gap-2 h-60 w-full rounded-[10px] border border-dark-400/10 bg-white/20 dark:bg-transparent dark:border-none">
          <SearchX className="w-8 h-8 mr-3" />
          <p className="font-semibold text-[20px] leading-[140%]">Empty List</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="button w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex justify-center items-center font-medium text-[16px] leading-[140%] w-fit flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="py-4 px-6 flex-center gap-3 rounded-full p-16-semibold focus-visible:ring-offset-0 focus-visible:ring-transparent !important w-32 bg-purple-gradient bg-cover text-white"
              onClick={() => onPageChange("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

const Card = ({ image }: { image: IImage }) => {
  console.log(image);
  const time = convertTime(image?.updatedAt as Date);
  console.log(time);
  return (
    <li>
      <Link
        href={`/transformations/${image._id}`}
        className="flex flex-1 cursor-pointer flex-col gap-5 rounded-[16px] border-2 dark:border-none border-purple-200/15 bg-white dark:bg-gray-900/80 p-4 shadow-xl shadow-purple-200/10 transition-all hover:shadow-purple-200/20 dark:shadow-xl dark:hover:shadow-md dark:hover:shadow-purple-200/20"
      >
        <CldImage
          src={image.publicId}
          alt={image.title}
          width={image.width}
          height={image.height}
          {...image.config}
          loading="lazy"
          className="h-52 w-full rounded-[10px] object-cover"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
        />
        <div className="flex justify-between items-center">
          <p className="font-semibold text-[20px] leading-[140%] mr-3 line-clamp-1 text-dark-600 dark:text-dark-400">
            {image.title}
          </p>
          <Icon
            icon={
              transformationTypes[
                image.transformationType as TransformationTypeKey
              ].icon
            }
          />
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="flex items-end gap-1">
            <UserAvatar
              src={image?.author?.photo as string}
              name={image?.author?.firstName}
            />
            <p className="flex flex-col ">
              <span className="dark:text-zinc-600 text-[12px]">
                @{image?.author?.username}
              </span>
              <span className="text-[16px] leading-[140%] text-dark-400 dark:text-white/60">
                {image.author?.firstName as string}
              </span>
            </p>
          </div>
          <p className="text-[14px] leading-[140%] text-dark-400 dark:text-dark-500">
            {time}
          </p>
        </div>
      </Link>
    </li>
  );
};
