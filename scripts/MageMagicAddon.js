// import { MageConfig } from "./MageConfig";

export class MageMagicAddon {
  static ID = "swnr-space-magic";

  static FLAGS = {
    SPELLSLOTS: "spell-slot",
    ACTIVE_MAGIC_TAB: "active-magic-tab",
    MTA_MANA: "swnr-space-magic-mta-mana"
  };

  static TEMPLATES = {
    SPELLCASTING: `modules/${this.ID}/templates/spellcasting.hbs`,
    SPELLCASTFORM: `modules/${this.ID}/templates/spellcast-form.hbs`,
    CHATROLL: `modules/${this.ID}/templates/chat-roll.hbs`,
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
