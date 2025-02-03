import { User } from "../models/userModel.js"
import { ErrorHandler } from "../utils/errorHandler.js"

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.create({
      email,
      password,
    })

    const token = user.getJWTToken()

    res.status(201).json({
      success: true,
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401))
    }

    const token = user.getJWTToken()

    res.status(200).json({
      success: true,
      token,
    })
  } catch (error) {
    next(error)
  }
}

