import Link from "next/link";
import { navLinks } from "@/constants";
import { Icon } from "@/components/common/link-item";
import { Collection } from "@/components/common/collection";
import { getAllImages } from "@/lib/actions/image.actions";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";

  const images = await getAllImages({
    page,
    searchQuery,
  });

  return (
    <>
      <section className="sm:flex-center hidden h-48 flex-col gap-8 rounded-[20px] border bg-banner bg-cover bg-no-repeat p-10 shadow-inner">
        <h1 className="text-[36px] font-semibold sm:text-[44px] leading-[120%] sm:leading-[56px] max-w-[500px] flex-wrap text-center text-white shadow-sm">
          Craft your Visions.
        </h1>

        <ul className="flex items-center justify-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link?.route}
              href={link?.route}
              className="flex flex-col justify-center items-center gap-2"
            >
              <li className="flex flex-col items-center justify-center rounded-full bg-white p-2 transition hover:bg-gray-200">
                <Icon icon={link?.icon} />
              </li>
              <span className="text-white font-semibold hover:text-gray-200 transition">
                {link?.label}
              </span>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection
          images={images?.data}
          hasSearch={true}
          page={page}
          totalPages={images?.totalPages}
        />
      </section>
    </>
  );
};

export default Home;
