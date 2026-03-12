import React, { Suspense } from "react";
import Breadcrumb from "../../../components/Breadcrumb";
import GenderProducts from "../../../components/GenderProducts";
import { SpinnerCustom } from "@/components/ui/spinner";

export const revalidate = 120;

const Page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb />
      <div className="mt-8">
        <Suspense fallback={<SpinnerCustom />}>
          <GenderProducts gender="Kids" title="Kids' Collection" />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
