// import { MageConfig } from "./MageConfig";

export class MageMagicAddon {
  static ID = "swnr-space-magic";

  static FLAGS = {
    SPELLSLOTS: "spell-slot",
    ACTIVE_MAGIC_TAB: "active-magic-tab",
  };

  static TEMPLATES = {
    SPELLCASTING: `modules/${this.ID}/templates/spellcasting2.hbs`,
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
