import { MageMagicAddon } from "../MageMagicAddon";

export class SpellSlot {
  static getAll() {}

  static getForActor(ActorId) {
        return game.users
          .get(userId)
          ?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.SPELLSLOTS);

  }

  static use(slotId) {}

  static setSpell(slotId, updateDate) {}

  static markAllAsUnused() {}
}