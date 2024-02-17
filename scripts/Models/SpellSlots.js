import { MageMagicAddon } from "../MageMagicAddon.js";

export default class SpellSlots {
  static getForActor(ActorId) {
    if (ActorId) {
      var existing = game.actors
        .get(ActorId)
        ?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS);

      if (!existing) {
        return this.fillSpellSlots(ActorId);
      }
      return existing;
    }
    return {};
  }
  
  static useSpellSlot(ActorId, spellSlot) {
    if (ActorId) {
      var actor = game.actors.get(ActorId);
      var slots = actor.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.SPELLSLOTS,
      );
      MageMagicAddon.log(true, { slots, spellSlot});
      if (slots[spellSlot] > 0) {
        slots[spellSlot]--;
        MageMagicAddon.log(true, { slots: slots });
        actor.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS, slots);
      }
    }

    return false;
  }

  static fillSpellSlots(ActorId) {
    
    if (ActorId) {
      var actor = game.actors.get(ActorId);
      var chClass = actor?.system.class;
      var level = actor?.system.level;

      var spellSlots = this.getMaxSpellSlots(chClass, level.value);

      actor.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.SPELLSLOTS,
        spellSlots
      );

      return spellSlots;
    }
    return {};
  }

  static getMaxSpellSlots(chClass, level) {
    if (chClass.toLowerCase() == "arcanist") {
      const table = {
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
      return table[level];
    } else if (
      ["magister", "pacter", "rectifier", "war mage"].indexOf(
        chClass.toLowerCase()
      ) != -1
    ) {
      const table = {
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
      return table[level];
    }
    return {};
  }
}