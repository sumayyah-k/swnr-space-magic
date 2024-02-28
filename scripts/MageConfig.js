import { MageMagicAddon } from "./MageMagicAddon.js";
import { filterSkillsBySystem, isMtAMage, isArcanist, isMagister, isSwNMage } from "./utils.js";
import SpellSlots from './Models/SpellSlots.js';
import Mana from "./Models/Mana.js";
import {SpellcastConfig} from "./SpellcastConfig.js";

export class MageConfig extends FormApplication {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    var tokens = null;
    var token = null;
    var actorId = null;

    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
      actorId = token.document.actor.id;
    }

    const overrides = {
      height: 600,
      width:850,
      id: "mage-magic",
      template: MageMagicAddon.TEMPLATES.SPELLCASTING,
      title: "Grimoire",
      actorId: actorId,
      popOut: true,
      resizable: true,
      minimizable: true,
      closeOnSubmit: false,
      submitOnChange: true,
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  bind(html) {
    MageMagicAddon.log(true, { html });
  }

  async getData(options) {
    var tokens = null;
    var token = null;
    var magicSkills = [];
    var spells = [];
    var spellsById = {};
    var actorId = null;
    var actor = {};

    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
      actorId = token.document.actor.id;
      actor = game.actors.get(actorId);
      magicSkills = actor.items.contents.filter((i) =>
        filterSkillsBySystem(token, i)
      );

      magicSkills = magicSkills.map((i) => {
        return {
          name: i.name,
          rank: i.system.rank,
          actor: actorId,
        };
      });

      spells = actor.items.contents
        .filter((i) => i.type == "power")
        .reduce((acc, i) => {
          if (!acc.hasOwnProperty(i.system.level)) {
            acc[i.system.level] = [];
          }
          acc[i.system.level.toString()].push(i);
          acc[i.system.level.toString()].sort((a, b) => b.sort - a.sort);
          return acc;
        }, {});

      spellsById = actor.items.contents
        .filter((i) => i.type == "power")
        .reduce((acc, i) => {
          acc[i.id] = i;
          return acc;
        }, {});
    }

    const spellSlots = await SpellSlots.getForActor(actorId);

    var numSpellSlots = Object.values(spellSlots).reduce((acc, i) => {
      var chClass = i.class.toLowerCase().trim();
      var level = parseInt(i.level, 10);

      if (!acc[chClass]) {
        acc[chClass] = {};
      }
      if (!acc[chClass][level]) {
        const maxSpellSlots = SpellSlots.getMaxSpellSlots(
          chClass,
          actor.system.level.value
        );

        acc[chClass][level] = { available: 0, max: maxSpellSlots[i.level] };
      }

      if (i.isUsed == false) {
        acc[chClass][level].available++;
      }

      return acc;
    }, {});

    var spellSlotsByLevel = Object.values(spellSlots).reduce((acc, i) => {
      var chClass = i.class.toLowerCase().trim();
      var level = parseInt(i.level, 10);

      if (!acc[chClass]) {
        acc[chClass] = {};
      }
      if (!acc[chClass][level]) {
        acc[chClass][level] = [];
      }

      acc[chClass][level].push(i);

      return acc;
    }, {});

    const activeMagicTab = game.actors
      .get(actorId)
      ?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTIVE_MAGIC_TAB);

    const mtAMage = isMtAMage(actor);

    const strain = actor.system.systemStrain;
    var mageInfo = {};
    if (mtAMage) {
      mageInfo.gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis')
      var mana = new Mana(actor);

      mageInfo.mana = {
        current: mana.getCurrentValue(),
        max: mana.getMax(),
      };
    }
    return {
      token,
      actor: actorId,
      magicSkills,
      numSpellSlots,
      spellSlotsByLevel,
      spells,
      spellsById,
      isArcanist: isArcanist(actor),
      isMagister: isMagister(actor),
      isSwNMage: isSwNMage(actor),
      mtAMage,
      activeMagicTab: activeMagicTab || 1,
      flag: MageMagicAddon.FLAGS.ID + "-" + MageMagicAddon.FLAGS.SPELLSLOTS,
      strain,
      mageInfo,
    };
  }

  // async _handleCastButtonClick(event) {
  //   const clickedElement = $(event.currentTarget);
  //   const rank = clickedElement.data().rank;
  //   const name = clickedElement.data().name;
  //   const actorID = clickedElement.data().actor;
  //   if (actorID) {
  //     const actor = game.actors.get(actorID);

  //     // Construct the Roll instance
  //     let r = new Roll("1d20 + @rank", { rank: rank });

  //     // The parsed terms of the roll formula
  //     console.log(r.terms); // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]

  //     // Execute the roll
  //     await r.evaluate({ async: true });
  //     // let chatData = {
  //     //   type: CONST.CHAT_MESSAGE_TYPES.ROLL,
  //     //   rolls: [r],
  //     //   content: "My HTML Content",
  //     //   //etc.
  //     // };
  //     // ChatMessage.applyRollMode(chatData, "roll");
  //     // ChatMessage.create(chatData);

  //     const rollMode = game.settings.get("core", "rollMode");
  //     var stats = {};
  //     stats[name] = rank;
  //     const data = {
  //       actor: this.actor,
  //       stats,
  //       totalMod: rank,
  //     };
  //     const chatContent = await renderTemplate(
  //       "modules/swnr-space-magic/templates/chat-roll.html",
  //       data
  //     );
  //     const chatMessage = getDocumentClass("ChatMessage");
  //     chatMessage.create(
  //       chatMessage.applyRollMode(
  //         {
  //           speaker: ChatMessage.getSpeaker({ actor: this.actor }),
  //           roll: JSON.stringify(r.toJSON()),
  //           content: chatContent,
  //           type: CONST.CHAT_MESSAGE_TYPES.ROLL,
  //         },
  //         rollMode
  //       )
  //     );

  //     // The resulting equation after it was rolled
  //     console.log(r.result); // 16 + 2 + 4

  //     // The total resulting from the roll
  //     console.log(r.total); // 22

  //     MageMagicAddon.log(true, "Button Clicked!", { name, rank, actor, r });
  //   }
  // }

  async showSpellInChat(actorId, spellId) {
    const actor = game.actors?.get(actorId);
    const spell = actor.items.find(i => i.id == spellId);
    const data = {
      actor: actor,
      spell,
    };
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat-spellcast.hbs",
      data
    );
    const chatMessage = getDocumentClass("ChatMessage");
    chatMessage.create(
        {
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: chatContent,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        }
    );
  }

  async _handleCastSpellClick(event) {
    const clickedElement = $(event.currentTarget);
    const level = clickedElement.data().level;
    const actorId = clickedElement.data().actor;

    SpellSlots.useSpellSlot(actorId, level);
  }

  async _handleRestClick(event) {
    const clickedElement = $(event.currentTarget);
    const actorId = clickedElement.data().actor;

    SpellSlots.fillSpellSlots(actorId);
  }

  async _handleButtonClick(event) {
    const clickedElement = $(event.currentTarget);
    const action = clickedElement.data().action;
    const slotId = clickedElement.parents("[data-slot-id]")?.data()?.slotId;
    const castLevel = clickedElement.data()?.castLevel;
    const spellId = clickedElement.data()?.spellId;

    const actor = game.actors?.get(this.options.actorId);
    const swNMage = isSwNMage(actor);
    const mtAMage = isMtAMage(actor);
    switch (action) {
      case "rest": {
        if (swNMage) {
          await SpellSlots.fillSpellSlots(this.options.actorId);
        }
        if (mtAMage) {
          var mana = new Mana(actor);
          await mana.addRestMana();
        }
        this.render();
        break;
      }

      case "castBySlot": {
        await SpellSlots.updateSlot(this.options.actorId, slotId, {
          isUsed: true,
        });
        this.showSpellInChat(this.options.actorId, spellId);
        this.render();
        break;
      }

      case "castByLevel": {
        await SpellSlots.castByLevel(this.options.actorId, castLevel);
        this.showSpellInChat(this.options.actorId, spellId);
        this.render();
        break;
      }

      case "prepare": {
        await SpellSlots.prepareByLevel(
          this.options.actorId,
          castLevel,
          spellId
        );
        this.render();
        break;
      }

      case "unprepare": {
        await SpellSlots.updateSlot(this.options.actorId, slotId, {
          spell: null,
        });
        this.render();
        break;
      }

      case "restoreSlot": {
        await SpellSlots.updateSlot(this.options.actorId, slotId, {
          isUsed: false,
        });
        this.render();
        break;
      }

      case "add-mana": {
        var mana = new Mana(actor);
        var val = await mana.getCurrentValue();
        await mana.setCurrentValue(val + 1);
        this.render();
        break;
      }

      case "subtract-mana": {
        var mana = new Mana(actor);
        var val = await mana.getCurrentValue();
        await mana.setCurrentValue(val - 1);
        this.render();
        break;
      }

      case "add-strain": {
        if (actor.system.systemStrain.value < actor.system.systemStrain.max) {
          actor.system.systemStrain.value += 1;
        }
        this.render();
        break;
      }

      case "subtract-strain": {
        if (actor.system.systemStrain.value > 0) {
          actor.system.systemStrain.value -= 1;
        }
        this.render();
        break;
      }

      default:
        MageMagicAddon.log(false, "Invalid action detected", action);
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", "[data-action]", this._handleButtonClick.bind(this));

    html.on("click", ".swnr-mage-improvised-spellcasting-btn", (event) => {
      var actorId = event.target.dataset.actor;
      console.log("swnr-mage", "open improvised spellcast menu", actorId);
      try {
        new SpellcastConfig(null, {
          actorId,
        }).render(true);
      } catch (e) {
        console.error(e);
      }
    });
  }

  async _updateObject(event, formData) {
    if (!this.object.id) return;

    return this.object.update(formData);
  }
}
