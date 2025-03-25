// controllers/authController.js
import { User } from "../models/userModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";


export const signup = async (req, res, next) => {
  try {
    const { email, password, typeofuser } = req.body;

    if (!email || !password || !typeofuser) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const user = await User.create({
      email,
      password,
      typeofuser,  // Store typeofuser in the DB
    });

    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      token,
      typeofuser: user.typeofuser,
    });
  } catch (error) {
    next(error);
  }
};




export const login = async (req, res, next) => {
  try {
    const { email, password, typeofuser } = req.body;

    if (!email || !password || !typeofuser) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if the user type matches
    if (user.typeofuser !== typeofuser) {
      return next(new ErrorHandler("User type mismatch", 401));
    }

    const token = user.getJWTToken();

    res.status(200).json({
      success: true,
      token,
      typeofuser: user.typeofuser,
    });
  } catch (error) {
    next(error);
  }
};

