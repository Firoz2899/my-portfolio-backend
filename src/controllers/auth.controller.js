import User from "../models/user.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "../utils/index.js";

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefereshTokens = async (uniqueCode) => {
    try {
        const user = await User.findOne({ UniqueCode: uniqueCode })
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, ErrorTypes.Unknown_Error, "Something went wrong while generating referesh and access token")
    }
}

export const signup = asyncHandler(async (req) => {

  const { Name, Email, Password } = req.body;

  const existingUser = await User.findOne({Email});

  if (existingUser) {
    throw new ApiError(
      400,
      "Email already exists"
    );
  }

  const user = await User.create({
      Name,
      Email,
      Password
    });

  await user.save();

  // send email otp here

  return new ApiResponse(
    201,
    {
      UserCode: user.UniqueCode
    },
    "OTP sent successfully"
  );
});

export const verifyEmail = asyncHandler(async (req) => {

  const { Email, OTP } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  if (!user.isOtpCorrect(OTP)) {
    throw new ApiError(
      400,
      "Invalid or expired OTP"
    );
  }

  user.IsEmailVerified = true;

  user.EmailOTP = null;

  user.EmailOTPExpiry = null;

  await user.save();

  return new ApiResponse(
    200,
    null,
    "Email verified successfully"
  );
});

import {
  generateOTP
} from "../utils/index.js";

export const resendOtp = asyncHandler(async (req) => {

  const { Email } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  user.EmailOTP = generateOTP();
  user.EmailOTPExpiry = new Date( Date.now() + 10 * 60 * 1000);
  await user.save();

  // send email

  return new ApiResponse(
    200,
    null,
    "OTP sent successfully"
  );
});

export const login = asyncHandler(async (req, res) => {

  const { Email, Password } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(
      400,
      "Invalid credentials"
    );
  }

  const isPasswordCorrect = await user.isPasswordCorrect(Password);

  if (!isPasswordCorrect) {
    throw new ApiError(
      400,
      "Invalid credentials"
    );
  }

  if (!user.IsEmailVerified) {
    throw new ApiError(
      400,
      "Email not verified"
    );
  }

  // Generate tokens
    const tokens = await generateAccessAndRefereshTokens(user.UniqueCode);
  
    res
    .status(200)
    .cookie("accessToken", tokens.accessToken, cookieOptions)
    .cookie("refreshToken", tokens.refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200, 
            {
                tokens,
                user: {
                    Name: user.Name,
                    Email: user.Email,
                    Role: user.Role,
                    UniqueCode: user.UniqueCode
                }
            }, 
            "Login successful"
        )
    );
});

export const forgotPassword = asyncHandler(async (req) => {

  const { Email } = req.body;

  const user = await User.findOne({Email});

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  user.EmailOTP = generateOTP();

  user.EmailOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  // send otp

  return new ApiResponse(
    200,
    null,
    "Password reset OTP sent"
  );
});

export const resetPassword = asyncHandler(async (req) => {

  const { Email, OTP, Password } = req.body;

  const user = await User.findOne({Email});

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  if (!user.isOtpCorrect(OTP)) {
    throw new ApiError(
      400,
      "Invalid OTP"
    );
  }

  user.Password = Password;
  user.EmailOTP = null;
  user.EmailOTPExpiry = null;

  await user.save();

  return new ApiResponse(
    200,
    null,
    "Password updated successfully"
  );
});

export const logout = asyncHandler(async (req, res) => {
    const user = await User.findOne({ UniqueCode: req.user.UniqueCode });

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    return new ApiResponse(200, null, "Logged out successfully")
})


export const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = req.user;
    
    return new ApiResponse(200, { user }, "Logged in user retrieved successfully")
})



export const refreshAccessToken = asyncHandler(async (req) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Refresh token is required"
      );
    }

    const decoded =
      jwt.verify(
        incomingRefreshToken,
        config.refreshTokenSecret
      );

    const user = await User.findOne({ UniqueCode: decoded.UniqueCode });

    if (!user) {
      throw new ApiError(
        401,
        "Invalid refresh token"
      );
    }

    const tokens = await generateAccessAndRefereshTokens(user.UniqueCode);

    return new ApiResponse(
      200,
      tokens,
      "Access token refreshed"
    );
  }
);