import Service from "../models/service.model.js";
import {
  ApiError,
  ApiResponse,
  asyncHandler
} from "../utils/index.js";

import {ErrorTypes} from '../constants/constants.js'

export const createService = asyncHandler(async (req) => {

  const {
    Title,
    Description,
    Icon
  } = req.body;

  const service =
    await Service.create({
      ProfileUniqueCode: req.profileCode,
      Title,
      Description,
      Icon
    });

  return new ApiResponse(
    201,
    service,
    "Service created successfully"
  );
});

export const updateService = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const service =
    await Service.findOne({
      UniqueCode: uniqueCode,
      ProfileUniqueCode: req.profileCode
    });

  if (!service) {
    throw new ApiError(
      404,
      "Service not found or unauthorized to update this service",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  Object.assign(
    service,
    req.body
  );

  await service.save();

  return new ApiResponse(
    200,
    service,
    "Service updated successfully"
  );
});

export const deleteService = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const service = await Service.findOneAndDelete({
      UniqueCode: service.ProfileUniqueCode,
      ProfileUniqueCode: req.profileCode
  });

  if (!service) {
    throw new ApiError(
      404,
      "Service not found or unauthorized to delete this service",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    null,
    "Service deleted successfully"
  );
});

export const getServiceByCode = asyncHandler(async (req) => {

  const { uniqueCode } = req.params;

  const service =
    await Service.findOne({
      UniqueCode: uniqueCode,
      ProfileUniqueCode: req.profileCode
    });

  if (!service) {
    throw new ApiError(
      404,
      "Service not found or unauthorized to view this service",
      ErrorTypes.UNAUTHORIZED_OR_NOT_FOUND
    );
  }

  return new ApiResponse(
    200,
    service
  );
});

export const getServicesByProfile = asyncHandler(async (req) => {

  const services = await Service.find({ProfileUniqueCode: req.profileCode});

  return new ApiResponse(
    200,
    services
  );
});