import bcrypt from 'bcryptjs'

const data = {
  users: [
    {
      name: 'matias',
      email: 'xxytadeo@gmail.com',
      password: bcrypt.hashSync('fidel490'),
      altura: '1.80',
      peso: '70',
      isAdmin: true,
    },
  ],
  products: [
  ],
}

export default data
