const express = require("express");
const router = express.Router();
const { createNewTicket, 
        getAllTickets,   
        getUserTickets, 
        updateUserTicket, 
        ticketStatusUpdate, 
        deleteClientTicket } = require("../controllers/ticketController");


const { userAuthorization } = require("../middlewares/authorization.middleware");

const { createNewTicketValidation, replyTicketMessageValidation } = require("../middlewares/formValidation.middleware");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form ticket router" });

  next();
});

// create new ticket
router.post( "/", createNewTicketValidation, userAuthorization, createNewTicket);

// Get all tickets from client
router.get("/", userAuthorization,  getAllTickets)

// Get all tickets for a specific client
router.get("/:_id", userAuthorization, getUserTickets);

// update reply message form client
router.put( "/:_id", replyTicketMessageValidation, userAuthorization, updateUserTicket);

// update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, ticketStatusUpdate );

// Delete a ticket
router.delete("/:_id", userAuthorization, deleteClientTicket);

module.exports = router;
