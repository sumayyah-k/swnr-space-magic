import { MageMagicAddon } from "../MageMagicAddon.js";
import Spell from "../Models/Spell.js";
import Arcanum from "../Models/Arcanum.js";

export default class MageItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      tabs: [
        {
          navSelector: ".mta-power-tab-nav",
          contentSelector: ".mta-power-tab-content",
          initial: "general", // "addons", "active"
        },
      ],
    });
  }

  get template() {
    return MageMagicAddon.TEMPLATES.ITEMSHEET;
  }

  async getData(options) {
    const context = super.getData();
    const arcanum = new Arcanum(this.actor);
    const reachArcanaOpts = arcanum.getAll(true);

    var activeInfo = this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.SPELL_ACTIVE_INFO
    );

    var reachInfo = this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.MTA_SPELL_REACH
    );


    if (reachInfo) {
      reachInfo.map(r => {
        if (
          r.variant == "addon" &&
          r.prereq.key != 'any' &&
          arcanum.names.indexOf(r.prereq.key) != -1
        ) {
          var prereqArcanum = reachArcanaOpts.find(a => a.name == r.prereq.key);
          r.prereq.key = prereqArcanum.id;
        }
        return r;
      });
    }

    if (activeInfo) {
      activeInfo = {
        ...activeInfo,
        ...{
          practiceData: Spell.practices.find(
            (p) => p.id == activeInfo.practice
          ),
          durationData: Spell.spellDurations.find(
            (p) => p.id == activeInfo.factors.duration
          ),
          rangeData: Spell.ranges.find((p) => p.id == activeInfo.factors.range),
          scaleData: Spell.scales.find((p) => p.id == activeInfo.factors.scale),
          reachData: reachInfo.filter((r, i) => activeInfo['spell-reach'].indexOf(i) != -1),
        },
      };
    }


    var isMtAwSpell = false;
    if (this.object.type == 'power') {
      const powerType = this.object.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ITEM_POWER_TYPE
      );
      if (powerType && ["mageSpell", "mageActiveSpell"].indexOf(powerType) != -1) {
        isMtAwSpell = true;
      }
    }

    return {
      ...context,
      ...{
        powerTypeOptions: [
          { value: "spell", label: "SWN Spell" },
          { value: "mageSpell", label: "MtAw Spell" },
          { value: "mageActiveSpell", label: "MtAw Active Spell" },
          { value: "attainment", label: "Attainment" },
        ],
        focusTypeOptions: [{ value: "altForm", label: "Alternate Form" }],
        focusCasterTypeOptions: [
          { value: "arcanist", label: "Arcanist" },
          { value: "magister", label: "Magister" },
          { value: "mage", label: "Mage (CoD)" },
        ],
        arcana: arcanum.names,
        reachArcanaOpts,
        practices: Spell.rankedPractices(null, true),
        activeInfo,
        isMtAwSpell,
        diceSizes: Spell.diceSizes,
      },
    };
  }

  _addReach(data) {
    var reach = this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.MTA_SPELL_REACH
    );
    if (!reach) {
      reach = [];
    }

    reach.push({
      desc: "",
      variant: data.variant || "reach",
      reachCost: 0,
      prereq: {
        type: "arcanum",
        key: null,
        dots: null,
      },
    });

    return this.object.setFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.MTA_SPELL_REACH,
      reach
    );
  }

  _removeReach(data) {
    var reach = this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.MTA_SPELL_REACH
    );
    console.log("swnr-mage", "remove reach", reach, data);
    if (data.index >= 0) {
      reach.splice(parseInt(data.index, 10), 1);
    }
    // console.log('swnr-mage', 'remove reach', reach);

    return this.object.setFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.MTA_SPELL_REACH,
      reach
    );
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
      var reach = this.object.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.MTA_SPELL_REACH
      );
      console.log("swnr-mage", "change reach", reach, event.target.dataset);
      var index = event.target.dataset.index;
      var field = event.target.dataset.field;
      var subfield = event.target.dataset.subfield;
      var value = event.target.value;

      if (subfield) {
        reach[index][field][subfield] = value;
      } else {
        reach[index][field] = value;
      }

      this.object.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.MTA_SPELL_REACH,
        reach
      );

      console.log("swnr-mage", "reach change", event.target);
      this.render();
    });
  }
}