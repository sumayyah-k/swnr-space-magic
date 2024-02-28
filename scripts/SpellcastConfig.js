import { MageMagicAddon } from "./MageMagicAddon.js";
import {
  filterSkillsBySystem,
  isMtAMage,
  isSwNMage,
} from "./utils.js";
import Mana from "./Models/Mana.js";
import Gnosis from "./Models/Gnosis.js";

export class SpellcastConfig extends FormApplication {

  practices = [
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

  castingMethods = {
    improvised: {name: "Improvised", desc: ""},
    rote: {name: "Rote", desc: ""},
    praxis: {name: "Praxis", desc: ""},
  }

  primaryFactors = {
    potency: {name: "Potency", desc: ""},
    duration: {name: "Duration", desc: ""},
  }

  spellDurations = [
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

  ranges = [
    {id: "touch", name: "Self/Touch", advanced: false},
    {id: "aimed", name: "Aimed", advanced: false},
    {id: "sensory", name: "Sensory", advanced: true},
    {id: "remote", name: "Remote Viewed", advanced: true},
  ];

  scales = [
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

  constructor(opts, data) {
    super(opts, { submitOnChange: true, closeOnSubmit: false });
    console.log("swnr-mage", "\opts", opts, data);
    console.log("swnr-mage", "OBJECT", this.object);

    this.actor = game.actors?.get(data.actorId);

    // this.valueChange = {
    //   dicePool: false,
    // };

    // this.options.title =
    //   this.actor.name +
    //   (this.object.name === "New Active Spell"
    //     ? " - Improvised Spellcasting"
    //     : " - " + this.object.name);
    // this.paradoxRolled = false;


  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;

    const overrides = {
      height: 600,
      width: 850,
      classes: [MageMagicAddon.ID + "-sheet", "dialogue"],
      id: "mage-magic-spellcast",
      template: MageMagicAddon.TEMPLATES.SPELLCASTFORM,
      title: "Cast a Spell",
      popOut: true,
      resizable: true,
      minimizable: true,
      closeOnSubmit: false,
      submitOnChange: true,
    };

    classes: ["mta-sheet", "dialogue"],
      console.log("swnr-mage", 26, defaults, overrides);

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  async getData(options) {
    var tokens = null;
    var token = null;
    var magicSkills = [];
    var spells = [];
    var spellsById = {};
    var actorId = "null";
    var actor = {};
    var mageInfo = {};

    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
      actorId = token.document.actor.id;
      actor = game.actors.get(actorId);
      magicSkills = actor.items.contents.filter((i) =>
        filterSkillsBySystem(token, i)
      );

      magicSkills = magicSkills.map((i) => {
        return {
          name: i.name,
          rank: i.system.rank,
          actor: actorId,
        };
      });

      spellsById = actor.items.contents
        .filter((i) => i.type == "power")
        .reduce((acc, i) => {
          acc[i.id] = i;
          return acc;
        }, {});
    }


    mageInfo.gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );
    var mana = new Mana(actor);

    mageInfo.mana = {
      current: mana.getCurrentValue(),
      max: mana.getMax(),
    };

    mageInfo.gnosisData = Gnosis.byRank(mageInfo.gnosis.system.rank);

    var ritualIntervals = [];
    for (var i = 0; i <= 5; i++) {
      ritualIntervals.push({
        id: i,
        name: ((i+1)*mageInfo.gnosisData.ritualInterval.amount) + ' '
          + (mageInfo.gnosisData.ritualInterval.unit == 'hour' ? "Hour" : "Minute")
          + ((i+1)*mageInfo.gnosisData.ritualInterval.amount == 1 ? '' : 's'),
        additionalDice: i,
      });
    }

    var availableArcana = magicSkills.filter((s) => s.name != "Gnosis" && s.rank >= 0);

    var defaultValues = {
      arcanum: [],
      chosenArcanum: [],
      practice: 'compelling',
      practiceData: null,
      'primary-factor': 'potency',
      dicePool: mageInfo.gnosis.system.rank + 1,
      manaCost: 0,
      reach: 0,
      reachMax:0,
      potency: 1,
      freePotency: 1,
      paradoxDice: null,
      "additional-reach": 0,
      "contain-paradox": false,
      "potency-mana": 0,
      duration: '1_turn',
      durationData: null,
      "duration-advanced": false,
      "casting-time": 0,
      "casting-time-advanced": false,
      "casting-time-turns": 1, //advanced only
      "range": "touch",
      "range-advanced": false,
      "scale": "1",
      "scale-advanced": false,
      yantradice: 0,
      "dedicated-tool": false,
    };

    if (this.formData) {
      var flagRegex = new RegExp( MageMagicAddon.ID + "-", "gi");
      for(var k in this.formData) {
        var key = k.replace(flagRegex, '');
        if (key.substring(key.length - 2) == '[]') {
          key = key.substring(0, key.length - 2);
        }
        if (Array.isArray(this.formData[k])) {
          defaultValues[key] = this.formData[k].filter((i) => i);
        } else if (this.formData[k]) {
          defaultValues[key] = this.formData[k];
        }
      }

      if (defaultValues['casting-method'] == 'improvised') {
        defaultValues.manaCost ++;
      }

      //Getting base reach from highest arcanum and practice
      var chosenArcanum = availableArcana.filter((a) => defaultValues.arcanum.indexOf(a.name) != -1);
      var highestArcanum = null;

      if(chosenArcanum.length > 0) {
        highestArcanum = chosenArcanum.sort((a, b) => b.rank - a.rank).shift();
      }

      if (highestArcanum) {
        defaultValues.freePrimaryFactorDice = (parseInt(highestArcanum.rank, 10)) * 2;
        if (defaultValues['primary-factor'] == 'potency') {
          defaultValues.freePotency = parseInt(highestArcanum.rank, 10) + 1;
        }

        //Adjust dice penalty display for durations
        if (defaultValues['primary-factor'] == 'duration') {
          this.spellDurations = this.spellDurations.map((i => {
            if (defaultValues.freePrimaryFactorDice > i.dicePenalty) {
              i.adjustedDicePenalty = 0;
            } else {
              i.adjustedDicePenalty = i.dicePenalty - defaultValues.freePrimaryFactorDice;
            }
            return i;
          }));
        }
      }

      if (defaultValues['casting-method'] != 'rote' && highestArcanum) {
        defaultValues.dicePool += highestArcanum.rank + 1;
      } else if (defaultValues['casting-method'] == 'rote') {
        defaultValues.dicePool += 5;
      }

      defaultValues.practiceData = this.practices.find((p) => p.id == defaultValues.practice);
      defaultValues.durationData = this.spellDurations.find((d) => d.id == defaultValues.duration);
      defaultValues.castTimeData = ritualIntervals.find((d) => d.id == defaultValues['casting-time']);
      defaultValues.rangeData = this.ranges.find((d) => d.id == defaultValues['range']);
      defaultValues.scaleData = this.scales.find((d) => d.id == defaultValues['scale']);

      if (defaultValues.practiceData && highestArcanum) {
        if (defaultValues['casting-method'] != 'rote') {
          defaultValues.reachMax = highestArcanum.rank - defaultValues.practiceData.rank + 1;
        } else {
          defaultValues.reachMax = 4 - defaultValues.practiceData.rank + 1;
        }
      }

      // Potency Dice Pool Mod
      if (defaultValues['primary-factor'] == 'potency') {
        var tempDiceMod = ((defaultValues.potency - 1) * 2);
        if (tempDiceMod > defaultValues.freePrimaryFactorDice) {
          defaultValues.dicePool -= tempDiceMod - defaultValues.freePrimaryFactorDice;
        }
      } else {
        defaultValues.dicePool -= ((defaultValues.potency - 1) * 2)
      }

      // Duration Dice Pool Mod
      if (defaultValues['primary-factor'] == 'duration') {
        defaultValues.dicePool -= this.spellDurations.find(i => i.id == defaultValues.duration).adjustedDicePenalty;
      } else {
        defaultValues.dicePool -= this.spellDurations.find(i => i.id == defaultValues.duration).dicePenalty;
      }
      if (defaultValues.duration == 'indefinite') {
        defaultValues.manaCost++;
        defaultValues.reach++;
      }

      // Casting Time Modifiers
      if (!defaultValues['casting-time-advanced']) {
        defaultValues.dicePool += ritualIntervals[defaultValues['casting-time']].additionalDice;
      }

      //Scale Dice Penalty
      defaultValues.dicePool -= defaultValues.scaleData.dicePenalty;

      //Yantra Dice
      defaultValues.dicePool += defaultValues.yantradice;

      if (defaultValues['additional-reach']) {
        defaultValues.reach += defaultValues['additional-reach'];
      }

      // Adding reach for advanced options
      if (defaultValues['potency-advanced']) {
        defaultValues.reach++;
      }
      if (defaultValues['duration-advanced']) {
        defaultValues.reach++;
      }
      if (defaultValues['casting-time-advanced']) {
        defaultValues.reach++;
      }
      if (defaultValues['range-advanced']) {
        defaultValues.reach++;
      }
      if (defaultValues['scale-advanced']) {
        defaultValues.reach++;
      }

      //Paradox from reach
      if (defaultValues.reach > defaultValues.reachMax) {
        if (defaultValues.paradoxDice === null) {
          defaultValues.paradoxDice = 0;
        }
        defaultValues.paradoxDice += (defaultValues.reach - defaultValues.reachMax);
      }

      if (defaultValues['potency-mana']) {
        defaultValues.manaCost += defaultValues['potency-mana'];
        defaultValues.paradoxDice -= defaultValues['potency-mana'];
      }

      if (defaultValues['dedicated-tool']) {
        defaultValues.paradoxDice -= 2;
      }
    }

    console.log('swnr-mage', 144, magicSkills, defaultValues);

    this.calculatedValues = defaultValues;

    //Validation
    let uncastable = false;
    let castErrors = [];
    if (defaultValues.arcanum.length == 0) {
      uncastable = true;
      castErrors.push('An arcanum must be chosen.');
    }
    if (defaultValues.dicePool < -5) {
      uncastable = true;
      castErrors.push('Dice pool cannot be lower than -5.');
    }
    if (defaultValues.yantradice > 5) {
      uncastable = true;
      castErrors.push('Yantra\'s dice bonus cannot be higher thant 5.');
    }

    return {
      token,
      actor: actorId,
      spellsById,
      flag: MageMagicAddon.ID,
      availableArcana,
      magicSkills,
      mageInfo,
      defaultValues,
      //Field Options
      primaryFactors: this.primaryFactors,
      castingMethods: this.castingMethods,
      spellDurations: this.spellDurations.filter(d => d.advanced == defaultValues['duration-advanced']),
      ritualIntervals,
      ranges: this.ranges.filter(d => d.advanced == defaultValues['range-advanced']),
      scales: this.scales.filter(d => d.advanced == defaultValues['scale-advanced']),
      practices: this.practices.reduce((acc, p) => {
        if (highestArcanum && highestArcanum.rank >= p.rank) {
          acc[p.rank][p.id] = p;
        }
        return acc;
      },[{}, {}, {}, {}, {}]),
      //Validation
      uncastable,
      castErrors,
    };
  }

  // async _handleCastButtonClick(event) {
  //   const clickedElement = $(event.currentTarget);
  //   const rank = clickedElement.data().rank;
  //   const name = clickedElement.data().name;
  //   const actorID = clickedElement.data().actor;
  //   if (actorID) {
  //     const actor = game.actors.get(actorID);

  //     // Construct the Roll instance
  //     let r = new Roll("1d20 + @rank", { rank: rank });

  //     // The parsed terms of the roll formula
  //     console.log(r.terms); // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]

  //     // Execute the roll
  //     await r.evaluate({ async: true });
  //     // let chatData = {
  //     //   type: CONST.CHAT_MESSAGE_TYPES.ROLL,
  //     //   rolls: [r],
  //     //   content: "My HTML Content",
  //     //   //etc.
  //     // };
  //     // ChatMessage.applyRollMode(chatData, "roll");
  //     // ChatMessage.create(chatData);

  //     const rollMode = game.settings.get("core", "rollMode");
  //     var stats = {};
  //     stats[name] = rank;
  //     const data = {
  //       actor: this.actor,
  //       stats,
  //       totalMod: rank,
  //     };
  //     const chatContent = await renderTemplate(
  //       "modules/swnr-space-magic/templates/chat-roll.html",
  //       data
  //     );
  //     const chatMessage = getDocumentClass("ChatMessage");
  //     chatMessage.create(
  //       chatMessage.applyRollMode(
  //         {
  //           speaker: ChatMessage.getSpeaker({ actor: this.actor }),
  //           roll: JSON.stringify(r.toJSON()),
  //           content: chatContent,
  //           type: CONST.CHAT_MESSAGE_TYPES.ROLL,
  //         },
  //         rollMode
  //       )
  //     );

  //     // The resulting equation after it was rolled
  //     console.log(r.result); // 16 + 2 + 4

  //     // The total resulting from the roll
  //     console.log(r.total); // 22

  //     MageMagicAddon.log(true, "Button Clicked!", { name, rank, actor, r });
  //   }
  // }

  async _rollSpell(actor, formVals) {
    let numDice = 2;
    const gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );

    console.log('swnr-mage', 'calculated values', this.calculatedValues);

    let r;
    let paradoxRoll;
    let paradoxDmgRoll;
    let isChanceDie = false;
    let isParadoxChanceDie = false;
    let rolls = [];
    if (this.calculatedValues.dicePool < 1) {
      r = new Roll("1d10cs=8", {dicePool: 1});
      isChanceDie = true;
    } else {
      //pg212
      r = new Roll(this.calculatedValues.dicePool + "d10x10cs>=8", {dicePool: this.calculatedValues.dicePool});
    }

    if (this.calculatedValues.paradoxDice !== null){
      if(this.calculatedValues.paradoxDice > 0) {
        paradoxRoll = new Roll(this.calculatedValues.paradoxDice + "d10x10cs>=8", {dicePool: this.calculatedValues.paradoxDice});
      } else {
        //paradox chance die
        isParadoxChanceDie = true;
        paradoxRoll = new Roll("1d10cs=8", {dicePool: 1});
      }
    }
    console.log("swnr-mage", r.terms);
    await r.evaluate({ async: true });
    rolls.push(r);
    if (paradoxRoll) {
      await paradoxRoll.evaluate({async: true});

      rolls.push(paradoxRoll);
    }

    var successType = 'failure';
    if (isChanceDie && r.dice[0].results[0].result == 1) {
      successType = 'dramafail';
    } else if (r.result >= 5 || (this.calculatedValues['casting-method'] == 'praxis' && r.result >= 3)) {
      successType = 'exceptional';
    } else if (r.result > 0 && ((this.calculatedValues['casting-method'] != 'praxis' && r.result < 5) || (this.calculatedValues['casting-method'] == 'praxis' && r.result < 3))) {
      successType = 'success';
    }

    if (paradoxRoll) {
      var paradoxSuccessType = 'success';
      if (isParadoxChanceDie && paradoxRoll.dice[0].results[0].result == 1) {
        paradoxSuccessType = 'exceptional';
      } else if (paradoxRoll.result >= 5 || (this.calculatedValues['casting-method'] == 'praxis' && paradoxRoll.result >= 3)) {
        paradoxSuccessType = 'dramafail';
      } else if (paradoxRoll.result > 0 && ((this.calculatedValues['casting-method'] != 'praxis' && paradoxRoll.result < 5) || (this.calculatedValues['casting-method'] == 'praxis' && paradoxRoll.result < 3))) {
        paradoxSuccessType = 'failure';
      }

      if (this.calculatedValues['contain-paradox'] && paradoxRoll.result > 0) {
        paradoxDmgRoll = new Roll(paradoxRoll.result + 'd6', {numDice: paradoxRoll.result});
        await paradoxDmgRoll.evaluate({async: true});
        rolls.push(paradoxDmgRoll);
      }
    }

    let data = {
      actor,
      gnosis,
      formVals,
      r,
      paradoxRoll,
      paradoxDmgRoll,
      calculatedValues: this.calculatedValues,
      successType,
      paradoxSuccessType,
    };

    console.log('swnr-mage', 'paradoxRoll', paradoxRoll);
    const chatContent = await renderTemplate(
      MageMagicAddon.TEMPLATES.CHATROLL,
      data
    );

    let chatData = {
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      rolls,
      content: chatContent,
      //etc.
    };

    ChatMessage.applyRollMode(chatData, "roll");
    ChatMessage.create(chatData);

    console.log("swnr-mage", numDice + "d10cs>=8", r);
  }

  async _handleButtonClick(event, actor, html) {
    const clickedElement = $(event.currentTarget);
    const action = clickedElement.data().action;
    const formData = new FormData(html[0]);
    const formVals = Object.fromEntries(formData);

    switch (action) {
      case "cast-spell": {
        console.log("swnr-mage", "casting spell for", actor.name, formVals);
        this._rollSpell(actor, formVals);
        this.render();
        break;
      }

      case "roll-paradox": {
        console.log("swnr-mage", "casting spell for", actor, this, event, html);
        this.render();
        break;
      }

      default:
        MageMagicAddon.log(false, "Invalid action detected", action);
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    var sc = this;
    const formData = $(html).serializeArray();

    console.log('swnr-mage', 'actor', this.actor, this.options);

    html.on("click", "[data-action]", (event) => {
      sc._handleButtonClick(event, this.actor, html);
    });

    html.on("change", ".magic-casting-panel-content-field", (event) => {
      console.log(
        "swnr-mage",
        "activateEventListeners->_updateObject.formData",
        formData,
        html
      );
      // this.formData = formData;
      // sc._updateObject(event, formData).bind(this);
      this.render();
    });
  }

  async _updateObject(event, formData) {

    console.log('swnr-mage', 'updateObject formdata', formData);

    this.formData = formData;

    if (!this.object || !this.object.id) return;

    return this.object.update(formData);
  }
}
