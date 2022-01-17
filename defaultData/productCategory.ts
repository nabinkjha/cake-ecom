import { ProductCategory } from "@prisma/client";

const productCategories: Array<ProductCategory>  =  [
  {id:1,name: 'Classic',isActive:true},
  {id:2,name: 'Premium',isActive:true},
  {id:3,name: 'Exotic',isActive:true},
  {id:4,name: 'Kids',isActive:true}
];

export default productCategories;