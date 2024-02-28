import { MageMagicAddon } from "../MageMagicAddon.js";
import Gnosis from "./Gnosis.js";

export default class {

  constructor(actor) {
    this.actor = actor;

    this.gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis');

    this.gnosisInfo = Gnosis.byRank(this.gnosis.system.rank);
  }

  getCurrentValue() {
    return this.actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_MANA) || 0;
  }

  getMax() {
    console.log('swnr-mage',this.gnosis)
    return this.gnosisInfo.mana.max;
  }

  setCurrentValue(val) {
    if (val >= this.gnosisInfo.mana.max) {
      val = this.gnosisInfo.mana.max;
    } else if (val <= 0) {
      val = 0;
    }
    return this.actor.setFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.MTA_MANA,
      val
    );
  }

  async addRestMana() {
    var mana = await this.getCurrentValue();

    var newMana = mana + this.gnosisInfo.mana.perTurn;

    return this.setCurrentValue(newMana);
  }
}