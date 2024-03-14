import bcrypt from 'bcryptjs'

const data = {
  users: [
    {
      name: 'matias',
      email: 'xxytadeo@gmail.com',
      password: bcrypt.hashSync('fidel490'),
      isAdmin: true,
    },
  ],
  products: [
  ],
}

export default data
