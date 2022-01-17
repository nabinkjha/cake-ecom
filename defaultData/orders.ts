
import { Order } from "@prisma/client";
const orders : Array<Order> =   [
 {
   
    paymentMethod: 'PayPal',
    itemsPrice: 180,
    shippingPrice: 15,
    taxPrice: 27,
    totalPrice: 222,
    userId:1,
    shippingAddress: {
        create: {
            fullName: 'Nabin Kumar jha',
            address: '7, Bedale Drive, Morley',
            city: 'Leeds',
            postalCode: 'LS27 8YF',
            country: 'UK',
            location: {}
          },
        
      }
    }
];

export default orders;