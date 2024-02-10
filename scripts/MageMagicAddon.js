// import { MageConfig } from "./MageConfig";

export class MageMagicAddon {
  static ID = "mage_magic_addon";

  static FLAGS = {
    TODOS: "mage",
    SPELLSLOTS: "spell-slot"
  };

  static TEMPLATES = {
    SPELLCASTING: `modules/${this.ID}/templates/spellcasting.html`,
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
