import {User} from '@prisma/client'
const users:  Array<User>=  [
  {
    id:1,
    name: 'Nabin Jha',
    email: 'sales@nabin.com',
    password: '$2a$10$PmXVMju.K0Uzu7xIW8iktuDvum.SMsirvTVVqRBv71IVpDgxfbmGm',
    isAdmin: true
  }
];

export default users;