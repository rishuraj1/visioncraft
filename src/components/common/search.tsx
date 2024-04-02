"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Filter, SearchIcon } from "lucide-react";
import { FilterBadge } from "./filter-badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [showFilterOption, setShowFilterOption] = useState(false);

  const filterOptions = [
    { label: "Title", value: "Title" },
    { label: "Author", value: "Author" },
  ];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        const newUrl = formUrlQuery({
          searchParams: searchParams.toString(),
          key: "query",
          value: query,
        });

        router.push(newUrl, { scroll: false });
      } else {
        const newUrl = removeKeysFromQuery({
          searchParams: searchParams.toString(),
          keysToRemove: [`${searchBy.toLowerCase()}`, `query`],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [router, searchParams, query, searchBy]);

  return (
    <div className="flex items-center dark:bg-gray-900 w-full rounded-[16px] border-2 border-purple-200/20 bg-white px-4 shadow-sm shadow-purple-200/15 md:max-w-96">
      <SearchIcon />

      <Input
        className="border-0 bg-transparent text-dark-600 w-full placeholder:text-dark-400 h-[50px] p-16-medium focus-visible:ring-offset-0 p-3 focus-visible:ring-transparent dark:text-dark-400 !important"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex items-center justify-center gap-1">
        {searchBy && (
          <div className="flex items-center justify-center">
            <FilterBadge label={searchBy} setSearchBy={setSearchBy} />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Filter className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filterOptions?.map((option) => (
              <DropdownMenuCheckboxItem
                key={option?.value}
                checked={searchBy === option?.value}
                onCheckedChange={() => {
                  setSearchBy(option?.value);
                }}
              >
                {option?.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
