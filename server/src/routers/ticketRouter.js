const express = require("express");
const router = express.Router();
const { createNewTicket, getTickets, getUserTickets, updateUserTicket } = require("../controllers/ticketController");


const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");

const {
  createNewTicketValidation,
  replyTicketMessageValidation,
} = require("../middlewares/formValidation.middleware");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form ticket router" });

  next();
});

// create new ticket
router.post( "/", createNewTicketValidation, userAuthorization, createNewTicket);

// Get all tickets from customer
router.get("/", userAuthorization, getTickets)

// Get all tickets for a specific customer
router.get("/:_id", userAuthorization, getUserTickets);

// update reply message form client
router.put( "/:_id", replyTicketMessageValidation, userAuthorization, updateUserTicket);

// update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await updateStatusClose({ _id, clientId });

    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed",
      });
    }
    res.json({
      status: "error",
      message: "Unable to update the ticket",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

// Delete a ticket
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await deleteTicket({ _id, clientId });

    return res.json({
      status: "success",
      message: "The ticket has been deleted",
    });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

module.exports = router;
