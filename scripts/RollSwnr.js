import { MageMagicAddon } from "./MageMagicAddon.js";
import { isMtAMage } from "./utils.js";

export class RollSwnr extends FormApplication {
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
      classes: [MageMagicAddon.ID + "-combat-roll-swnr", "dialogue"],
      id: MageMagicAddon.ID + "-combat-roll-swnr",
      template: MageMagicAddon.TEMPLATES.ROLLSWNR,
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
    var totalMod = 0;
    var rollSkills = [];
    for (var item of this.combatRollSkills) {
      if (item == "morality") {
        var morality = this.actor.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.ACTOR_MORALITY
        );
        if (morality) {
          if (isMtAMage(this.actor)) {
            rollSkills.push("Wisdom");
          } else {
            rollSkills.push("Morality");
          }
          totalMod += parseInt(morality, 0);
        }
      } else if (item.substring(0, 5) == "item-") {
        var skill = this.actor.items.find((i) => i.id == item.substring(5));
        if (skill) {
          rollSkills.push(skill.name);
          totalMod += parseInt(skill.system.rank, 0);
        }
      } else if (item.substring(0, 5) == "stat-") {
        rollSkills.push(item.substring(5).toUpperCase());
        totalMod += this.actor.system.stats[item.substring(5)].mod;
      }
    }

    this.rollSkills = rollSkills.join(" + ");

    return {
      actor: this.actor,
      combatRollSkills: this.combatRollSkills,
      rollSkills: rollSkills.join(" + "),
      rollType: "2d6",
      totalMod,
    };
  }

  async _updateObject(event, formData) {
    const mod = formData["mod"];
    const rollType = formData["roll-style"];
    let r;
    let isChanceDie = false;
    let rolls = [];

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
    r = new Roll(rollType + (rollType != '2d6' ? 'kh2' : '') + "+ @mod", {
      mod,
    });


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
      MageMagicAddon.TEMPLATES.ROLLSWNR_CHAT,
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
