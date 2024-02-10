import { MageMagicAddon } from "./MageMagicAddon.js";
// import { MageMagicData } from "./MageMagicData.js";
import {filterSkillsBySystem, validateSkillsExist} from "./utils.js";

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

  getData(options) {
    var tokens = null;
    var token = null;
    var magicSkills = [];
    // var showAddSkillsBtn = true;
    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
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
    }
    MageMagicAddon.log(true, token);
    return {
      token,
      magicSkills,
      showAddSkillsBtn: true,
    };
  }

  async _handleCastButtonClick(event) {
    const clickedElement = $(event.currentTarget);
    const rank = clickedElement.data().rank;
    const name = clickedElement.data().name;
    const actor = clickedElement.data().actor;

    // Construct the Roll instance
    let r = new Roll("1d20 + @rank", { rank: rank });

    // The parsed terms of the roll formula
    console.log(r.terms); // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]

    // Execute the roll
    await r.evaluate({ async: true });
    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls: [r],
      content: "My HTML Content",
      //etc.
    };
    ChatMessage.applyRollMode(chatData, "roll");
    ChatMessage.create(chatData);

    // The resulting equation after it was rolled
    console.log(r.result); // 16 + 2 + 4

    // The total resulting from the roll
    console.log(r.total); // 22

    MageMagicAddon.log(true, "Button Clicked!", { name, rank, actor, r });
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("click", ".mage-roll-skill", this._handleCastButtonClick);
  }

  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);

    // await ToDoListData.updateUserToDos(this.options.userId, expandedData);

    this.render();
  }
}
