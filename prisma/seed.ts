import {PrismaClient} from '@prisma/client';
import productCategories from '../defaultData/productCategory';
import products from '../defaultData/products';
import productTypes from '../defaultData/productType';
import users from '../defaultData/users';

const prisma = new PrismaClient();
async function main() {

    const deleteUsers = await   prisma.user.deleteMany({});
    const deleteProduct = await  prisma.product.deleteMany({});
    const deleteProductCategories = await  prisma.productCategory.deleteMany({});
    const deleteProductTypes = await  prisma.productType.deleteMany({});
    
//     console.log("Seeding productTypes....")

    for (let item of productTypes){
        await prisma.productType.create({
            data:{name:item.name}
        })
    }
    console.log("Seeding productCategories....")
    for (let item of productCategories){
        await prisma.productCategory.create({
            data:{name:item.name}
        })
    }
    console.log("Seeding products....")
    for (let product of products){
        await prisma.product.create({
            data:product
        })
    }
    console.log("Seeding user....")
    for (let user of users){
      await prisma.user.create({
          data:user
      })
  }
    await prisma.$disconnect();

}
main().catch(e=>{
    console.log(e);
    process.exit(1)
}).finally(() =>{
    prisma.$disconnect();
});
