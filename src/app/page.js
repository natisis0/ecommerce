import Link from "next/link";
import { Suspense } from "react";
import CardShopCategory from "../../components/CardShopCategory";
import HeroSection from "../../components/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts";
import { SpinnerCustom } from "@/components/ui/spinner";

export const revalidate = 120;

export default function Home() {
  return (
    <div className="w-[98%] mx-auto ">
      <HeroSection />
      <section>
        <div className="flex flex-wrap justify-between mb-3  ">
          <h2 className="font-bold text-lg">Featured Products</h2>
          <Link href="/allproducts" className="text-blue-600 dark:text-sky-400">
            View All
          </Link>
        </div>

        <Suspense fallback={<SpinnerCustom />}>
          <FeaturedProducts />
        </Suspense>
      </section>

      <section>
        <h2 className="font-bold text-center mt-12 md:mt-20 lg:mt-30 text-2xl md:text-3xl lg:text-4xl mb-4">
          Shop by Category
        </h2>
        <Suspense fallback={<SpinnerCustom />}>
          <CardShopCategory />
        </Suspense>
      </section>
    </div>
  );
}
