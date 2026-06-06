import Service from "../models/service.model.js";
import Portfolio from "../models/portfolio.model.js";

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
      PortfolioUniqueCode: req.portfolioCode,
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
      PortfolioUniqueCode: req.portfolioCode
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
      UniqueCode: service.PortfolioUniqueCode,
      PortfolioUniqueCode: req.portfolioCode
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
      PortfolioUniqueCode: req.portfolioCode
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

export const getServicesByPortfolio = asyncHandler(async (req) => {

  const services = await Service.find({PortfolioUniqueCode: req.portfolioCode});

  return new ApiResponse(
    200,
    services
  );
});