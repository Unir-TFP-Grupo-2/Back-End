const {
  createGroup,
  getGroupById,
  getAllGroups,
  updateGroup,
  deleteGroup,
  getAllGroupsUser,
  getUserIdByEmail,
  addGroupMember,
} = require("../models/grupo.model");



const createGroupHandler = async (req, res) => {
  try {
    console.log("Contenido completo de req.body:", JSON.stringify(req.body, null, 2));

    const group = await createGroup(req.body);
    if (!group?.insertId) {
      throw new Error('Error creando el grupo');
    }

    console.log("Grupo creado:", group);

    const { insertId: group_id } = group;
    const { percentage = null, participants = [] } = req.body;

    for (const email of participants) {
      console.log(`Buscando userId para el email: ${email}`);
      const userId = await getUserIdByEmail(email);
      if (!userId) {
        console.error(`No se encontró userId para el email: ${email}`);
        continue;
      }

      console.log('Parámetros para añadir miembro:', { group_id, userId, percentage });
      const addMemberResult = await addGroupMember(group_id, userId, percentage);

      if (!addMemberResult?.affectedRows) {
        throw new Error('Error añadiendo miembro al grupo');
      }

      console.log('Resultado de añadir miembro:', addMemberResult);
    }

    res.status(201).json({ group_id, message: "Grupo y miembro creados exitosamente" });
  } catch (error) {
    console.error("Error en createGroupHandler:", error);
    res.status(500).json({ error: error.message });
  }
};


const getGroupByIdHandler = async (req, res) => {
  try {
    const group = await getGroupById(req.params.id);
    if (group) {
      res.json(group);
    } else {
      res.status(404).json({ error: "Grupo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllGroupsHandler = async (req, res) => {

  try {
    const userId = req.userId;
    const groups = await getAllGroupsUser(userId);
    
     if(groups.length === 0){
      return res.status(204).json({message:"No hay grupos asociados a este usuario"})
    }

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGroupHandler = async (req, res) => {
  try {
    const group = await updateGroup(req.params.id, req.body);
    if (group.affectedRows > 0) {
      res.json({ message: "Grupo actualizado" });
    } else {
      res.status(404).json({ error: "Grupo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGroupHandler = async (req, res) => {
  try {
    const result = await deleteGroup(req.params.id);
    if (result.affectedRows > 0) {
      res.json({ message: "Grupo eliminado" });
    } else {
      res.status(404).json({ error: "Grupo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createGroupHandler,
  getGroupByIdHandler,
  getAllGroupsHandler,
  updateGroupHandler,
  deleteGroupHandler,
};
