import { MageMagicAddon } from "./MageMagicAddon.js";
import { isMtAMage } from "./utils.js";
import Morality from "./Models/Morality.js";

export class ChallengeMorality extends FormApplication {
  constructor(opts, data) {
    super(opts);

    this.actorId = data.actorId;
    this.actor = game.actors?.get(data.actorId);
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: "auto",
      width: "auto",
      classes: [MageMagicAddon.ID + "-morality-check", "dialogue"],
      id: MageMagicAddon.ID + "-morality-check",
      template: MageMagicAddon.TEMPLATES.ROLLWISDOM,
      title: 'Wisdom Check',
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

    var combatRollSkills = Morality.getChallengeBaseDicePool(this.actor);
    for (var item of combatRollSkills) {
      if (item == "morality") {
        var morality = this.actor.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.ACTOR_MORALITY
        );
        if (morality) {
          var isMage = await isMtAMage(this.actor);
          if (isMage) {
            rollSkills.push("Wisdom");
          } else {
            rollSkills.push("Morality");
          }
          totalDice += parseInt(morality, 0);
        }
      } else if (item.substring(0, 5) == "item-") {
        var skill = this.actor.items.find((i) => i.id == item.substring(5));
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
      rollSkills: rollSkills.join(" + "),
      rollType: "understanding",
      totalDice,
      modifier: 0,
    };
  }

  async _updateObject(event, formData) {
    const modifier = formData["modifier"];
    const rollType = formData["roll-style"];
    let r;
    let isChanceDie = false;
    let rolls = [];
    let dicePool = 0;

    switch (rollType) {
      case "enlightened":
        dicePool = 5;
        break;
      case "understanding":
        dicePool = 3;
        break;
      case "falling":
        dicePool = 1;
        break;
      default:
        break;
    }

    if (dicePool < 1) {
      r = new Roll("1d10cs=8", { dicePool });
      isChanceDie = true;
    } else {
      var explode = 10;

      //pg212
      r = new Roll((dicePool + modifier) + "d10x>=10cs>=8", {
        dicePool,
        modifier,
      });
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
      rollType: Morality.levelTitles[rollType],
    };

    const chatContent = await renderTemplate(
      MageMagicAddon.TEMPLATES.ROLLWISDOM_CHAT,
      data,
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
