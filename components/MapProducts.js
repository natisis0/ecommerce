
import Card from './Card'

export default function MapProducts({products}) {
  return (
    <>
       {products.map((item) => (
          <Card key={item.id} item={item} />
        ))}
    </>
  )
}
