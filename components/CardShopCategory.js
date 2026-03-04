import { getCategoryCards } from "@/_lib/data-service";
import CardforCategory from "./CardforCategory";

export default async function CardShopCategory() {
  const data = (await getCategoryCards()) || [];
  return (
    <div className="flex flex-wrap justify-between overflow-hidden">
      {data.map((item) => (
        <CardforCategory key={item.id} item={item} />
      ))}
    </div>
  );
}
