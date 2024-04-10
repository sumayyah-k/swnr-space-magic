import { MageMagicAddon } from "../MageMagicAddon.js";

export default class Arcanum {
  names = ["Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Space", "Spirit", "Time"];

  data = [
    {name: "Death", activeMageSightEffect: "Death Sight allows a mage to detect the presence of the Anchor Condition (p. 258) or manifested ghosts and related phenomena. With a glance, a mage using Mage Sight can tell if someone has a soul, or if a body is, in fact, dead."},
    {name: "Fate", activeMageSightEffect: "Fate Sight highlights anyone the mage watches who experiences a dramatic failure or exceptional success. It reveals the presence and use of a Destiny (see Merits, p. 100), but not the details of that destiny."},
    {name: "Forces", activeMageSightEffect: "Forces Sight detects motion and highlights the presence of environmental Tilts, fire, electricity, and other hazards. With a glance, a mage can tell if a device is powered."},
    {name: "Life", activeMageSightEffect: "Life Sight detects life signs, revealing if a body is still alive, and allows a mage to gauge how injured a character is with a glance. The presence of toxins, diseases, and Personal Tilts is obvious to the mage."},
    {name: "Matter", activeMageSightEffect: "Matter Sight allows the mage to determine the Structure and Durability of anything she looks at, as well as highlighting the value and quality of items (in game terms, telling the player the Availability and Equipment Bonus of any object)."},
    {name: "Mind", activeMageSightEffect: "Mind Sight detects the presence of thinking beings and allows the mage to tell with a glance if someone is asleep, comatose, awake, meditating, or projecting out of his body or into the Astral. The mage is also aware when a character she observes gains or spends Willpower."},
    {name: "Prime", activeMageSightEffect: "Prime Sight highlights anything the mage can use as a Yantra, and the presence (if not the composition) of any Awakened spell or Attainment effect. Mages using Prime Sight can recognize tass with a glance, and tell when they are in a Hallow or Node."},
    {name: "Space", activeMageSightEffect: "Space Sight allows the user to instantly judge distances, range bands, and cover, allowing the player to know what bonuses or penalties would be in effect before the character acts. It also detects spatial warps, scrying windows, and the presence of Irises."},
    {name: "Spirit", activeMageSightEffect: "Spirit Sight reveals the strength of the local Gauntlet, detects the presence and nature of the Resonance Condition and other sources of Essence, and highlights manifested spirits and related phenomena."},
    {name: "Time", activeMageSightEffect: "Time Sight reveals the split-second adjustments of time, allowing the player to know the Initiative ratings of all participants in combat. When a character is about to act, even with a reflexive action, a mage watching with Time Sight is aware of it (if not what that action will be), and may preempt it if he is able. Time Sight also detects temporal warps, and the tell-tale signs that someone has come back into the past."}
  ];

  constructor (actor) {
    if (actor) {
      if (typeof actor == 'object') {
        this.actor = actor;
      } else if (typeof actor == 'string') {
        this.actor = game.actors.get(actor);
      }
    }
  }

  getAll(allArcanumOption) {
    var arcana = this.actor.items.contents.filter((i) =>
      this.names.indexOf(i.name) != -1
    );

    arcana = arcana.map((i) => {
      var importance = i.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE);
      var data = this.data.find(d => d.name == i.name);

      return {...{
        id: i.id,
        rank: i.system.rank,
        actor: this.actor.id,
        importance: importance,
      }, ...data};
    });

    if (allArcanumOption == true) {
      arcana = [
        ...[{
          id: 'any',
          name: 'Any Arcanum',
        }],
        ...arcana
      ]
    }
    return arcana;
  }
}