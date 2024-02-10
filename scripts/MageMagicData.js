import { MageMagicAddon } from "./MageMagicAddon";

/**
 * The data layer for our todo-list module
 */
export class MageMagicData {
  /**
   * get all toDos for all users indexed by the todo's id
   */
  static get allToDos() {
    const allToDos = game.users.reduce((accumulator, user) => {
      const userTodos = this.getToDosForUser(user.id);

      return {
        ...accumulator,
        ...userTodos,
      };
    }, {});

    return allToDos;
  }

  /**
   * Gets all of a given user's ToDos
   *
   * @param {string} userId - id of the user whose ToDos to return
   * @returns {Record<string, ToDo> | undefined}
   */
  static getToDosForUser(userId) {
    return game.users.get(userId)?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.TODOS);
  }

  /**
   *
   * @param {string} userId - id of the user to add this ToDo to
   * @param {Partial<ToDo>} toDoData - the ToDo data to use
   */
  static createToDo(userId, toDoData) {
    // generate a random id for this new ToDo and populate the userId
    const newToDo = {
      isDone: false,
      label: "",
      ...toDoData,
      id: foundry.utils.randomID(16),
      userId,
    };

    // construct the update to insert the new ToDo
    const newToDos = {
      [newToDo.id]: newToDo,
    };

    // update the database with the new ToDos
    return game.users
      .get(userId)
      ?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.TODOS, newToDos);
  }

  /**
   * Updates a given ToDo with the provided data.
   *
   * @param {string} toDoId - id of the ToDo to update
   * @param {Partial<ToDo>} updateData - changes to be persisted
   */
  static updateToDo(toDoId, updateData) {
    const relevantToDo = this.allToDos[toDoId];

    // construct the update to send
    const update = {
      [toDoId]: updateData,
    };

    // update the database with the updated ToDo list
    return game.users
      .get(relevantToDo.userId)
      ?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.TODOS, update);
  }

  /**
   * Deletes a given ToDo
   *
   * @param {string} toDoId - id of the ToDo to delete
   */
  static deleteToDo(toDoId) {
    const relevantToDo = this.allToDos[toDoId];

    // Foundry specific syntax required to delete a key from a persisted object in the database
    const keyDeletion = {
      [`-=${toDoId}`]: null,
    };

    // update the database with the updated ToDo list
    return game.users
      .get(relevantToDo.userId)
      ?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.TODOS, keyDeletion);
  }

  /**
   * Updates the given user's ToDos with the provided updateData. This is
   * useful for updating a single user's ToDos in bulk.
   *
   * @param {string} userId - user whose todos we are updating
   * @param {object} updateData - data passed to setFlag
   * @returns
   */
  static updateUserToDos(userId, updateData) {
    return game.users
      .get(userId)
      ?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.TODOS, updateData);
  }
}
