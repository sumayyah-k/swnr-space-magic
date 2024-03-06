// import { MageConfig } from "./MageConfig";

export class MageMagicAddon {
  static ID = "swnr-space-magic";

  static FLAGS = {
    //Actors
    SPELLSLOTS: "spell-slot",
    ACTIVE_MAGIC_TAB: "active-magic-tab",
    MTA_MANA: "swnr-space-magic-mta-mana",
    MTA_ARCANA_IMPORTANCE: "arcana-importance",
    //Spells
    MTA_SPELL_ARCANUM: "arcanum",
    MTA_SPELL_PRACTICE: "practice",
    MTA_SPELL_PRIMARY_FACTOR: "primary-factor",
    MTA_SPELL_WITHSTAND: "withstand",
  };

  static TEMPLATES = {
    SPELLCASTING: `modules/${this.ID}/templates/spellcasting.hbs`,
    SPELLCASTFORM: `modules/${this.ID}/templates/spellcast-form.hbs`,
    CHATROLL: `modules/${this.ID}/templates/chat/chat-roll.hbs`,
    ITEMSHEET: `modules/${this.ID}/templates/sheets/item.hbs`,
    ACTORSHEET: `modules/${this.ID}/templates/sheets/actor.hbs`,
  };

  //   static initialize() {
  //     this.mageConfig = new MageConfig();
  //   }

  static log(force, ...args) {
    const shouldLog =
      force ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, "|", ...args);
    }
  }
}
