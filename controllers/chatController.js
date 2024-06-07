const Response = require('../helpers/response');
const Chat = require('../models/Chat');

// Controller function to create a new chat
const createChat = async (req, res) => {
    try {
        const { participants, messages } = req.body;
        const chat = new Chat({ participants, messages });
        await chat.save();
        return  res.status(200).json(Response({statusCode:200,status:"ok",message:"chate is create    "}))
    } catch (error) {
        res.status(500).json(Response({status:"faield",message:error.message,statusCode:500}))
    }
};

// Controller function to retrieve all chats
const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to retrieve a specific chat by ID
const getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to update a chat by ID
const updateChat = async (req, res) => {
    try {
        const { participants, messages, attachments } = req.body;
        const chat = await Chat.findByIdAndUpdate(req.params.id, { participants, messages, attachments }, { new: true });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to delete a chat by ID
const deleteChat = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports={
    createChat
}