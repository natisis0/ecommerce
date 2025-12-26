import Image from "next/image";
import bannerImg from "../../public/images/banner_mens.png";
import { featuredProducts } from "../../data/featured";
import Card from "../../components/Card";
import Link from "next/link";
import CardShopCategory from "../../components/CardShopCategory";
export default function Home() {
  return (
    <div className="w-[98%] mx-auto ">
      <section className="my-15 relative">
        <Image
          src={bannerImg}
          alt="bannerImg"
          className="rounded-2xl h-100 w-full"
        />
        <div className="absolute inset-0 flex items-center justify-center flex-col text-white bg-black/40">
          <h1 className="text-6xl font-bold ">New Autumn Collection </h1>
          <h1 className="text-6xl font-bold mb-3">Arrives</h1>
          <p className="text-lg ">
            Discover the latest trends and styles for the new season. Quality
            apparel for
          </p>
          <p className="text-lg mb-6">every occasion</p>
          <Link
            href="/allproducts"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white "
          >
            Shop Now
          </Link>
        </div>
      </section>
      <section>
        <div className="flex flex-wrap justify-between mb-3  ">
          <h2 className="font-bold text-lg">Featured Products</h2>
          <Link href="/allproducts" className="text-blue-600 dark:text-sky-400">
            View All
          </Link>
        </div>

        <ul className="flex flex-wrap gap-3 justify-between  overflow-hidden">
          {featuredProducts.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-bold text-center mt-30 text-4xl mb-4">
          Shop by Category
        </h2>
        <CardShopCategory />
      </section>
    </div>
  );
}
