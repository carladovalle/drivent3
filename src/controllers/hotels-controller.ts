import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotels = await hotelsService.viewHotels(userId);

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}

export async function getRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.query.hotelId);
  const { userId } = req;

  if (!hotelId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const rooms = await hotelsService.viewRooms(userId, hotelId);

    if (!rooms) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    } else if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
  }
}
