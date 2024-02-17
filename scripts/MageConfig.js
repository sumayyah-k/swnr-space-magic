import { MageMagicAddon } from "./MageMagicAddon.js";
// import { MageMagicData } from "./MageMagicData.js";
import {filterSkillsBySystem, validateSkillsExist} from "./utils.js";
import SpellSlots from './Models/SpellSlots.js';

export class MageConfig extends FormApplication {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      id: "mage-magic",
      template: MageMagicAddon.TEMPLATES.SPELLCASTING,
      title: "Grimoire",
      userId: game.userId,
      popOut: true,
      resizable: true,
      minimizable: true,
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  bind(html) {
    MageMagicAddon.log(true, {html});
  }

  getData(options) {
    var tokens = null;
    var token = null;
    var magicSkills = [];
    var spells = [];
    var actorId = null;
    // var showAddSkillsBtn = true;
    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
      actorId = token.document.actor.id;
      magicSkills = token.document.actor.items.contents.filter((i) =>
        filterSkillsBySystem(token, i)
      );

      // if (!validateSkillsExist(token)) {
      //   showAddSkillsBtn = false;
      // }
      magicSkills = magicSkills.map((i) => {
        return {
          name: i.name,
          rank: i.system.rank,
          actor: token.document.actor.id,
        };
      });

      spells = token.document.actor.items.contents
        .filter((i) => i.type == "power")
        .reduce((acc, i) => {
          MageMagicAddon.log(true, acc);
          if (!acc.hasOwnProperty(i.system.level)) {
            acc[i.system.level] = [];
          }
          acc[i.system.level.toString()].push(i);
          acc[i.system.level.toString()].sort((a, b) => b.sort - a.sort);
          return acc;
        }, {});
    }

    const spellSlots = SpellSlots.getForActor(actorId);
    const maxSpellSlots = SpellSlots.getMaxSpellSlots(token.document.actor.system.class, token.document.actor.system.level.value);

    const activeMagicTab = game.actors
      .get(actorId)
      ?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTIVE_MAGIC_TAB);

    // const spellSlots = {};
    return {
      token,
      actor: actorId,
      magicSkills,
      showAddSkillsBtn: true,
      maxSpellSlots,
      spellSlots,
      spells,
      activeMagicTab: activeMagicTab || 1,
    };
  }

  async _handleCastButtonClick(event) {
    const clickedElement = $(event.currentTarget);
    const rank = clickedElement.data().rank;
    const name = clickedElement.data().name;
    const actorID = clickedElement.data().actor;
    if (actorID) {
      const actor = game.actors.get(actorID);
      
      // Construct the Roll instance
      let r = new Roll("1d20 + @rank", { rank: rank });

      // The parsed terms of the roll formula
      console.log(r.terms); // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]

      // Execute the roll
      await r.evaluate({ async: true });
      // let chatData = {
      //   type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      //   rolls: [r],
      //   content: "My HTML Content",
      //   //etc.
      // };
      // ChatMessage.applyRollMode(chatData, "roll");
      // ChatMessage.create(chatData);
      
      const rollMode = game.settings.get("core", "rollMode");
      var stats = {}
      stats[name] = rank;
      const data = {
        actor: this.actor,
        stats,
        totalMod: rank,
      };
      const chatContent = await renderTemplate(
        "modules/swnr-space-magic/templates/chat-roll.html",
        data
      );
      const chatMessage = getDocumentClass("ChatMessage");
      chatMessage.create(
        chatMessage.applyRollMode(
          {
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            roll: JSON.stringify(r.toJSON()),
            content: chatContent,
            type: CONST.CHAT_MESSAGE_TYPES.ROLL,
          },
          rollMode
        )
      );     
      

      // The resulting equation after it was rolled
      console.log(r.result); // 16 + 2 + 4

      // The total resulting from the roll
      console.log(r.total); // 22

      MageMagicAddon.log(true, "Button Clicked!", { name, rank, actor, r });
    }
  }

  // async _handleSpellTabClick(event) {
  //   const clickedElement = $(event.currentTarget);
  //   const level = clickedElement.data().level;
  //   const actorId = clickedElement.data().actor;
  //   game.actors
  //     .get(actorId)
  //     ?.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTIVE_MAGIC_TAB, level);


  //   const tab = event.target.closest("[data-tab]");
  //   if (!tab) return;
  //   event.preventDefault();
  //   const tabName = tab.dataset.tab;
  //   if (tabName !== this.active)
  //     this.activate(tabName, { triggerCallback: true });
  // }

  async _handleCastSpellClick(event) {
    const clickedElement = $(event.currentTarget);
    const level = clickedElement.data().level;
    const actorId = clickedElement.data().actor;

    SpellSlots.useSpellSlot(actorId, level);
  }
  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".mage-roll-skill", this._handleCastButtonClick);
    // html.on("click", ".mage-spell-level-tab", this._handleSpellTabClick);
    html.on("click", ".magic-casting-cast-btn", this._handleCastSpellClick);
  }

  async _updateObject(event, formData) {
    // const expandedData = foundry.utils.expandObject(formData);

    // await ToDoListData.updateUserToDos(this.options.userId, expandedData);

    // this.render();
    return;
  }
}
