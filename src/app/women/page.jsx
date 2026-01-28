import React from 'react'
import Breadcrumb from "../../../components/Breadcrumb";
import Card from "../../../components/Card";
import { womenProducts as women } from "../../../data/women";

const page = () => {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        <h1 className="text-3xl font-bold my-8">Women's Collection</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {women.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page
