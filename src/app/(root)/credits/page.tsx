import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { plans } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { Ban, Check, CreditCard, Cross } from "lucide-react";
import Checkout from "@/components/common/checkout";

const Credit = async () => {
  const { userId } = auth();

  if (!userId) redirect("/login");

  const user = await getUserById(userId);

  return (
    <>
      <Header
        Title="Buy Credits"
        Subtitle="Buy credits to use for your transformations"
      />
      <section>
        <ul className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-9 xl:grid-cols-3">
          {plans.map((plan) => (
            <li
              key={plan._id}
              className="bg-white/80 dark:bg-dark-600/20 shadow-lg rounded-lg overflow-hidden"
            >
              <div className="px-5 py-8 flex flex-col items-center">
                {/* <Image
                  src={plan.icon}
                  alt={plan.name}
                  width={100}
                  height={100}
                /> */}
                <CreditCard className="w-20 h-20 mx-auto" />
                <h3 className="mt-6 text-center text-2xl font-semibold text-gray-900 dark:text-white/50">
                  {plan.name}
                </h3>
                <p className="mt-4 text-center text-2xl font-semibold text-gray-900 dark:text-white/50">
                  ${plan.price}
                </p>

                <ul className="gap-3 flex flex-col items-center justify-center mt-3">
                  <div className="flex flex-col items-start gap-3">
                    {plan.inclusions.map((inclusion, index) => (
                      <li key={index} className="flex gap-1">
                        <span>
                          {inclusion?.isIncluded ? (
                            <Check className="w-5 h-5 mr-2 text-green-500" />
                          ) : (
                            <Ban className="w-5 h-5 mr-2 text-red-500" />
                          )}
                        </span>
                        {inclusion?.label}
                      </li>
                    ))}
                  </div>
                </ul>
                {plan?.name === "Free" ? (
                  <Button variant={"outline"} className="w-full mt-6">
                    Free
                  </Button>
                ) : (
                  <SignedIn>
                    <Checkout
                      plan={plan?.name}
                      amount={plan?.price}
                      credits={plan?.credits}
                      buyerId={user?._id}
                    />
                  </SignedIn>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credit;
