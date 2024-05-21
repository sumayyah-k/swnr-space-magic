import { isMtAMage } from "../utils.js";
import { MageMagicAddon } from "../MageMagicAddon.js";

export default class {
  resultData = {
    mage: {
      desc: {
        dramafail: "Your character not only loses a dot of Wisdom from her complete disregard for the world around her, but she also gains a Persistent Condition pertaining to the hubris. Take Megalomaniacal or Rampant. The normal resolution gives a Beat. Your character may only resolve the Condition permanently by gaining a dot of Wisdom.",
        failure: "Your character loses a dot of Wisdom, as she fails to see the consequences and ripples from her actions. Take the Megalomaniacal or Rampant Condition.",
        success: "Your character is able to examine and understand the ramifications of her actions. She does not lose Wisdom.",
        exceptional: "Your character's Wisdom is reinforced by examining the risk and consequences of her actions. Take an additional Arcane Beat from the epiphany."
      }
    }
  }

  static levelTitles = {
    enlightened: "Enlightened",
    understanding: "Understanding",
    falling: "Falling",
  }

  /**
   * Get an actor's morality value. If it doesn't exist yet, set it to the starting value
   *
   * @param {Object} actor The actor to retrieve the value from
   * @returns {Integer|Null}
   */
  static async getValue(actor) {
    const startingMorality = 7;

    const val = await actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTOR_MORALITY);

    if (!val) {
      await actor.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ACTOR_MORALITY,
        startingMorality
      );
      return startingMorality;
    }

    return parseInt(val, 10);
  }

  /**
   * Determine the name of morality from the actor's class.
   *
   * @param {Object} actor the actor who will see the label
   * @returns {String}
   */
  static async getLabel(actor) {
    if (await isMtAMage(actor)) {
      return 'Wisdom';
    }
    return "Integrity";
  }

  /**
   * Determine the name of morality challenge from the actor's class.
   *
   * @param {Object} actor the actor who will see the label
   * @returns {String}
   */
  static async getChallengeBtnLabel(actor) {
    if (await isMtAMage(actor)) {
      return {short: 'Hubris', long: "Act of Hubris"};
    }
    return {short: "Break", long: "Breaking Point"};
  }

  /**
   * Get the base dice for a morality challenge
   *
   * @param {Object} actor the actor who is doing the challenge
   * @returns {Array}
   */
  static async getChallengeBaseDicePool(actor) {
    if (await isMtAMage(actor)) {
      return [];
    }
    //Resolve/Composure
    return ['stat-con', 'stat-wis'];
  }
}