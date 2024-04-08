export default class Spell {
  static practices = [
    {id: 'compelling', name: "Compelling", rank: 0, desc: "Compelling spells nudge a preferred but possible outcome into reality. A coin toss can be made to come up tails (Fate), a bored worker can be made to take that coffee break now (Mind), or a spirit can be forced to avoid its bane (Spirit). Making the coin hover and spin in midair, making the worker walk into her boss’s office and quit, or making the spirit ignore its favorite prey are beyond the bounds of a Compelling spell."},
    {id: 'knowing', name: "Knowing", rank: 0, desc: "Knowing spells deliver knowledge about something directly to the mage (or to another target). A mage can divine the cause of a corpse’s death (Death), sense whether someone has a powerful destiny (Fate), or unerringly know which way is north (Space). This knowledge is a direct awareness of Supernal truth; the mage doesn’t have to interpret evidence based on her senses or try to divine the truth out of cryptic riddles."},
    {id: 'unveiling', name: "Unveiling", rank: 0, desc: "Unveiling spells expose hidden things to the mage’s senses. She might gain the ability to hear radio waves (Forces), peer across the Gauntlet or perceive things in Twilight (Spirit), or see the flow of Mana across the landscape (Prime)."},
    {id: 'ruling', name: "Ruling", rank: 1, desc: "Ruling spells grant fuller control over phenomena than a mere Compelling spell. Water can be made to flow uphill or into unnatural shapes (Matter), animals (or even human beings) can be commanded (Life or Mind), or time can be momentarily made to accelerate or slow down (Time). A Ruling spell can’t fundamentally alter its target’s abilities: Water can be directed, but not turned solid or gaseous. Time can be altered, but not overwritten. An animal can be commanded, but not made stronger or fiercer."},
    {id: 'shielding', name: "Shielding", rank: 1, desc: "Shielding spells, sometimes called Warding spells, offer protection against phenomena under the Arcanum’s purview. A Shielding spell might protect against a ghost’s Numina (Death), make the mage immune to fire (Forces) or disease (Life), or allow her to survive in a caustic atmosphere (Matter). Mages protect themselves from general harm through the power of their Arcana with the Mage Armor Attainment rather than Shielding spells."},
    {id: 'veiling', name: "Veiling", rank: 1, desc: "Veiling spells are twofold: Firstly, they can conceal things under the Arcanum’s purview from detection: A target can be made to lose all sense of time (Time), a fire’s heat and light can be hidden from view (Forces), or a building made all but impossible to notice (Matter). Secondly, they can conceal a target from concrete phenomena under the Arcanum’s purview: a mage can render herself invisible to ghosts (Death), or ward a powerful Locus from detection by spirits (Spirit), or walk unnoticed through a crowd (Life or Mind), or past a camera (Forces). Short of archmastery, it’s impossible to Veil something against an abstract concept or force: a mage can’t Veil herself against death or hide from time, for example."},
    {id: 'fraying', name: "Fraying", rank: 2, desc: "Fraying spells degrade things, weakening them and enhancing their flaws. Fraying spells can weaken targets under the Arcanum’s purview: damping a fire (Forces), sapping Strength (Life), or eroding the barrier between worlds (Death, Spirit, or others, depending on the worlds in question). They can also directly attack targets using the energies of the Arcanum: inflicting damage via the chill of the grave (Death), psychic overload (Mind), or a blast of electricity (Forces). Damage inflicted by a direct-attack Fraying spell is always bashing."},
    {id: 'perfecting', name: "Perfecting", rank: 2, desc: "Perfecting spells are the opposite of Fraying spells in many ways: they bolster, strengthen, and improve rather than weakening and eroding. A Perfecting spell might repair damage to an object or a person (Matter or Life), allow a machine to function perfectly with no wear and tear (Matter), or make a modest destiny into an earth-shaking one (Fate)."},
    {id: 'weaving', name: "Weaving", rank: 2, desc: "Weaving spells can alter nearly any property of a target without transforming it into something completely different. Solid steel can be transmuted to liquid (Matter), a sword can be enchanted to damage beings in Twilight (Death or Spirit), or a few seconds of time can be rewritten (Time)."},
    {id: 'patterning', name: "Patterning", rank: 3, desc: "Patterning spells allow a mage to completely transform a target into something else that falls under the Arcanum’s purview. A memory can be replaced wholesale (Mind), the mage can turn herself (or a target) into an animal (Life), or she can teleport by “rewriting” her own location (Space). A spell that transforms the target into something that falls within the Purview of another Arcanum, like transforming into a living pillar of fire (Life and Forces), requires a mage to know the Practice of Patterning for the destination Arcanum."},
    {id: 'unraveling', name: "Unraveling", rank: 3, desc: "Unraveling spells can significantly impair or damage phenomena under the Arcanum’s purview, or directly inflict severe damage using the forces of an Arcanum. A raging storm might become a calm summer’s day (Forces), or solid iron reduced to dust (Matter); even spells can be torn asunder (Prime). Mages can hurl fire (Forces) at their enemies, or cause aneurysms and heart attacks with a glance (Mind or Life). Damage inflicted by a direct Unraveling attack is lethal, but can be upgraded to aggravated by spending a point of Mana and one Reach."},
    {id: 'making', name: "Making", rank: 4, desc: "Making spells allow for the creation of whole new phenomena ex nihilo. The mage can conjure gamma rays (Forces), birth new spirits (Spirit), or create a doorway to the Underworld (Death). Time can be dilated by creating more seconds, hours, or even days (Time)."},
    {id: 'unmaking', name: "Unmaking", rank: 4, desc: "Unmaking spells annihilate subjects under the Arcanum’s purview entirely. Life can be snuffed like a candle (Life), two locations can be forced into each other by destroying the distance between them (Space), even Hallows and Verges can be wiped from the Earth (Prime). Unmaking spells are beyond inflicting direct damage with attacks; a successful Unmaking destroys the target altogether."},
  ];

  static castingMethods = {
    improvised: {name: "Improvised", desc: ""},
    rote: {name: "Rote", desc: ""},
    praxis: {name: "Praxis", desc: ""},
  }

  static primaryFactors = {
    potency: {name: "Potency", desc: ""},
    duration: {name: "Duration", desc: ""},
  }

  static spellDurations = [
    {id: "1_turn", name: "1 turn", dicePenalty: 0, advanced: false, desc: ""},
    {id: "2_turns", name: "2 turns", dicePenalty: 2,  advanced: false, desc: ""},
    {id: "3_turns", name: "3 turns", dicePenalty: 4,  advanced: false, desc: ""},
    {id: "5_turns", name: "5 turns", dicePenalty: 6,  advanced: false, desc: ""},
    {id: "10_turns", name: "10 turns", dicePenalty: 8,  advanced: false, desc: ""},
    {id: "20_turns", name: "20 turns", dicePenalty: 10,  advanced: false, desc: ""},
    {id: "30_turns", name: "30 turns", dicePenalty: 12,  advanced: false, desc: ""},
    {id: "40_turns", name: "40 turns", dicePenalty: 14,  advanced: false, desc: ""},
    {id: "50_turns", name: "50 turns", dicePenalty: 16,  advanced: false, desc: ""},
    {id: "60_turns", name: "60 turns", dicePenalty: 18,  advanced: false, desc: ""},
    {id: "70_turns", name: "70 turns", dicePenalty: 20,  advanced: false, desc: ""},
    {id: "scene", name: "One scene/hour", dicePenalty: 0,  advanced: true, desc: ""},
    {id: "day", name: "One Day", dicePenalty: 2,  advanced: true, desc: ""},
    {id: "week", name: "One Week", dicePenalty: 4,  advanced: true, desc: ""},
    {id: "month", name: "One Month", dicePenalty: 6,  advanced: true, desc: ""},
    {id: "year", name: "One Year", dicePenalty: 8,  advanced: true, desc: ""},
    {id: "indefinite", name: "Indefinite (Cost: 1 mana, 1 reach)", dicePenalty: 10,  advanced: true, desc: ""},
  ];

  static ranges = [
    {id: "touch", name: "Self/Touch", advanced: false},
    {id: "aimed", name: "Aimed", advanced: false},
    {id: "sensory", name: "Sensory", advanced: true},
    {id: "remote", name: "Remote Viewed (Live Camera Feed, Scrying, Etc.)", advanced: true},
    {id: "sympathetic", name: "Sympathetic Range", advanced: true},
    {id: "temporal", name: "Temporal Sympathy", advanced: true},
  ];

  static scales = [
    {id: "1", name: "1 subject, size 5, Arm's reach", advanced: false, dicePenalty: 0},
    {id: "2", name: "2 subjects, size 6, Small Room", advanced: false, dicePenalty: 2},
    {id: "4", name: "4 subjects, size 7, Large Room", advanced: false, dicePenalty: 4},
    {id: "8", name: "8 subjects, size 8, Single Floor", advanced: false, dicePenalty: 6},
    {id: "16", name: "16 subjects, size 9, Small House", advanced: false, dicePenalty: 8},
    {id: "A5", name: "5 subjects, size 5, Large House", advanced: true, dicePenalty: 0},
    {id: "A10", name: "10 subjects, size 10, Small Warehouse", advanced: true, dicePenalty: 2},
    {id: "A20", name: "20 subjects, size 15, Supermarket", advanced: true, dicePenalty: 4},
    {id: "A40", name: "40 subjects, size 20, Shopping Mall", advanced: true, dicePenalty: 6},
    {id: "A80", name: "80 subjects, size 25, City Block", advanced: true, dicePenalty: 8},
    {id: "A160", name: "160 subjects, size 30, Small Neighborhood", advanced: true, dicePenalty: 10},
    {id: "A320", name: "320 subjects, size 35, Small Neighborhood", advanced: true, dicePenalty: 12},
    {id: "A640", name: "640 subjects, size 40, Small Neighborhood", advanced: true, dicePenalty: 14},
    {id: "A1280", name: "1280 subjects, size 45, Small Neighborhood", advanced: true, dicePenalty: 16},
  ];

  static commonYantras = [
    {id:'demense', name: 'Demense', category: 'location', bonus: 2, desc: '<p>A prepared ritual space with a soul stone.</p>'},
    {id:'location', name: 'Location', category: 'location', bonus: 1, desc: '<p>A place and time symbolically linked to the spell.</p>'},
    {id:'verge', name: 'Supernal Verge', category: 'location', bonus: 2, desc: '<p>A place where the Supernal touches the Fallen World.</p>'},
    {id:'mudra', name: 'Rote Skill Mudra', category: 'actions', bonus: null, desc: '<p>Uses skill dots as a bonus. The character must be free to make whatever mnemonic gestures are used to recall the Rote.</p>'},
    {id:'concentration', name: 'Concentration', category: 'actions', bonus: 2, desc: '<p>Duration must be greater than a turn. If the mage is hurt or takes a non-reflexive action while spell is active, it ends immediately.</p>'},
    {id:'mantra', name: 'Mantra (High Speech)', category: 'actions', bonus: 2, desc: '<p>Must be spoken aloud. Cannot be used reflexively.</p>'},
    {id:'runes', name: 'Runes', category: 'actions', bonus: 2, desc: '<p>The subject is marked with runes. Ritual casting only. If anything damages or disrupts the runes while the spell is active, it ends immediately.</p>'},
    {id:'dedicatedTool', name: 'Dedicated Tool', category: 'tools', bonus: 0, desc: '<p>An item that synchronizes with her Nimbus and that feeds in to her understanding of magic. Reduces Paradox by 2 dice.</p>'},
    {id:'pathTool', name: 'Path Tool', category: 'tools', bonus: 1, desc: '<p>Tools which align closely to her Path. See p. 121 for examples.</p>'},
    {id:'orderTool', name: 'Order Tool', category: 'tools', bonus: 1, desc: '<p>Tools which draw upon an Order\'s symbols rather than those of the Supernal world directly, focusing magic in a way that matches their teachings.</p>'},
    {id:'materialSympathy', name: 'Material Sympathy', category: 'tools', bonus: 2, desc: '<p>An item sympathetically linked to the subject <i>as they are now</i>. At least one sympathetic tool is required for sympathetic casting. Does not grant a bonus when used with Sympathetic Range or Temporal Sympathy Attainments.</p>'},
    {id:'representationalSympathy', name: 'Representational Sympathy', category: 'tools', bonus: 1, desc: '<p>An item sympathetically linked to the subject <i>as they were previously</i>. At least one sympathetic tool is required for sympathetic casting. Does not grant a bonus when used with Sympathetic Range or Temporal Sympathy Attainments.</p>'},
    {id:'symbolicSympathy', name: 'Symbolic Sympathy', category: 'tools', bonus: 0, desc: '<p>An indirect representation of the subject. At least one sympathetic tool is required for sympathetic casting.</p>'},
    {id:'sacrement-common', name: 'Sacrement', category: 'tools', bonus: 1, desc: '<p>An object symbolic of the spell that the mage destroys during casting.</p>'},
    {id:'sacrement-rare', name: 'Rare Sacrement', category: 'tools', bonus: 2, desc: '<p>A sacrement which requires significant effort to acquire.</p>'},
    {id:'sacrement-otherworldly', name: 'Otherworldly Sacrement', category: 'tools', bonus: 3, desc: '<p>A sacrement from somewhere other than the material realm.</p>'},
  ];

  static rankedPractices(highestArcanum, showAll)
  {
    return this.practices.reduce((acc, p) => {
      if (showAll === true || (highestArcanum && highestArcanum.rank >= p.rank)) {
        acc[p.rank][p.id] = p;
      }
      return acc;
    },[{}, {}, {}, {}, {}]);
  }
}