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
    MTA_SPELL_IS_ROTE: "is-rote",
    MTA_SPELL_IS_PRAXIS: "is-praxis",
    MTA_SPELL_REACH: "reach",
    SPELL_ACTIVE_INFO: "active-info",
    SPELL_RELINQUISHED: "relinquished",
    //Items
    ITEM_POWER_TYPE: "power-type",
    MTA_SPELL_IS_YANTRA: "is-yantra",
    MTA_SPELL_YANTRA_BONUS: "yantra-bonus",
  };

  static TEMPLATES = {
    SPELLCASTING: `modules/${this.ID}/templates/spellcasting.hbs`,
    SPELLCASTFORM: `modules/${this.ID}/templates/spellcast-form.hbs`,
    CHATROLL: `modules/${this.ID}/templates/chat/chat-roll.hbs`,
    ITEMSHEET: `modules/${this.ID}/templates/sheets/item.hbs`,
    ACTORSHEET: `modules/${this.ID}/templates/sheets/actor.hbs`,
    YANTRASHEET: `modules/${this.ID}/templates/sheets/yantra.hbs`,
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
