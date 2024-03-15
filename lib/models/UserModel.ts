import mongoose, { WindowOperatorReturningNumber } from 'mongoose'

export type User = {
  _id: string
  name: string
  email: string
  altura: number
  peso: number
  isAdmin: boolean
}

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    altura: {
      type: Number,
      required: true,
    },
    peso: {
      type: Number,
      required: true,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema)

export default UserModel
