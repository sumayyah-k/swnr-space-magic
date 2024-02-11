import { MageMagicAddon } from "../MageMagicAddon";

export class SpellSlots {
  static getForActor(ActorId) {
    var existing = game.actors
      .get(ActorId)
      ?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS);

    if (!existing) {
      return this.fillSpellSlots(ActorID);
    }
    return existing;
  }

  static fillSpellSlots(ActorID) {
    var actor = game.actors.get(ActorId);
    var chClass = actor?.system.class;
    var level = actor?.system.level;

    var max = this.getMaxSpellSlots(chClass, level);

    var spellSlots = max.map(l => {
      return {current: l, max: l};
    });
    actor.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS, spellSlots);
    return spellSlots;
  }

  static getMaxSpellSlots(chClass, level) {
    if (chClass.toLowerCase() == "arcanist") {
      const table = {
        1: {1:1,2:0,3:0,4:0,5:0},
        2: {1:2,2:0,3:0,4:0,5:0},
        3: {1:2,2:1,3:0,4:0,5:0},
        4: {1:3,2:2,3:0,4:0,5:0},
        5: {1:3,2:2,3:1,4:0,5:0},
        6: {1:3,2:3,3:2,4:0,5:0},
        7: {1:4,2:3,3:2,4:1,5:0},
        8: {1:4,2:3,3:3,4:2,5:0},
        9: {1:5,2:4,3:3,4:2,5:1},
        10: {1:5,2:4,3:3,4:3,5:2}
      }
      return table[level];
    } else if (['magister', 'pacter', 'rectifier', 'war mage'].indexOf(chClass.toLowerCase()) != -1) {
      const table = {
        1: {1:3,2:0,3:0,4:0,5:0},
        2: {1:4,2:0,3:0,4:0,5:0},
        3: {1:5,2:2,3:0,4:0,5:0},
        4: {1:6,2:3,3:0,4:0,5:0},
        5: {1:6,2:3,3:2,4:0,5:0},
        6: {1:6,2:4,3:3,4:0,5:0},
        7: {1:6,2:4,3:3,4:2,5:0},
        8: {1:6,2:5,3:4,4:3,5:0},
        9: {1:6,2:5,3:4,4:3,5:2},
        10: {1:6,2:6,3:5,4:4,5:3}
      }
      return table[level];
    }
    return {}
  }

  static use(slotId) {}

  static setSpell(slotId, updateDate) {}

  static markAllAsUnused() {}

  static createToDo(actorID, toDoData) {
    const newSpellSlot = {
      isUsed: false,
      ...toDoData,
      id: foundry.utils.randomID(16),
      actorID,
    }

    // construct the update to insert the new ToDo
    const newSpellSlots = {
      [newSpellSlot.id]: newSpellSlot
    }

    // update the database with the new ToDos
    return game.actors.get(actorID)?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS, newSpellSlots);
  }
}