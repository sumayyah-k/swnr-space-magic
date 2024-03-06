export default class {
  static gnosisInfo = [
    {ritualInterval: {amount: 3, unit: 'hour'}, yantras: 2, paradox: 1, combinedSpells: 1, mana: {max: 10, perTurn: 1}},
    {ritualInterval: {amount: 3, unit: 'hour'}, yantras: 2, paradox: 1, combinedSpells: 1, mana: {max: 11, perTurn: 2}},
    {ritualInterval: {amount: 1, unit: 'hour'}, yantras: 3, paradox: 2, combinedSpells: 2, mana: {max: 12, perTurn: 3}},
    {ritualInterval: {amount: 1, unit: 'hour'}, yantras: 3, paradox: 2, combinedSpells: 2, mana: {max: 13, perTurn: 4}},
    {ritualInterval: {amount: 30, unit: 'minute'}, yantras: 4, paradox: 3, combinedSpells: 2, mana: {max: 15, perTurn: 5}},
    {ritualInterval: {amount: 30, unit: 'minute'}, yantras: 4, paradox: 3, combinedSpells: 3, mana: {max: 20, perTurn: 6}},
    {ritualInterval: {amount: 10, unit: 'minute'}, yantras: 5, paradox: 4, combinedSpells: 3, mana: {max: 25, perTurn: 7}},
    {ritualInterval: {amount: 10, unit: 'minute'}, yantras: 5, paradox: 4, combinedSpells: 3, mana: {max: 30, perTurn: 8}},
    {ritualInterval: {amount: 1, unit: 'minute'}, yantras: 6, paradox: 5, combinedSpells: 4, mana: {max: 50, perTurn: 10}},
    {ritualInterval: {amount: 1, unit: 'minute'}, yantras: 6, paradox: 5, combinedSpells: 4, mana: {max: 75, perTurn: 15}},
  ];

  static byRank(rank) {
    return this.gnosisInfo[rank] || null;
  }

  static getRitualIntervals(rank, fromGrimoire) {
    var ritualIntervals = [];
    var amount = this.gnosisInfo[(rank || 0)].ritualInterval.amount;
    if (fromGrimoire) {
      amount = amount * 2;
    }

    for (var i = 0; i <= 5; i++) {
      ritualIntervals.push({
        id: i,
        name: ((i+1)*amount) + ' '
          + (this.gnosisInfo[(rank || 0)].ritualInterval.unit == 'hour' ? "Hour" : "Minute")
          + ((i+1)*amount == 1 ? '' : 's'),
        additionalDice: i,
      });
    }

    return ritualIntervals;
  }
}