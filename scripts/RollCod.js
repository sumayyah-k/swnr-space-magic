import { MageMagicAddon } from "./MageMagicAddon.js";

export class RollCod extends FormApplication {
  constructor(opts, data) {
    super(opts);

    this.actorId = data.actorId;
    this.actor = game.actors?.get(data.actorId);
    this.combatRollSkills = [];

    if (data.combatRollSkills) {
      this.combatRollSkills = data.combatRollSkills;
    }
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      width: "auto",
      classes: [MageMagicAddon.ID + "-combat-roll-cod", "dialogue"],
      id: MageMagicAddon.ID + "-combat-roll-cod",
      template: MageMagicAddon.TEMPLATES.ROLLCOD,
      title: "Roll Check",
      popOut: true,
      resizable: true,
      minimizable: false,
      closeOnSubmit: true,
      submitOnChange: false,
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  async getData(options) {
    // this.actor
    var totalDice = 0;
    var rollSkills = [];
    for (var item of this.combatRollSkills) {
      if (item.substring(0, 5) == "item-") {
        var skill = this.actor.items.find(i => i.id == item.substring(5));
        if (skill) {
          rollSkills.push(skill.name);
          totalDice += parseInt(skill.system.rank, 0) + 1;
        }
      } else if (item.substring(0, 5) == "stat-") {
        rollSkills.push(item.substring(5).toUpperCase());
        totalDice += this.actor.system.stats[item.substring(5)].mod;
      }
    }

    this.rollSkills = rollSkills.join(" + ");

    return {
      actor: this.actor,
      combatRollSkills: this.combatRollSkills,
      rollSkills: rollSkills.join(' + '),
      rollType: "10-again",
      totalDice,
    };
  }

  async _updateObject(event, formData) {
    const dicePool = formData["total-dice"];
    const rollType = formData["roll-style"];
    let r;
    let isChanceDie = false;
    let rolls = [];
    if (dicePool < 1) {
      r = new Roll("1d10cs=8", { dicePool });
      isChanceDie = true;
    } else if (
      rollType == "rote"
    ) {
      r = new Roll(dicePool + "d10xo<8x10cs>=8", {
        dicePool,
      });
    } else {
      var explode = 10;
      switch (rollType) {
        case "8-again":
          explode = 8;
          break;
        case "9-again":
          explode = 9;
          break;
        default:
          break;
      }
      //pg212
      r = new Roll(
        dicePool + "d10x>=" + explode + "cs>=8",
        {
          dicePool: dicePool,
        }
      );
    }

    await r.evaluate({ async: true });
    rolls.push(r);

    var successType = "failure";
    if (isChanceDie && r.dice[0].results[0].result == 1) {
      successType = "dramafail";
    } else if (r.result >= 5) {
      successType = "exceptional";
    } else if (r.result > 0 && r.result < 5) {
      successType = "success";
    }

    let data = {
      actor: this.actor,
      r,
      successType,
      rollSkills: this.rollSkills,
    };

    const chatContent = await renderTemplate(
      MageMagicAddon.TEMPLATES.ROLLCOD_CHAT,
      data
    );

    let chatData = {
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      speaker: ChatMessage.getSpeaker({
        actor: this.actor,
        token: this.actor.token,
      }),
        sound: CONFIG.sounds.dice,
      rolls,
      content: chatContent,
      //etc.
    };

    ChatMessage.applyRollMode(chatData, "roll");
    return ChatMessage.create(chatData);
  }
}