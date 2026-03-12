import Image from "next/image";
import bannerImg from "../public/images/HeroImage.png";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="my-6 sm:my-10 md:my-15 relative">
      <Image
        src={bannerImg}
        alt="bannerImg"
        className="rounded-2xl h-48 sm:h-64 md:h-80 lg:h-100 w-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center flex-col text-white px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold ">
          New Autumn Collection{" "}
        </h1>
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3">
          Arrives
        </h1>
        <p className="hidden sm:block text-sm sm:text-base lg:text-lg ">
          Discover the latest trends and styles for the new season. Quality
          apparel for
        </p>
        <p className="hidden sm:block text-sm sm:text-base lg:text-lg mb-4 md:mb-6">
          every occasion
        </p>
        <Link
          href="/allproducts"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white text-sm sm:text-base"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
