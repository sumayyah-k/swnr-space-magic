export default class Spell {
  static practices = [
    {id: 'compelling', name: "Compelling", rank: 0, desc: ""},
    {id: 'knowing', name: "Knowing", rank: 0, desc: ""},
    {id: 'unveiling', name: "Unveiling", rank: 0, desc: ""},
    {id: 'ruling', name: "Ruling", rank: 1, desc: ""},
    {id: 'shielding', name: "Shielding", rank: 1, desc: ""},
    {id: 'veiling', name: "Veiling", rank: 1, desc: ""},
    {id: 'fraying', name: "Fraying", rank: 2, desc: ""},
    {id: 'perfecting', name: "Perfecting", rank: 2, desc: ""},
    {id: 'weaving', name: "Weaving", rank: 2, desc: ""},
    {id: 'paterning', name: "Paterning", rank: 3, desc: ""},
    {id: 'unraveling', name: "Unraveling", rank: 3, desc: ""},
    {id: 'making', name: "Making", rank: 4, desc: ""},
    {id: 'unmaking', name: "Unmaking", rank: 4, desc: ""},
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
    {id: "remote", name: "Remote Viewed", advanced: true},
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