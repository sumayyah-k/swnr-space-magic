import { MageMagicAddon } from "./MageMagicAddon.js";
import {
  filterSkillsBySystem,
  isMtAMage,
  isSwNMage,
} from "./utils.js";
import Mana from "./Models/Mana.js";
import Gnosis from "./Models/Gnosis.js";
import Arcanum from "./Models/Arcanum.js";
import Spell from "./Models/Spell.js";
import Morality from "./Models/Morality.js";

export class SpellcastConfig extends FormApplication {

  constructor(opts, data) {
    super(opts, { submitOnChange: true, closeOnSubmit: false });
    console.log("swnr-mage", "\opts", opts, data);
    console.log("swnr-mage", "OBJECT", this.object);
    console.log("swnr-mage", "actor", this.object);

    this.actorId = data.actorId;
    this.actor = game.actors?.get(data.actorId);
    this.spell = null;

    if (data.spellId) {
      this.spell = this.actor.items.get(data.spellId);
      console.log('swnr-mage', 'spell', this.spell);
    }
    if (data.factorInfo) {
      this.factorInfo = data.factorInfo;
    }

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
      tabs: [
        {
          navSelector: ".magic-casting-spells-nav",
          contentSelector: ".tab-wrap",
          initial: "spells",
        }
      ]
    };
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
    var actor = game.actors?.get(this.actorId);
    var mageInfo = {};

    var arcana = new Arcanum(actor);
    magicSkills = arcana.getAll();

    spellsById = actor.items.contents
      .filter((i) => i.type == "power")
      .reduce((acc, i) => {
        acc[i.id] = i;
        return acc;
      }, {});

