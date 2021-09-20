const {
    insertTicket,
    getTickets,
    getTicketById,
    updateClientReply,
    updateStatusClose,
    deleteTicket,
  } = require("../model/ticket/Ticket.model");

  const createNewTicket = async (req, res) => {
    try {
      const { subject, sender, message } = req.body;

      const userId = req.userId;
      const msgsender= req.sender;

      const ticketObj = {
        clientId: userId,
        subject,
        conversations: [
          {
            sender: msgsender,
            message,
          },
        ],
      };

      const result = await insertTicket(ticketObj);

      if (result._id) {
        return res.json({
          status: "success",
          message: "New ticket has been created!",
        });
      }

      res.json({
        status: "error",
        message: "Unable to create the ticket , please try again later",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };


  const getAllTickets =async (req, res) => {
    try {
      const userId = req.userId;
      const result = await getTickets(userId);
  
      return res.json({
        status: "success",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
  
  
  const getUserTickets = async (req, res) => {
    try {
      const { _id } = req.params;
  
      const clientId = req.userId;
      const result = await getTicketById(_id, clientId);
  
      return res.json({
        status: "success",
        result,
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };
  

  const updateUserTicket = async (req, res) => {
    try {
      const { message, sender } = req.body;
      const { _id } = req.params;
      const clientId = req.userId;

      const result = await updateClientReply({ _id, message, sender });

      if (result._id) {
        return res.json({
          status: "success",
          message: "your message updated",
        });
      }
      res.json({
        status: "error",
        message: "Unable to update your message please try again later",
      });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  };

 
  const ticketStatusUpdate = async (req, res) => {
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
  };


  const deleteClientTicket = async (req, res) => {
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
  };


  module.exports = {
    createNewTicket,
    getAllTickets,
    getUserTickets,
    updateUserTicket,
    ticketStatusUpdate,
    deleteClientTicket
  }