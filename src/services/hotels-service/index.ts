import { invalidDataError, notFoundError, unauthorizedError, forbiddenError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel } from "@prisma/client";

async function viewHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw forbiddenError();
  } else if (ticket.status === "RESERVED") {
    throw invalidDataError(["Ticket payment not found"]);
  }

  const hotels = await hotelsRepository.findHotels();

  return hotels;
}

async function viewRooms(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw unauthorizedError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw forbiddenError();
  } else if (ticket.status === "RESERVED") {
    throw invalidDataError(["Ticket payment not found"]);
  }

  const rooms = await hotelsRepository.findRooms(hotelId);

  return rooms;
}

const ticketService = {
  viewHotels,
  viewRooms
};

export default ticketService;
