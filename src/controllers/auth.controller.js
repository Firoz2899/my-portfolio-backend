import User from "#models/user.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler,
  generateOTP
} from "#utils/index.js";
import { ErrorTypes, HttpCookies } from "#constants/constants.js";
import ProfileModel from "#models/profile.model.js";


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

        user.RefreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export const signup = asyncHandler(async (req) => {

  const { FirstName, LastName, Email, Password, ProfileSlug } = req.body;

  const existingUser = await User.findOne({Email});

  if (existingUser) {
    throw new ApiError(
      400,
      "Email already exists",
      ErrorTypes.EMAIL_ALREADY_EXISTS
    );
  }

  const user = await User.create({
      FirstName,
      LastName,
      Email,
      Password
    });

  await user.save();

  await ProfileModel.create({
    UserUniqueCode: user.UniqueCode,
    Slug: ProfileSlug.trim(),
    FullName: `${FirstName} ${LastName}`,
    Email: Email
  });

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
      "User not found",
      ErrorTypes.USER_NOT_FOUND
    );
  }

  if (!user.isOtpCorrect(OTP)) {
    throw new ApiError(
      400,
      "Invalid or expired OTP",
      ErrorTypes.INVALID_CREDENTIALS
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

export const resendOtp = asyncHandler(async (req) => {

  const { Email } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(
      404,
      "User not found",
      ErrorTypes.USER_NOT_FOUND
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
      "Invalid credentials",
      ErrorTypes.INVALID_CREDENTIALS
    );
  }

  const isPasswordCorrect = await user.isPasswordCorrect(Password);

  if (!isPasswordCorrect) {
    throw new ApiError(
      400,
      "Invalid credentials",
      ErrorTypes.INVALID_CREDENTIALS
    );
  }

  if (!user.IsEmailVerified) {
    throw new ApiError(
      400,
      "Email not verified",
      ErrorTypes.EMAIL_NOT_VERIFIED
    );
  }

  // Generate tokens
    const tokens = await generateAccessAndRefereshTokens(user.UniqueCode);
  
    res
    .status(200)
    .cookie(HttpCookies.AccessToken, tokens.accessToken, cookieOptions)
    .cookie(HttpCookies.RefreshToken, tokens.refreshToken, cookieOptions)
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
      "User not found",
      ErrorTypes.USER_NOT_FOUND
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
      "User not found",
      ErrorTypes.USER_NOT_FOUND
    );
  }

  if (!user.isOtpCorrect(OTP)) {
    throw new ApiError(
      400,
      "Invalid OTP",
      ErrorTypes.INVALID_CREDENTIALS
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
        throw new ApiError(404, "User not found", ErrorTypes.USER_NOT_FOUND)
    }

    user.RefreshToken = null;
    await user.save({ validateBeforeSave: false });
    res
    .clearCookie(HttpCookies.AccessToken, cookieOptions)
    .clearCookie(HttpCookies.RefreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Logged out successfully"
      )
    );
})


export const getLoggedInUser = asyncHandler(async (req, res) => {
    const user = req.user;
    
    return new ApiResponse(200, { user }, "Logged in user retrieved successfully")
})



export const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.[HttpCookies.RefreshToken] || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Refresh token is required",
        ErrorTypes.REFRESH_TOKEN_INVALID_OR_EXPIRED
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
        "Invalid refresh token",
        ErrorTypes.REFRESH_TOKEN_INVALID_OR_EXPIRED
      );
    }

    const tokens = await generateAccessAndRefereshTokens(user.UniqueCode);

    res
    .status(200)
    .cookie(HttpCookies.AccessToken, tokens.accessToken, cookieOptions)
    .cookie(HttpCookies.RefreshToken, tokens.refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200, 
            tokens, 
            "Access token refreshed"
        )
    );
  }
);