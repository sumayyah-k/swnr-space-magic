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

  _addReach(data) {
    var reach = this.object.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_SPELL_REACH)
    if (!reach) {
      reach = [];
    }

    reach.push({
      desc: '',
      variant: data.variant || 'reach',
      reachCost: 0,
      prereq: {
        type: 'arcanum',
        key: null,
        dots: null,
      }
    });

    return this.object.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_SPELL_REACH, reach);
  }

  _removeReach(data) {
    var reach = this.object.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_SPELL_REACH)
    console.log('swnr-mage', 'remove reach', reach, data);
    if (data.index >= 0) {
      reach.splice(parseInt(data.index, 10), 1);
    }
    // console.log('swnr-mage', 'remove reach', reach);

    return this.object.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_SPELL_REACH, reach);
  }

  async _handleButtonClick(event, html) {
    const clickedElement = $(event.currentTarget);
    const action = clickedElement.data().action;
    const data = clickedElement.data();

    switch (action) {
      case "add-reach": {
        await this._addReach(data);

        this.render();
        break;
      }
      case "remove-reach": {
        await this._removeReach(data);

        this.render();
        break;
      }
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", "[data-action]", (event) => {
      this._handleButtonClick(event, html);
    });

    html.on("change", ".swnr-space-magic-reach-field", (event) => {
      var reach = this.object.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_SPELL_REACH);
      console.log('swnr-mage', 'change reach', reach, event.target.dataset)
      var index = event.target.dataset.index;
      var field = event.target.dataset.field;
      var subfield = event.target.dataset.subfield;
      var value = event.target.value;

      if (subfield) {
        reach[index][field][subfield] = value;
      } else {
        reach[index][field] = value;
      }

      this.object.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_SPELL_REACH, reach);

      console.log('swnr-mage', 'reach change', event.target);
      this.render();
    });
  }
}