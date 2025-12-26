
import { allProducts } from "./allProduct.js";


export const featuredProducts = [
  // Women's Picks
  allProducts.find((p) => p.id === "prod-003"), // Modern Black Tee
  
  // Men's Picks
  allProducts.find((p) => p.id === "prod-019"), // Light Grey Zip Hoodie
  // Kid's Pick
  allProducts.find((p) => p.id === "prod-027"), // Black Kids Jacket
  //women
  allProducts.find((p) => p.id === "prod-010"), // Patterned Midi Dress
].filter(Boolean); // '.filter(Boolean)' safely removes any products if their ID wasn't found (highly recommended).