    mageInfo.gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );
    var mana = new Mana(actor);

    mageInfo.mana = {
      current: mana.getCurrentValue(),
      max: mana.getMax(),
    };

    mageInfo.gnosisData = Gnosis.byRank(mageInfo.gnosis.system.rank);

    var availableArcana = magicSkills.filter(
      (s) => s.name != "Gnosis" && s.rank >= 0
    );
    var ritualIntervals;

    var unrelinquishedActiveSpells = actor.items.contents.filter(
      (i) =>
        i.type == "power" &&
        i.flags[MageMagicAddon.ID] &&
        i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] &&
        ["mageActiveSpell"].indexOf(
          i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
        ) != -1 &&
        !i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.SPELL_RELINQUISHED]
    ).length;
    console.log("swnr-mage", "unrelinquished Active Spells", {
      unrelinquishedActiveSpells,
      max: mageInfo.gnosis.system.rank + 1,
    });

    var sceneParadox = await actor.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX
    );

    var defaultValues = {
      spell: null,
      spellId: null,
      isTeamwork: false,
      name: "spell",
      arcanum: [],
      chosenArcanum: [],
      "roll-style": "10-again",
      withstand: null,
      "withstand-value": 0,
      totalWithstanding: 0,
      "casting-method": "improvised",
      grimoire: false,
      "self-created": false,
      practice: "compelling",
      practiceData: null,
      "primary-factor": "potency",
      dicePool: mageInfo.gnosis.system.rank + 1,
      diceRoteQuality: false,
      "base-mana-cost": 0,
      manaCost: 0,
      strainCost: 0,
      "spell-reach": [],
      reach: 0,
      reachMax: 0,
      spellReachData: [],
      potency: 1,
      "potency-advanced": false,
      freePotency: 1,
      effectivePotency: 1,
      paradoxDice: null,
      "additional-reach": 0,
      "contain-paradox": false,
      "potency-mana": 0,
      duration: "1_turn",
      durationData: null,
      "duration-advanced": false,
      "casting-time": 0,
      "casting-time-advanced": false,
      "casting-time-turns": 1, //advanced only
      "casting-time-mana-turns": 1, //advanced only
      "show-time-in-a-bottle": magicSkills.find(
        (s) => s.name == "Time" && s.rank >= 3
      )
        ? true
        : false,
      "casting-time-advanced-time-in-a-bottle": false,
      range: "touch",
      "range-advanced": false,
      "know-sympathetic-name": false,
      "sympathetic-strength": null,
      rangeAimedDistances: {
        short: mageInfo.gnosis.system.rank * 10,
        med: mageInfo.gnosis.system.rank * 20,
        long: mageInfo.gnosis.system.rank * 40,
        max: mageInfo.gnosis.system.rank * 80,
      },
      scale: "1",
      "scale-advanced": false,
      "show-space-everywhere": magicSkills.find(
        (s) => s.name == "Space" && s.rank >= 3
      )
        ? true
        : false,
      "scale-advanced-space-everywhere": false,
      yantradice: 0,
      yantras: [],
      maxYantras: false,
      totalDicePenalties: 0,
      yantraNames: [],
      yantraData: [],
      totalYantraBonus: 0,
      effectiveYantraBonus: 0,
      "dedicated-tool": false,
      "spend-willpower": false,
      "additional-dice": 0,
      activeSpellReachPenalty: 0,
    };

    var itemYantras = actor.items.contents
      .filter(
        (i) =>
          i.type == "item" &&
          i.flags[MageMagicAddon.ID] &&
          i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.MTA_SPELL_IS_YANTRA]
      )
      .map((i) => {
        return {
          id: i.id,
          name: i.name,
          type: "custom",
          bonus:
            i.flags[MageMagicAddon.ID][
              MageMagicAddon.FLAGS.MTA_SPELL_YANTRA_BONUS
            ],
          desc: i.system.description,
        };
      });

    var reachOptions = [];

    if (this.spell) {
      console.log("swnr-mage", "spell", this.spell);
      defaultValues.name = this.spell.name;
      defaultValues.spell = this.spell;
      defaultValues.spellId = this.spell.id;
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_IS_ROTE
        )
      ) {
        defaultValues["casting-method"] = "rote";
      } else if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_IS_PRAXIS
        )
      ) {
        defaultValues["casting-method"] = "praxis";
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_ARCANUM
        )
      ) {
        defaultValues.arcanum = [
          this.spell.getFlag(
            MageMagicAddon.ID,
            MageMagicAddon.FLAGS.MTA_SPELL_ARCANUM
          ),
        ];
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_PRACTICE
        )
      ) {
        defaultValues.practice = this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_PRACTICE
        );
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_PRIMARY_FACTOR
        )
      ) {
        defaultValues["primary-factor"] = this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_PRIMARY_FACTOR
        );
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_WITHSTAND
        )
      ) {
        defaultValues["withstand"] = this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_WITHSTAND
        );
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.SPELL_MANA_COST
        )
      ) {
        defaultValues["base-mana-cost"] = this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.SPELL_MANA_COST
        );
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.SPELL_DMG_DICE
        )
      ) {
        defaultValues["damage-dice"] = this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.SPELL_DMG_DICE
        );
      }
      if (
        this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_REACH
        )
      ) {
        var spellReachOpts = this.spell.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.MTA_SPELL_REACH
        );
        var reachArcanaOpts = arcana.getAll(true);
        for (var r of spellReachOpts) {
          r.disabled = false;
          if (r.variant == "addon") {
            var arcanum = reachArcanaOpts.find(
              (a) => a.id == r.prereq.key || a.name == r.prereq.key
            );
            r.arcanum = arcanum;
            if (!arcanum || (arcanum.id != 'any' && arcanum.rank < parseInt(r.prereq.dots, 10))) {
              r.disabled = true;
            }
          }
          reachOptions.push(r);
        }
      }
    }

    if (this.factorInfo) {
      defaultValues.isTeamwork = true;
      defaultValues.chosenArcanum = this.factorInfo.arcanum;
      defaultValues.practice = this.factorInfo.practice;

      defaultValues.potency = this.factorInfo.factors.potency;
      if (this.factorInfo.factors["potency-advanced"]) {
        defaultValues["potency-advanced"] = true;
      }

      defaultValues.duration = this.factorInfo.factors.duration;
      defaultValues.durationData = Spell.spellDurations.find(d => d.id == this.factorInfo.factors.duration);
      if (defaultValues.durationData && defaultValues.durationData.advanced) {
        defaultValues["duration-advanced"] = true;
      }

      defaultValues["casting-time"] = this.factorInfo.factors["casting-time"];
      if (this.factorInfo.factors["casting-time"] == 0) {
        defaultValues["casting-time-advanced"] = true;
      }

      defaultValues.range = this.factorInfo.factors.range;
      var rangeData = Spell.ranges.find(d => d.id == this.factorInfo.factors.range);
      if (rangeData && rangeData.advanced) {
        defaultValues["range-advanced"] = true;
      }

      defaultValues.scale = this.factorInfo.factors.scale;
      var scaleData = Spell.scales.find(d => d.id == this.factorInfo.factors.scale);
      if (scaleData && scaleData.advanced) {
        defaultValues["scale-advanced"] = true;
      }

      defaultValues["spell-reach"] = this.factorInfo["spell-reach"];
    }

    if (this.formData) {
      var flagRegex = new RegExp(MageMagicAddon.ID + "-", "gi");
      for (var k in this.formData) {
        var key = k.replace(flagRegex, "");
        if (key.substring(key.length - 2) == "[]") {
          key = key.substring(0, key.length - 2);
        }
        if (Array.isArray(this.formData[k])) {
          defaultValues[key] = this.formData[k].filter((i) => i);
        } else if (this.formData[k]) {
          defaultValues[key] = this.formData[k];
        }
      }
    } else {
      ritualIntervals = Gnosis.getRitualIntervals(mageInfo.gnosis.system.rank);
    }

    // Add stuff for spell's addons, doing it here, before, arcanum stuff, so that all calculates correctly
    if (defaultValues["spell-reach"]) {
      if (!Array.isArray(defaultValues["spell-reach"])) {
        defaultValues["spell-reach"] = [defaultValues["spell-reach"]];
      }
      defaultValues["spell-reach"] = defaultValues["spell-reach"].map((i) =>
        parseInt(i, 10)
      );
      for (var r of defaultValues["spell-reach"]) {
        defaultValues.spellReachData.push(reachOptions[r]);
        if (reachOptions[r].variant == "reach") {
          defaultValues.reach += parseInt(reachOptions[r].reachCost, 10);
        } else if (reachOptions[r].variant == "addon") {
          defaultValues.arcanum.push(reachOptions[r].prereq.key);
        }
        if (reachOptions[r].manaCost && parseInt(reachOptions[r].manaCost, 10)) {
          defaultValues.manaCost += parseInt(reachOptions[r].manaCost, 10);
        }
        if (reachOptions[r].strainCost && parseInt(reachOptions[r].strainCost, 10)) {
          defaultValues.strainCost += parseInt(reachOptions[r].strainCost, 10);
        }

      }
    }

    //Getting base reach from highest arcanum and practice
    var chosenArcanum = availableArcana.filter(
      (a) => defaultValues.arcanum.indexOf(a.name) != -1
    );
    var highestArcanum = null;

    if (chosenArcanum.length > 0) {
      highestArcanum = chosenArcanum.sort((a, b) => b.rank - a.rank).shift();
    }

    //Add reach if changing primary factor of spell
    if (this.spell) {
      var pfactor = this.spell.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.MTA_SPELL_PRIMARY_FACTOR
      );
      if (defaultValues["primary-factor"] != pfactor) {
        defaultValues.reach++;
      }
    }

    //Add Reach for active spell penalty
    console.log(
      "swnr-mage",
      "activeSpellReachPenalty duration",
      defaultValues.duration
    );
    if (defaultValues.duration != "1_turn") {
      defaultValues.activeSpellReachPenalty =
        unrelinquishedActiveSpells >= mageInfo.gnosis.system.rank + 1
          ? unrelinquishedActiveSpells - mageInfo.gnosis.system.rank
          : 0;
      console.log(
        "swnr-mage",
        "activeSpellReachPenalty",
        defaultValues.activeSpellReachPenalty
      );
      defaultValues.reach += defaultValues.activeSpellReachPenalty;
    }

    defaultValues.manaCost += defaultValues['base-mana-cost'];

    this.spellDurations = Spell.spellDurations;
    if (highestArcanum) {
      // Improvised Casting mana cost
      if (
        defaultValues["casting-method"] == "improvised" &&
        highestArcanum.importance != "ruling"
      ) {
        defaultValues.manaCost++;
      }

      //Calculate free potency from highest arcanum
      defaultValues.freePrimaryFactorDice =
        parseInt(highestArcanum.rank, 10) * 2;
      if (defaultValues["primary-factor"] == "potency") {
        defaultValues.freePotency = parseInt(highestArcanum.rank, 10) + 1;
      }

      //Adjust dice penalty display for durations
      if (defaultValues["primary-factor"] == "duration") {
        this.spellDurations = Spell.spellDurations.map((i) => {
          if (defaultValues.freePrimaryFactorDice > i.dicePenalty) {
            i.adjustedDicePenalty = 0;
          } else {
            i.adjustedDicePenalty =
              i.dicePenalty - defaultValues.freePrimaryFactorDice;
          }
          return i;
        });
      }
    }

    defaultValues.dicePool += parseInt(defaultValues["additional-dice"], 10);

    if (defaultValues["casting-method"] != "rote" && highestArcanum) {
      defaultValues.dicePool += highestArcanum.rank + 1;
    } else if (defaultValues["casting-method"] == "rote") {
      defaultValues.dicePool += 5;
    }

    // Get array of ritua intervals
    ritualIntervals = Gnosis.getRitualIntervals(
      mageInfo.gnosis.system.rank,
      defaultValues.grimoire
    );

    // reset casting time if not valid with grimoire
    if (
      defaultValues["casting-method"] == "rote" &&
      defaultValues.grimoire &&
      defaultValues["casting-time-advanced"]
    ) {
      defaultValues["casting-time"] = 0;
      defaultValues["casting-time-advanced"] = false;
    }

    //Get data for factors
    defaultValues.practiceData = Spell.practices.find(
      (p) => p.id == defaultValues.practice
    );
    defaultValues.durationData = this.spellDurations.find(
      (d) => d.id == defaultValues.duration
    );
    defaultValues.castTimeData = ritualIntervals.find(
      (d) => d.id == defaultValues["casting-time"]
    );
    defaultValues.rangeData = Spell.ranges.find(
      (d) => d.id == defaultValues["range"]
    );
    defaultValues.scaleData = Spell.scales.find(
      (d) => d.id == defaultValues["scale"]
    );

    if (defaultValues.practiceData && highestArcanum) {
      if (defaultValues["casting-method"] != "rote") {
        defaultValues.reachMax =
          highestArcanum.rank - defaultValues.practiceData.rank + 1;
      } else {
        defaultValues.reachMax = 4 - defaultValues.practiceData.rank + 1;
      }
    }

    // Rote quality roll for grimoire and self created spells
    if (
      defaultValues["casting-method"] == "rote" &&
      (defaultValues.grimoire || defaultValues["self-created"])
    ) {
      defaultValues.diceRoteQuality = true;
    }

    // Potency Dice Pool Mod
    if (defaultValues["primary-factor"] == "potency") {
      var tempDiceMod = (defaultValues.potency - 1) * 2;
      if (tempDiceMod > defaultValues.freePrimaryFactorDice) {
        defaultValues.dicePool -=
          tempDiceMod - defaultValues.freePrimaryFactorDice;
        defaultValues.totalDicePenalties +=
          tempDiceMod - defaultValues.freePrimaryFactorDice;
      }
    } else {
      defaultValues.dicePool -= (defaultValues.potency - 1) * 2;
      defaultValues.totalDicePenalties += (defaultValues.potency - 1) * 2;
    }

    // Duration Dice Pool Mod
    if (defaultValues["primary-factor"] == "duration") {
      defaultValues.dicePool -= this.spellDurations.find(
        (i) => i.id == defaultValues.duration
      ).adjustedDicePenalty;
      defaultValues.totalDicePenalties += this.spellDurations.find(
        (i) => i.id == defaultValues.duration
      ).adjustedDicePenalty;
    } else {
      defaultValues.dicePool -= this.spellDurations.find(
        (i) => i.id == defaultValues.duration
      ).dicePenalty;
      defaultValues.totalDicePenalties += this.spellDurations.find(
        (i) => i.id == defaultValues.duration
      ).dicePenalty;
    }
    if (defaultValues.duration == "indefinite") {
      defaultValues.manaCost++;
      defaultValues.reach++;
    }

    // Casting Time Modifiers
    if (!defaultValues["casting-time-advanced"]) {
      defaultValues.dicePool +=
        ritualIntervals[defaultValues["casting-time"]].additionalDice;
    }

    //Scale Dice Penalty
    defaultValues.dicePool -= defaultValues.scaleData.dicePenalty;
    defaultValues.totalDicePenalties += defaultValues.scaleData.dicePenalty;

    //Yantra Dice
    var yantradice = parseInt(defaultValues.yantradice, 10);
    var count = 0;
    for (var vkey of defaultValues.yantras) {
      let yantra = [...Spell.commonYantras, ...itemYantras].find(
        (y) => y.id == vkey
      );

      if (yantra) {
        defaultValues.yantraNames.push(
          yantra.name + " (+" + yantra.bonus + ")"
        );
        defaultValues.yantraData.push(yantra);
        console.log("swnr-mage", "yantra-bonus", vkey, yantra.bonus);
        yantradice += yantra.bonus;
      }

      if (vkey == "dedicatedTool") {
        defaultValues["dedicated-tool"] = true;
      }

      if (count != 0) {
        defaultValues["casting-time-turns"]++;
      }
      count++;
    }

    defaultValues.totalYantraBonus = yantradice;
    defaultValues.effectiveYantraBonus = yantradice;
    if (yantradice - parseInt(defaultValues.totalDicePenalties, 10) > 5) {
      defaultValues.effectiveYantraBonus = 5 + defaultValues.totalDicePenalties;
    }

    defaultValues.maxYantras =
      defaultValues.yantras.length >= mageInfo.gnosisData.yantras;

    defaultValues.dicePool += defaultValues.effectiveYantraBonus;

    // Willpower bonus
    if (defaultValues["spend-willpower"]) {
      defaultValues.dicePool += 3;
      defaultValues.strainCost += 1;
    }

    if (defaultValues["additional-reach"]) {
      defaultValues.reach += defaultValues["additional-reach"];
    }

    // Adding reach for advanced options
    if (defaultValues["potency-advanced"]) {
      defaultValues.reach++;
    }
    if (defaultValues["duration-advanced"]) {
      defaultValues.reach++;
    }
    if (defaultValues["casting-time-advanced"]) {
      if (defaultValues["casting-time-advanced-time-in-a-bottle"]) {
        defaultValues.manaCost++;
      } else {
        defaultValues.reach++;
      }
    }
    if (defaultValues["range-advanced"]) {
      defaultValues.reach++;
    }
    if (defaultValues["scale-advanced"]) {
      if (defaultValues["scale-advanced-space-everywhere"]) {
        defaultValues.manaCost++;
      } else {
        defaultValues.reach++;
      }
    }

    // Range considerations
    defaultValues.sympatheticStrengthData = null;
    if (defaultValues["range-advanced"]) {
      if (defaultValues.range == "remote") {
        defaultValues.reach++;
      }
      if (
        defaultValues.range == "sympathetic" ||
        defaultValues.range == "temporal"
      ) {
        defaultValues.manaCost++;
        if (!defaultValues["know-sympathetic-name"]) {
          defaultValues.reach++;
        }


        if (!defaultValues["sympathetic-strength"]) {
          defaultValues["sympathetic-strength"] = "weak";
        }
        if (defaultValues["sympathetic-strength"]) {
          defaultValues.sympatheticStrengthData = Spell.remoteWithstanding.find(
            (s) => s.id == defaultValues["sympathetic-strength"]
          );
          // Add withstanding
          defaultValues.totalWithstanding +=
            defaultValues.sympatheticStrengthData.withstandRange;
        }
      }
    }

    //Effective Potency
    if (defaultValues["withstand-value"]) {
      defaultValues.totalWithstanding += defaultValues["withstand-value"];
    }
    defaultValues.effectivePotency =
      defaultValues.potency - defaultValues.totalWithstanding;

    //Paradox from reach
    if (defaultValues.reach > defaultValues.reachMax) {
      if (defaultValues.paradoxDice === null) {
        defaultValues.paradoxDice = 0;
      }
      defaultValues.paradoxDice +=
        (defaultValues.reach - defaultValues.reachMax) *
        mageInfo.gnosisData.paradox;
    }

    if (defaultValues["potency-mana"]) {
      defaultValues.manaCost += defaultValues["potency-mana"];
      defaultValues.paradoxDice -= defaultValues["potency-mana"];
    }

    if (defaultValues.paradoxDice && defaultValues["dedicated-tool"]) {
      defaultValues.paradoxDice -= 2;
    }

    if (defaultValues.paradoxDice !== null && sceneParadox) {
      defaultValues.paradoxDice += sceneParadox;
    }

    defaultValues["casting-time-mana-turns"] = Math.ceil(defaultValues.manaCost / mageInfo.gnosisData.mana.perTurn);

    if (defaultValues["casting-time-mana-turns"] > defaultValues["casting-time-turns"]) {
      defaultValues["casting-time-turns"] = defaultValues["casting-time-mana-turns"];
    }

    this.calculatedValues = defaultValues;

    //Validation
    let uncastable = false;
    let castErrors = [];
    if (defaultValues.arcanum.length == 0) {
      uncastable = true;
      castErrors.push("An arcanum must be chosen.");
    }
    if (defaultValues.dicePool < -5) {
      uncastable = true;
      castErrors.push("Dice pool cannot be lower than -5.");
    }
    if (defaultValues.potency <= defaultValues.totalWithstanding) {
      uncastable = true;
      castErrors.push("Potency not high enough to overcome withstanding.");
    }
    if (
      defaultValues["range-advanced"] &&
      (defaultValues.range == "sympathetic" ||
        defaultValues.range == "temporal") &&
      [
        "materialSympathy",
        "representationalSympathy",
        "symbolicSympathy",
      ].filter(function (val) {
        return defaultValues.yantras.indexOf(val) !== -1;
      }).length == 0
    ) {
      uncastable = true;
      castErrors.push(
        (defaultValues.range == "sympathetic"
          ? "Sympathetic range"
          : "Temporal sympathy") + " requires a sympathy yantra."
      );
    }

    return {
      token,
      actor: actor,
      spellsById,
      flag: MageMagicAddon.ID,
      availableArcana,
      magicSkills,
      mageInfo,
      defaultValues,
      //Field Options
      primaryFactors: Spell.primaryFactors,
      castingMethods: Spell.castingMethods,
      spellDurations: Spell.spellDurations.filter(
        (d) => d.advanced == defaultValues["duration-advanced"]
      ),
      ritualIntervals,
      ranges: Spell.ranges.filter(
        (d) => d.advanced == defaultValues["range-advanced"]
      ),
      scales: Spell.scales.filter(
        (d) => d.advanced == defaultValues["scale-advanced"]
      ),
      practices: Spell.rankedPractices(highestArcanum),
      yantras: [...Spell.commonYantras, ...itemYantras],
      reachOptions,
      //Validation
      uncastable,
      castErrors,
      sympatheticRanges: ["sympathetic", "temporal"],
      remoteWithstanding: Spell.remoteWithstanding.filter(
        (s) => s.type == defaultValues.range
      ),
      diceSizes: Spell.diceSizes,
      sceneParadox,
    };
  }

  async _rollSpell(actor, formVals) {
    let numDice = 2;
    const gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );

    console.log('swnr-mage', 'calculated values', this.calculatedValues);

    let r;
    let paradoxRoll;
    let wisdomRoll;
    let paradoxDmgRoll;
    let aimedRoll;
    let damageRoll;
    let isChanceDie = false;
    let isParadoxChanceDie = false;
    let rolls = [];
    if (this.calculatedValues.dicePool < 1) {
      r = new Roll("1d10cs=8", {dicePool: 1});
      isChanceDie = true;
    } else if (
      this.calculatedValues.diceRoteQuality ||
      this.calculatedValues['roll-style'] == 'rote'
    ) {
      r = new Roll(this.calculatedValues.dicePool + "d10xo<8x10cs>=8", {
        dicePool: this.calculatedValues.dicePool,
      });
    } else {
      var explode = 10;
      switch (this.calculatedValues["roll-style"]) {
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
      r = new Roll(this.calculatedValues.dicePool + "d10x>=" + explode + "cs>=8", {
        dicePool: this.calculatedValues.dicePool,
      });
    }

    if (this.calculatedValues.paradoxDice !== null) {
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

      var wisdom = await Morality.getValue(actor);
      wisdomRoll = new Roll(wisdom + 'd10x=10cs>=8', {});
      await wisdomRoll.evaluate({ async: true });

      rolls.push(wisdomRoll);
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
      var paradoxDmgPool = paradoxRoll.result;

      if (wisdomRoll) {
        paradoxDmgPool -= wisdomRoll.result;
      }

      var paradoxSuccessType = 'success';
      if (isParadoxChanceDie && paradoxRoll.dice[0].results[0].result == 1) {
        paradoxSuccessType = 'exceptional';
      } else if (paradoxDmgPool >= 5 || (this.calculatedValues['casting-method'] == 'praxis' && paradoxDmgPool >= 3)) {
        paradoxSuccessType = 'dramafail';
      } else if (paradoxDmgPool > 0 && ((this.calculatedValues['casting-method'] != 'praxis' && paradoxDmgPool < 5) || (this.calculatedValues['casting-method'] == 'praxis' && paradoxDmgPool < 3))) {
        paradoxSuccessType = 'failure';
      }

      if (this.calculatedValues['contain-paradox'] && paradoxDmgPool > 0) {
        paradoxDmgRoll = new Roll(paradoxDmgPool + 'd4', {numDice: paradoxDmgPool});
        await paradoxDmgRoll.evaluate({async: true});
        rolls.push(paradoxDmgRoll);
      }

      var sceneParadox = await actor.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX
      );
      actor.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX,
        sceneParadox && sceneParadox > 0 ? sceneParadox + 1 : 1
      );
    }

    if (this.calculatedValues.range == 'aimed') {
      var stat = actor.system.stats.dex.mod; //actor dex mod
      var skill = actor.items.find(i => i.type == 'skill' && i.name=='Shoot'); //actor shoot ranks
      var attackBonus = actor.system.ab;
      var skillRanks;
      if (skill) {
        skillRanks = skill.system.rank;
      }
      aimedRoll = new Roll('1d20+@stat+@skill+@attackBonus', {stat, skill: skillRanks, attackBonus});

      await aimedRoll.evaluate({async: true});

      rolls.push(aimedRoll);
    }

    if (this.calculatedValues["damage-dice"] != 'none') {
      damageRoll = new Roll(this.calculatedValues.potency + this.calculatedValues["damage-dice"], {});

      await damageRoll.evaluate({ async: true });

      rolls.push(damageRoll);
    }

    // Deduct Stuff
    var doUpdate = false;
    var doReload = false;
    var updateData = {data:{}};

    if (this.calculatedValues.strainCost) {
      doUpdate = true;
      updateData.data.systemStrain = {
        value: actor.data.data.systemStrain.value + this.calculatedValues.strainCost
      };
    }

    if (this.calculatedValues.manaCost) {
      var mana = new Mana(actor);
      mana.decrement();
    }

    if(doUpdate) {
      await actor.update(updateData);
      doReload = true;
    }

    if (doReload) {
      Hooks.call('reRenderMageActorSheet', actor.id);
    }


    const activeSpellInfo = {
      arcanum: this.calculatedValues.arcanum,
      practice: this.calculatedValues.practice,
      "spell-reach": this.calculatedValues["spell-reach"],
      factors: {
        potency: this.calculatedValues.potency,
        "potency-advanced": this.calculatedValues["potency-advanced"],
        duration: this.calculatedValues.duration,
        // 'duration-advanced': this.calculatedValues['duration-advanced'],
        "casting-time": this.calculatedValues["casting-time"],
        // 'casting-time-advanced': this.calculatedValues['casting-time-advanced'],
        range: this.calculatedValues.range,
        // 'range-advanced': this.calculatedValues['range-advanced'],
        scale: this.calculatedValues.scale,
        // 'scale-advanced': this.calculatedValues['scale-advanced'],
      },
    };

    let data = {
      actor,
      gnosis,
      formVals,
      r,
      paradoxRoll,
      wisdomRoll,
      paradoxDmgRoll,
      aimedRoll,
      damageRoll,
      calculatedValues: this.calculatedValues,
      successType,
      paradoxSuccessType,
      activeSpellInfo: JSON.stringify(activeSpellInfo),
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
      // console.log(
      //   "swnr-mage",
      //   "activateEventListeners->_updateObject.formData",
      //   formData,
      //   html
      // );
      // this.formData = formData;
      // sc._updateObject(event, formData).bind(this);
      this.render();
    });
  }

  async _updateObject(event, formData) {

    console.log('swnr-mage', 'spellcastconfig updateObject formdata', formData);

    this.formData = formData;

    if (!this.object || !this.object.id) return;

    return this.object.update(formData);
  }
}
