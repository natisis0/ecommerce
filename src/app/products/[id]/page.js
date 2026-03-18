import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductById } from "@/_lib/data-service";
import Breadcrumb from "../../../../components/Breadcrumb";
import { ShieldCheck, Truck, Star } from "lucide-react";
import AddToCartButton from "../../../../components/AddToCartButton";
import YouMayAlsoLike from "../../../../components/YouMayAlsoLike";
import { SpinnerCustom } from "@/components/ui/spinner";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Ecommerce`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-[98%] max-w-7xl mx-auto py-8">
      <Breadcrumb />

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mt-6 md:mt-10 mb-20">
        {/* Left Side: Product Image Hero */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-2xl group border border-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              priority
            />
          </div>
          <p className="text-center text-sm font-medium text-gray-500 flex items-center justify-center gap-2 mt-4 bg-green-50/50 py-3 rounded-2xl">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            100% Authentic Product Guarantee
          </p>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col pt-2 sm:pt-6">
          <div className="mb-4">
            <span className="inline-block text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
              {product.category}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mt-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mt-6">
            <div className="flex text-amber-400 drop-shadow-sm">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-sm text-gray-500 font-semibold underline decoration-dotted underline-offset-4 cursor-pointer hover:text-gray-900 transition-colors">
              (128 Verified Reviews)
            </span>
          </div>

          <div className="mt-8">
            <p className="text-4xl sm:text-5xl font-black text-gray-900">
              ${Number(product.price).toFixed(2)}
            </p>
            <p className="text-sm font-medium text-gray-500 mt-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-500" />
              Free shipping on orders over $50
            </p>
          </div>

          <div className="mt-8 border-l-4 border-blue-600 pl-6 py-1">
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              {product.description ||
                "A wonderful addition to your daily lifestyle, crafted with quality and care. Perfect for everyday use with exceptional durability."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:border-blue-200 group">
              <span className="block text-xs text-gray-400 mb-1 uppercase tracking-widest font-bold group-hover:text-blue-500 transition-colors">
                Gender
              </span>
              <span className="text-xl font-bold text-gray-900">
                {product.gender}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:border-blue-200 group">
              <span className="block text-xs text-gray-400 mb-1 uppercase tracking-widest font-bold group-hover:text-blue-500 transition-colors">
                Sizing Options
              </span>
              <span className="text-xl font-bold text-gray-900">
                {product.dimension}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <AddToCartButton product={product} variant="full" />
          </div>

          {/* Additional Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-full">
                <ShieldCheck className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <span className="block text-sm text-gray-900 font-bold">
                  Secure Payments
                </span>
                <span className="block text-xs text-gray-500">
                  256-bit SSL encryption
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div>
                <span className="block text-sm text-gray-900 font-bold">
                  30 Days Return
                </span>
                <span className="block text-xs text-gray-500">
                  No questions asked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <Suspense fallback={<SpinnerCustom />}>
        <YouMayAlsoLike currentProductId={product.id} gender={product.gender} />
      </Suspense>
    </div>
  );
}
