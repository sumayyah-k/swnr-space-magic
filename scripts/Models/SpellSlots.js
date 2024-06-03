import { MageMagicAddon } from "../MageMagicAddon.js";
import { isArcanist, isMagister } from "../utils.js";
/**
 * Single Spell Slot Type Definition
 *
 * @typedef {Object} SpellSlot
 * @property {String}   id        Unique identifyer for slot
 * @property {String}   class     The character class the slot is for, Arcanist, Pacter, etc. comes in to play if character has partial classes
 * @property {Integer}  level     The Spell Slots level, 1-5
 * @property {String}   spell     (Arcanist Only) spell that's in the slot
 * @property {Boolean}  isUsed    Whether a slot is available to be cast on
 * @property {String}   actorId   The actor that owns this spell slot
*/

export default class SpellSlots {
  /**
   * Gets an actor's spell slots
   * @param {String} actorId The id of the actor who's slots to return
   * @returns {Object} An object containing all of the slots keyed by id
   */
  static async getForActor(actor) {
    if (typeof actor == "string") {
      actor = await game.actors.get(actor);
    }
    if (actor) {
      var existing = await actor?.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.SPELLSLOTS
      );

      if (!existing) {
        return this.fillSpellSlots(actor);
      }

      return existing;
    }
    return {};
  }

  static async getActorCasterClass(actor) {
    var chClass; // = actor?.system.class;
    if (await isArcanist(actor)) {
      chClass = "arcanist";
    }
    if (await isMagister(actor)) {
      chClass = "magister";
    }
    return chClass;
  }

  /**
   *
   * @param {string} actorId - id of the actor to add this spell slot to
   * @param {Partial<SpellSlot>} slotData - the SpellSlot data to use
   */
  static createSpellSlot(actorId, slotData) {
    // generate a random id for this new ToDo and populate the userId
    const newSpellSlot = {
      id: foundry.utils.randomID(16),
      class: null,
      level: 1,
      spell: null,
      isUsed: false,
      actorId,
      ...slotData,
    };

    // construct the update to insert the new ToDo
    const newSpellSlots = {
      [newSpellSlot.id]: newSpellSlot,
    };

    // update the database with the new ToDos
    return game.actors
      .get(actorId)
      ?.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.SPELLSLOTS,
        newSpellSlots
      );
  }

  /**
   *  sets all of an actors spell slots' isUsed property to false. Creates any missing spell slots up to their max.
   *
   * @param {String} actorId  The Id of the actor that is being modified
   * @param {Object} existing An existing object containing an actor's spell slots
   * @returns
   */
  static async fillSpellSlots(actor, existing) {
    if (actor) {
      var maxSpellSlots = this.getMaxSpellSlots(actor);

      // Existing was not passed in as a param, so grab it from the flags
      if (!existing) {
        existing = await actor.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.SPELLSLOTS
        );
      }

      // Still can't find existing, so create all new spell slots
      if (!existing) {
        for (var className in maxSpellSlots) {
          for (var lvl in maxSpellSlots[className]) {
            for (var i = 0; i < maxSpellSlots[className][lvl]; i++) {
              await this.createSpellSlot(actor.id, {
                class: className,
                level: lvl,
              });
            }
          }
        }

        // Gets existing once all of them are created
        existing = await actor.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.SPELLSLOTS
        );
      }

      if (existing) {
        //make the number of slots match what it should be (max)
        for (var className in maxSpellSlots) {
          for (var lvl in maxSpellSlots[className]) {
            var existingForLevel = Object.values(existing).filter(
              (s) => s.level == lvl
            );
            console.log("swnr-mage", {
              existingForLevel,
              max: maxSpellSlots[className][lvl],
            });
            if (maxSpellSlots[className][lvl] > existingForLevel.length) {
              var numToCreate =
                maxSpellSlots[className][lvl] - existingForLevel.length;
              console.log(
                "swnr-mage",
                "fill - need to create " + numToCreate + " lvl " + lvl + " slots"
              );

              for (var i = 0; i < numToCreate; i++) {
                await this.createSpellSlot(actor.id, {
                  class: className,
                  level: lvl,
                });
              }
            }

            if (maxSpellSlots[className][lvl] < existingForLevel.length) {
              var numToDetroy =
                existingForLevel.length - maxSpellSlots[className][lvl];
              console.log(
                "swnr-mage",
                "fill - need to remove " + numToDetroy + " lvl " + lvl + " slots"
              );
            }
          }
        }

        existing = Object.values(existing).reduce((acc, i) => {
          acc[i.id] = i;
          acc[i.id].isUsed = false;
          return acc;
        }, {});

        this.updateActorSlots(actor.id, existing);

        return existing;
      }
    }
    return {};
  }

  /**
   * Updates the given actors's spell slots with the provided updateData. This is
   * useful for updating a single actor's spell slots in bulk.
   *
   * @param {string} actorId - actor whose spell slots we are updating
   * @param {object} updateData - data passed to setFlag
   * @returns
   */
  static updateActorSlots(actorId, updateData) {
    return game.actors
      .get(actorId)
      ?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS, updateData);
  }

  /**
   * Gets the maximum spell slots for a character broken up by class
   *
   * Output Example:
   * {
   *  "Partial Arcanist": { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 },
   *  "Partial War Mage": { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0 },
   * }
   *
   * @param {Object} actor The Character
   * @returns {Object} Refer above
   */
  static getMaxSpellSlots(actor) {
    const magicClasses = actor.items.contents.filter(
      (i) =>
        i.type == "class" &&
        [
          "arcanist",
          "magister",
          "pacter",
          "rectifier",
          "war mage",
          "partial arcanist",
          "partial magister",
          "partial pacter",
          "partial rectifier",
          "partial war mage",
        ].indexOf(i.name.toLowerCase()) != -1
    );
    const level = actor.system.level.value;

    var response = {};
    if (magicClasses.length > 0) {
      for (var mClass of magicClasses) {
        var lev = level;
        if (
          [
            "partial arcanist",
            "partial magister",
            "partial pacter",
            "partial rectifier",
            "partial war mage",
          ].indexOf(mClass.name.toLowerCase()) != -1
        ) {
          lev = Math.ceil(lev / 2);
        }
        var table = {};
        if (
          ["arcanist", "partial arcanist"].indexOf(mClass.name.toLowerCase()) != -1
        ) {
          table = {
            1: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0 },
            2: { 1: 2, 2: 0, 3: 0, 4: 0, 5: 0 },
            3: { 1: 2, 2: 1, 3: 0, 4: 0, 5: 0 },
            4: { 1: 3, 2: 2, 3: 0, 4: 0, 5: 0 },
            5: { 1: 3, 2: 2, 3: 1, 4: 0, 5: 0 },
            6: { 1: 3, 2: 3, 3: 2, 4: 0, 5: 0 },
            7: { 1: 4, 2: 3, 3: 2, 4: 1, 5: 0 },
            8: { 1: 4, 2: 3, 3: 3, 4: 2, 5: 0 },
            9: { 1: 5, 2: 4, 3: 3, 4: 2, 5: 1 },
            10: { 1: 5, 2: 4, 3: 3, 4: 3, 5: 2 },
          };
          // return table[level];
        } else if (
          [
            "magister",
            "pacter",
            "rectifier",
            "war mage",
            "partial magister",
            "partial pacter",
            "partial rectifier",
            "partial war mage"
          ].indexOf(
            mClass.name.toLowerCase()
          ) != -1
        ) {
          table = {
            1: { 1: 3, 2: 0, 3: 0, 4: 0, 5: 0 },
            2: { 1: 4, 2: 0, 3: 0, 4: 0, 5: 0 },
            3: { 1: 5, 2: 2, 3: 0, 4: 0, 5: 0 },
            4: { 1: 6, 2: 3, 3: 0, 4: 0, 5: 0 },
            5: { 1: 6, 2: 3, 3: 2, 4: 0, 5: 0 },
            6: { 1: 6, 2: 4, 3: 3, 4: 0, 5: 0 },
            7: { 1: 6, 2: 4, 3: 3, 4: 2, 5: 0 },
            8: { 1: 6, 2: 5, 3: 4, 4: 3, 5: 0 },
            9: { 1: 6, 2: 5, 3: 4, 4: 3, 5: 2 },
            10: { 1: 6, 2: 6, 3: 5, 4: 4, 5: 3 },
          };
          // return table[level];
        }
        response[mClass.name] = table[lev];
      }
    }
    return response;
  }

  /**
   * Updates a given ToDo with the provided data.
   *
   * @param {string} toDoId - id of the ToDo to update
   * @param {Partial<ToDo>} updateData - changes to be persisted
   */
  static async updateSlot(actorId, slotId, updateData) {
    if (slotId) {
      const actor = game.actors.get(actorId);
      const allSlots = await this.getForActor(actor);
      const relevantSlot = allSlots[slotId];

      // construct the update to send
      const update = {
        [slotId]: { ...relevantSlot, ...updateData },
      };

      // update the database with the updated ToDo list
      return actor?.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.SPELLSLOTS,
        update
      );
    }
  }

  static async castByLevel(actorId, level) {
    const allSlots = await this.getForActor(actorId);
    const firstFreeSlot = Object.values(allSlots).find(
      (s) => s.level == level && s.isUsed == false
    );

    if (firstFreeSlot) {
      return this.updateSlot(actorId, firstFreeSlot.id, { isUsed: true });
    }
  }

  static async prepareByLevel(actorId, level, spellId) {
    const allSlots = await this.getForActor(actorId);
    const firstFreeSlot = Object.values(allSlots).find(
      (s) => s.level == level && !s.spell
    );

    if (firstFreeSlot) {
      return this.updateSlot(actorId, firstFreeSlot.id, { spell: spellId });
    }
  }
}