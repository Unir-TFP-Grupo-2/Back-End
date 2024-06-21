const { 
    getFriendsAndCommonGroups,
    getUserByEmail,
    addFriend,
    removeFriend,
} = require('../models/amigo.model');

const getFriendsHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const friends = await getFriendsAndCommonGroups(userId);
    
    if (!friends || friends.length === 0) {
      return res.status(204).json({ message: "No hay amigos asociados a este usuario" });
    }

    res.status(200).json(friends);
  } catch (error) {
    console.error('Error al obtener amigos:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

const createAmigoHandler = async (req, res) => {
  try {
    const { userId, friendEmail } = req.body;
    console.log('Datos recibidos en el controlador:', { userId, friendEmail });

    if (!userId || !friendEmail) {
      console.log('Faltan datos:', { userId, friendEmail });
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const friend = await getUserByEmail(friendEmail);

    if (!friend) {
      console.log('Amigo no encontrado por email:', friendEmail);
      return res.status(404).json({ message: 'No se encontró un usuario con ese email' });
    }

    if (userId === friend.user_id) {
      console.log('Intento de auto-agregarse como amigo:', { userId, friendEmail });
      return res.status(400).json({ message: "No puedes agregarte a ti mismo como amigo" });
    }

    const result = await addFriend(userId, friend.user_id);
    res.status(201).json({ message: "Amigo agregado correctamente", friendId: result.friendId });
  } catch (error) {
    console.error('Error añadiendo amigo:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteAmigoHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;

    if (!userId || !friendId) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const result = await removeFriend(userId, friendId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Amigo no encontrado" });
    }

    res.status(200).json({ message: "Amigo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};;


module.exports = {
  getFriendsHandler,
  createAmigoHandler,
  deleteAmigoHandler
};