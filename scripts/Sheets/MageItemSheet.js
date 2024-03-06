import { MageMagicAddon } from "../MageMagicAddon.js";
import Spell from "../Models/Spell.js";
import Arcanum from "../Models/Arcanum.js";

export default class MageItemSheet extends ItemSheet{
  get template(){
    return MageMagicAddon.TEMPLATES.ITEMSHEET;
  }

  async getData(options) {
    const context = super.getData();
    const arcanum = new Arcanum(null);
    return {...context, ...{
      arcana: arcanum.names,
      practices: Spell.rankedPractices(null, true),
    }}

  }
}