import Header from "@/components/common/header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/common/transformation-form";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const { userId } = auth();
  if (!userId) redirect("/login");
  const user = await getUserById(userId);
  const transformation = transformationTypes[type];
  return (
    <>
      <Header
        Title={transformation?.title}
        Subtitle={transformation?.subTitle}
      />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user?._id}
          type={transformation?.type as TransformationTypeKey}
          creditBalance={user?.creditBalance as number}
        />
      </section>
    </>
  );
};

export default AddTransformationTypePage;
