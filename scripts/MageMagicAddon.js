// import { MageConfig } from "./MageConfig";

export class MageMagicAddon {
  static ID = "swnr-space-magic";

  static FLAGS = {
    //Actors
    SPELLSLOTS: "spell-slot",
    ACTIVE_MAGIC_TAB: "active-magic-tab",
    MTA_MANA: "swnr-space-magic-mta-mana",
    MTA_ARCANA_IMPORTANCE: "arcana-importance",
    ACTOR_SHEET_THEME: "sheet-theme",
    ACTOR_SPELL_FILTER_ARCANUM: "spell-filter-arcanum",
    ACTOR_SCENE_PARADOX: "scene-paradox",
    ACTOR_MORALITY: "morality",
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
    SPELL_MANA_COST: "mana-cost",
    SPELL_DMG_DICE: "damage-dice",
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
    ROLLCOD: `modules/${this.ID}/templates/dialogs/roll-cod.hbs`,
    ROLLCOD_CHAT: `modules/${this.ID}/templates/chat/roll-cod.hbs`,
    ROLLSWNR: `modules/${this.ID}/templates/dialogs/roll-swnr.hbs`,
    ROLLSWNR_CHAT: `modules/${this.ID}/templates/chat/roll-swnr.hbs`,
    ROLLWISDOM: `modules/${this.ID}/templates/dialogs/roll-wisdom.hbs`,
    ROLLWISDOM_CHAT: `modules/${this.ID}/templates/chat/roll-wisdom.hbs`,
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
