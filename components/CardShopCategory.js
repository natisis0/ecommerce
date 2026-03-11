import { getCategoryCards } from "@/_lib/data-service";
import CardforCategory from "./CardforCategory";

export default async function CardShopCategory() {
  const data = (await getCategoryCards()) || [];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <CardforCategory key={item.id} item={item} />
      ))}
    </div>
  );
}
