import { MageMagicAddon } from "../MageMagicAddon.js";
import Gnosis from "./Gnosis.js";

export default class {

  constructor(actor) {
    this.actor = actor;

    this.gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis');

    this.gnosisInfo = Gnosis.byRank(this.gnosis ? this.gnosis.system.rank : -1);
  }

  getCurrentValue() {
    return this.actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_MANA) || 0;
  }

  getMax() {
    if (this.gnosisInfo) {
      return this.gnosisInfo.mana.max;
    }
    return 0;
  }

  decrement() {
    var current = this.getCurrentValue();
    return this.setCurrentValue(current -1);
  }

  setCurrentValue(val) {
    if (this.gnosisInfo && val >= this.gnosisInfo.mana.max) {
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
    var newMana = mana;
    if (this.gnosisInfo) {
      newMana+= this.gnosisInfo.mana.perTurn;
    }

    return this.setCurrentValue(newMana);
  }
}