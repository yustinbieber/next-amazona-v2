import mongoose from 'mongoose'

export type User = {
  _id: string
  name: string
  email: string
  altura: string
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
      type: String,
      required: true,
    },
    peso: {
      type: String,
      required: true,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema)

export default UserModel
