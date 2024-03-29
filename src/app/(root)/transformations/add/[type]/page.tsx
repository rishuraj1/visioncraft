import Header from "@/components/common/header";
import React from "react";
import { transformationTypes } from "@/constants";
import TransformationForm from "@/components/common/transformation-form";

const AddTransformationTypePage = ({ params: { type } }: SearchParamProps) => {
  const transformation = transformationTypes[type];
  return (
    <>
      <Header
        Title={transformation?.title}
        Subtitle={transformation?.subTitle}
      />

      <TransformationForm />
    </>
  );
};

export default AddTransformationTypePage;
