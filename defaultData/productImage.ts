import { ProductCategory } from "@prisma/client";

const productCategories: Array<ProductImage>  =  [
  {id:1,productId: 1,imageUrl:'https://lh3.googleusercontent.com/p/AF1QipPbeV32zEvFV3F29NvkUwB8huKF004Ldk3ppzIb=s16383-w1024',isFeatured:true,isActive:true},
  {id:2,productId: 1,imageUrl:'https://lh3.googleusercontent.com/p/AF1QipPbeV32zEvFV3F29NvkUwB8huKF004Ldk3ppzIb=s16383-w1024',isFeatured:false,isActive:true},
  {id:3,productId: 1,imageUrl:'https://lh3.googleusercontent.com/p/AF1QipPbeV32zEvFV3F29NvkUwB8huKF004Ldk3ppzIb=s16383-w1024',isFeatured:false,isActive:true},
  {id:4,productId: 1,imageUrl:'https://lh3.googleusercontent.com/p/AF1QipPbeV32zEvFV3F29NvkUwB8huKF004Ldk3ppzIb=s16383-w1024',isFeatured:false,isActive:true}
];

export default productCategories;