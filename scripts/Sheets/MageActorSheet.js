import { MageMagicAddon } from "../MageMagicAddon.js";
import {CharacterActorSheet} from "../../../../systems/swnr/module/actors/character-sheet.js";
import { SpellcastConfig } from "../SpellcastConfig.js";
import {
  isMtAMage,
  isArcanist,
  isMagister,
  isSwNMage,
  isPsychic,
  getActorClasses,
} from "../utils.js";
import SpellSlots from '../Models/SpellSlots.js';
import Mana from "../Models/Mana.js";
import Arcanum from "../Models/Arcanum.js";
import Gnosis from "../Models/Gnosis.js";
import Morality from "../Models/Morality.js";
import { RollCod } from "../RollCod.js";
import { RollSwnr } from "../RollSwnr.js";
import { ChallengeMorality } from "../ChallengeMorality.js";

export default class MageActorSheet extends CharacterActorSheet {
  activeMageSightArcana = [];
  combatRollSkills = [];

  static get defaultOptions() {
    const sup = super.defaultOptions;
    // console.log("swnr-mage", "defaultOpts", sup, this.options);

    return foundry.utils.mergeObject(sup, {
      classes: ["swnr-space-magic-actor-sheet", "sheet", "actor", "character"],
      scrollY: [".sheet-body"],
      width: 880,
      height: 600,
      tabs: [
        {
          navSelector: ".pc-sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "combat",
        },
        {
          navSelector: ".magic-casting-spells-nav",
          contentSelector: ".magic-casting-spell-level-panels",
          initial: "spell-factors",
        },
      ],
    });
  }

  _injectHTML(html) {
    super._injectHTML(html);
    html
      .find(".window-content")
      .removeClass(["cq", "overflow-y-scroll", "relative"]);
    // console.log(
    //   "swnr-mage",
    //   "window-content classes",
    //   html.find(".window-content")
    // );
  }

  get template() {
    return MageMagicAddon.TEMPLATES.ACTORSHEET;
  }
  //
  async getData(options) {
    var data = await super.getData(options);

    var magicSkills = [];
    var spells = [];
    var attainments = [];
    var activeSpells = [];
    var spellsById = {};
    var actorId = null;
    var actor = {};
    var numSpellSlots = {};
    var spellSlotsByLevel = null;
    actor = this.object;
    const swNMage = await isSwNMage(actor);
    const mtAMage = await isMtAMage(actor);
    const hasEffort = await isPsychic(actor);
    const classes = actor.items.contents
      .filter((i) => i.type == "class")
      .map((i) => i.name);
    const spellFilterArcanum = await this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.ACTOR_SPELL_FILTER_ARCANUM
    );
    const sceneParadox = await this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX
    );
    var unrelinquishedActiveSpells = this.object.items.contents.filter(
      (i) =>
        i.type == "power" &&
        i.flags[MageMagicAddon.ID] &&
        i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] &&
        ["mageActiveSpell"].indexOf(
          i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
        ) != -1 &&
        !i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.SPELL_RELINQUISHED]
    ).length;
    const morality = await Morality.getValue(this.object);
    var showMorality = false;
    const moralityLabel = await Morality.getLabel(this.object);
    const moralityBtnLabel = await Morality.getChallengeBtnLabel(this.object);

    /** FORMS */
    const formFoci = this.object.items.contents.filter(
      (i) =>
        i.type == "focus" &&
        i.flags[MageMagicAddon.ID] &&
        i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_FOCUS_TYPE] &&
        i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_FOCUS_TYPE] == 'altForm'
    );
    const activeForm = await this.object.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.ACTOR_ACTIVE_FORM
    );
    const activeFormData = activeForm ? formFoci.find(i => i.id == activeForm) : null;

    let powers = this.object.items.contents.filter(
      (i) =>
        i.type == "power"
    );
    if (activeForm) {
      powers = powers.filter(i => {
        return (
          formFoci.map(i => i.name).indexOf(i.system.source) == -1 ||
          i.system.source == activeFormData.name
        );
      });
    }

    // INVENTORY TAB
    const fixSkill = this.object.items.contents.find((i) => i.type == 'skill' && i.name == 'Fix');
    const showMods = fixSkill && fixSkill.system.rank >= 1;
    const numReadied = this.object.items.contents.filter((i) => ["item", "armor", "weapon"].indexOf(i.type) != -1 && i.system.location == "readied").length;
    const numStowed = this.object.items.contents.filter((i) => ["item", "armor", "weapon"].indexOf(i.type) != -1 && i.system.location == "stowed").length;
    const numMods = this.object.items.contents.filter((i) => i.type == "item" && i.system.location == "mod").length;


    actorId = actor.id;
    var arcana = new Arcanum(actor);
    magicSkills = arcana.getAll();

    spells = powers
      .filter((i) => {
        // console.log("swnr-mage", "spell check", i.name, i.flags);
        return (
          i.type == "power" &&
          i.flags[MageMagicAddon.ID] &&
          i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] &&
          ["spell", "mageSpell"].indexOf(
            i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
          ) != -1 &&
          ((spellFilterArcanum &&
            i.flags[MageMagicAddon.ID][
              MageMagicAddon.FLAGS.MTA_SPELL_ARCANUM
            ] == spellFilterArcanum) ||
            !spellFilterArcanum)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((acc, i) => {
        if (!acc.hasOwnProperty(i.system.level)) {
          acc[i.system.level] = [];
        }
        acc[i.system.level.toString()].push(i);
        acc[i.system.level.toString()].sort((a, b) => b.sort - a.sort);
        return acc;
      }, {});

    attainments = powers
      .filter((i) => {
        return (
          i.type == "power" &&
          i.flags[MageMagicAddon.ID] &&
          i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] &&
          ["attainment"].indexOf(
            i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
          ) != -1
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((acc, i) => {
        if (!acc.hasOwnProperty(i.system.level)) {
          acc[i.system.level] = [];
        }
        acc[i.system.level.toString()].push(i);
        acc[i.system.level.toString()].sort((a, b) => b.sort - a.sort);
        return acc;
      }, {});

    spellsById = powers
      .filter((i) => i.type == "power")
      .reduce((acc, i) => {
        acc[i.id] = i;
        return acc;
      }, {});

    if (swNMage) {
      // Filter out powers that show up in the magic tab
      powers = powers.filter(
        (i) =>
          !i.flags[MageMagicAddon.ID] ||
          !i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] ||
          (i.flags[MageMagicAddon.ID] &&
            i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] &&
            ["spell"].indexOf(
              i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
            ) == -1)
      );

      const spellSlots = await SpellSlots.getForActor(this.object);
      var chClasses = await getActorClasses(this.object);
      const maxSpellSlots = await SpellSlots.getMaxSpellSlots(actor);

      for(var chClass in maxSpellSlots) {
        if (chClasses.findIndex(c => c.name == chClass) != -1) {
          for (var lvl in maxSpellSlots[chClass]) {
            if (!numSpellSlots[chClass]) {
              numSpellSlots[chClass] = {};
            }
            var available = Object.values(spellSlots).filter(
              (i) => i.class == chClass && i.level == lvl && !i.isUsed
            ).length;
            if (maxSpellSlots[chClass][lvl] > 0 || available > 0) {
              numSpellSlots[chClass][lvl] = {
                available,
                max: maxSpellSlots[chClass][lvl],
              };
            }
          }
        }
      }

      spellSlotsByLevel = Object.values(spellSlots).reduce((acc, i) => {
        var chClass = i.class.toLowerCase().trim();
        var level = parseInt(i.level, 10);

        if (!acc[chClass]) {
          acc[chClass] = {};
        }
        if (!acc[chClass][level]) {
          acc[chClass][level] = [];
        }

        acc[chClass][level].push(i);

        return acc;
      }, {});
    }

    var defaultValues = {};

    const strain = actor.system.systemStrain;
    var mageInfo = {};
    if (mtAMage) {
      // Filter out powers that show up in the magic tab
      powers = powers.filter(
        (i) =>
          !i.flags[MageMagicAddon.ID] ||
          !i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] ||
            (i.flags[MageMagicAddon.ID] &&
              i.flags[MageMagicAddon.ID][
                MageMagicAddon.FLAGS.ITEM_POWER_TYPE
              ] &&
              ["mageSpell", "mageActiveSpell", "attainment"].indexOf(
                i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
              ) == -1
            )
      );
      showMorality = true;
      activeSpells = actor.items.contents.filter((i) => {
        console.log("swnr-mage", "spell check", i.name, i.flags);
        return (
          i.type == "power" &&
          i.flags[MageMagicAddon.ID] &&
          i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE] &&
          ["mageActiveSpell"].indexOf(
            i.flags[MageMagicAddon.ID][MageMagicAddon.FLAGS.ITEM_POWER_TYPE]
          ) != -1
        );
      });

      mageInfo.gnosis = actor.items.find(
        (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
      );
      var gnosisRank = mageInfo.gnosis ? mageInfo.gnosis.system.rank : 0;
      mageInfo.gnosisData = mageInfo.gnosis ? Gnosis.byRank(gnosisRank) : null;
      mageInfo.maxSafeRolls = gnosisRank;
      mageInfo.scrutinyPenalty = Math.ceil((gnosisRank + 1) / 2);
      var mana = new Mana(actor);
      var arcana = new Arcanum(actor);
      var allArcana = arcana.getAll();
      var focusedArcanum = null;
      var activeArcanum = [];
      if (allArcana && allArcana.length > 0) {
        var rulingArcana = allArcana.filter((a) => a.importance == "ruling");
        if (rulingArcana.length > 0) {
          focusedArcanum = rulingArcana[0].name;
          activeArcanum = rulingArcana.map((a) => a.name);
        }
      }

      mageInfo.mana = {
        current: mana.getCurrentValue(),
        max: mana.getMax(),
      };

      //Add MtA default values
      defaultValues = {
        ...defaultValues,
        ...{
          "focused-mage-sight-arcanum": focusedArcanum,
          "mage-sight-arcana": activeArcanum,
          activeManaCost: 0,
          activeDuration: gnosisRank + 1,
        },
      };

      //Update with chosen form values
      if (this.formData) {
        defaultValues["focused-mage-sight-arcanum"] =
          this.formData["focused-mage-sight-arcanum"];
        defaultValues["mage-sight-arcana"] = this.activeMageSightArcana;
      }

      //Active mage sight mana cost adjustments
      for (var a of defaultValues["mage-sight-arcana"]) {
        var arcanum = allArcana.find((i) => i.name == a);
        console.log("swnr-mage", "arcanum", arcanum);
        if (arcanum.importance != "ruling") {
          defaultValues.activeManaCost++;
        }
      }
    }

    this.calculatedValues = defaultValues;

    var themeDefaults = {
      layout: "default",
    };

    var themePrefs = actor.getFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.ACTOR_SHEET_THEME
    );
    if (!themePrefs) {
      themePrefs = {};
    }

    return {
      ...data,
      ...{
        classes,
        showMods,
        numReadied,
        numStowed,
        numMods,
        magicSkills,
        numSpellSlots,
        spellSlotsByLevel,
        spellSlotsByLevel,
        spells,
        spellsById,
        activeSpells,
        attainments,
        isArcanist: await isArcanist(actor),
        isMagister: await isMagister(actor),
        hasEffort,
        isSwNMage: swNMage,
        mtAMage,
        showMagicTab: swNMage || mtAMage ? true : false,
        flag: MageMagicAddon.FLAGS.ID + "-" + MageMagicAddon.FLAGS.SPELLSLOTS,
        strain,
        mageInfo,
        defaultValues,
        theme: { ...themeDefaults, ...themePrefs },
        combatRollSkills: this.combatRollSkills,
        spellFilterArcanum,
        unrelinquishedActiveSpells,
        maxActiveSpells:
          mageInfo && mageInfo.gnosis ? mageInfo.gnosis.system.rank + 1 : 0,
        morality,
        showMorality,
        moralityLabel,
        moralityBtnLabel,
        skillsSorted: this.object.items
          .filter((i) => i.type == "skill")
          .reduce((acc, i) => {
            var cat = "physical";
            if (
              [
                "Administer",
                "Connect",
                "Lead",
                "Perform",
                "Talk",
                "Trade",
              ].indexOf(i.name) != -1
            ) {
              cat = "social";
            } else if (
              ["Program", "Know", "Notice", "Heal", "Fix"].indexOf(i.name) != -1
            ) {
              cat = "mental";
            } else if (
              arcana.names.indexOf(i.name) != -1 ||
              ["Gnosis", "Sunblade", "Know Magic", "Use Magic"].indexOf(
                i.name
              ) != -1
            ) {
              cat = "magic";
            } else if (
              [
                "Teleportation",
                "Biopsionics",
                "Metapsionics",
                "Precognition",
                "Telekinesis",
                "Telepathy",
              ].indexOf(i.name) != -1
            ) {
              cat = "psionic";
            }
            if (!acc[cat]) {
              acc[cat] = [];
            }
            acc[cat].push(i);
            return acc;
          }, {}),
        sceneParadox,
        formFoci,
        hasAltForms: formFoci.length > 0,
        activeForm,
        powers
      },
    };
  }

  async showSpellInChat(actorId, spellId) {
    const actor = game.actors?.get(actorId);
    const spell = actor.items.find((i) => i.id == spellId);
    const data = {
      actor: actor,
      spell,
    };
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat-spellcast.hbs",
      data
    );
    const chatMessage = getDocumentClass("ChatMessage");
    chatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: chatContent,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    });
  }

  async _handleCastSpellClick(event) {
    const clickedElement = $(event.currentTarget);
    const level = clickedElement.data().level;
    const actorId = clickedElement.data().actor;

    SpellSlots.castByLevel(actorId, level);
  }

  async _onScene(event) {
    super._onScene(event);
    await this.actor.unsetFlag(
      MageMagicAddon.ID,
      MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX
    );
  }

  /**
   * Override of thefunction from base swnr to add magic specific stuff.
   *
   * @param {*} event Button click event
   */
  async _onRest(event) {
    event.preventDefault();

    const rest = async (isFrail) => {
      const data = this.actor.data.data;
      const strainRecovery = await this.actor.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTOR_STRAIN_RECOVERY);
      const newStrain = Math.max(data.systemStrain.value - (strainRecovery || 1), 0);
      const newHP = isFrail ? data.health.value : data.health.max;
      await this.actor.update({
        data: {
          systemStrain: { value: newStrain },
          health: { value: newHP },
          effort: { scene: 0, day: 0 },
          tweak: {
            extraEffort: {
              scene: 0,
              day: 0,
            },
          },
        },
      });

      const swNMage = await isSwNMage(this.actor);
      const mtAMage = await isMtAMage(this.actor);
      console.log("swnr-mage", "how rest?", { swNMage, mtAMage });
      if (swNMage) {
        await SpellSlots.fillSpellSlots(this.actor);
      }
      if (mtAMage) {
        var mana = new Mana(this.actor);
        await mana.addRestMana();
      }

      this._resetSoak();
    };
    const d = new Dialog(
      {
        title: game.i18n.localize("swnr.sheet.rest-title"),
        content: game.i18n.localize("swnr.sheet.rest-desc"),
        buttons: {
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: "Yes",
            callback: () => rest(false),
          },
          frail: {
            icon: '<i class="fas fa-check"></i>',
            label: "Yes, but no HP",
            callback: () => rest(true),
          },
          no: {
            icon: '<i class="fas fa-times"></i>',
            label: "No",
          },
        },
        default: "no",
      },
      {
        classes: ["swnr"],
      }
    );
    d.render(true);
  }

  async _onChangeTheme(event) {
    console.log("swnr-mage", "open theme dialog");

    var _a;
    event.preventDefault();
    const template =
      "modules/swnr-space-magic/templates/dialogs/actor-theme.hbs";
    const data = {
      actor: this.actor,
    };
    const html = await renderTemplate(template, data);
    (_a = this.popUpDialog) === null || _a === void 0 ? void 0 : _a.close();
    const _saveTweakChar = async (html) => {
      // var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      const form = html[0].querySelector("form");
      var temp;
      const layout =
        (temp = form.querySelector('[name="layout"]')) === null ||
        temp === void 0
          ? "default"
          : temp.value;
      const update = {
        layout,
      };
      console.log(update);
      await this.actor.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ACTOR_SHEET_THEME,
        update
      );
    };
    this.popUpDialog = new Dialog(
      {
        title: game.i18n.format("swnr.dialog.tweak-char", {
          actor: this.actor.name,
        }),
        content: html,
        default: "saveChanges",
        buttons: {
          saveChanges: {
            label: game.i18n.localize("swnr.dialog.save-changes"),
            callback: _saveTweakChar,
          },
        },
      },
      { classes: ["swnr"] }
    );
    await this.popUpDialog.render(true);
  }
  /**
   * Extend and override the sheet header buttons
   * @override
   */
  _getHeaderButtons() {
    var _a;
    const buttons = super._getHeaderButtons();
    // Token Configuration
    const canConfigure =
      ((_a = game.user) === null || _a === void 0 ? void 0 : _a.isGM) ||
      this.actor.isOwner;
    if (this.options.editable && canConfigure) {
      // Insert tweaks into first spot on the array
      buttons.splice(0, 0, {
        label: "Theme",
        class: "actor-sheet-theme",
        icon: "fas fa-paintbrush",
        onclick: (ev) => this._onChangeTheme(ev),
      });
    }
    return buttons;
  }

  async _handleActiveMageSightClick(event, actor, formData) {
    console.log("swnr-mage", formData);
    var arcana;
    if (formData) {
      arcana = formData["mage-sight-arcana"];
    }

    var actorArcana = new Arcanum(actor);
    var magicSkills = actorArcana.getAll();
    var manaCost = 0;
    var gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );
    var gnosisRank = gnosis ? gnosis.system.rank : 0;
    var duration = gnosisRank + 1;

    magicSkills = magicSkills.filter((s) =>
      arcana ? arcana.indexOf(s.name) != -1 : s.importance == "ruling"
    );

    if (!arcana) {
      arcana = magicSkills.map((s) => s.name);
    }

    for (const s of magicSkills) {
      if (s.importance !== "ruling") {
        manaCost++;
      }
    }

    console.log("swnr-mage", "active sight skills", magicSkills);
    const data = {
      actor: actor,
      arcana,
      magicSkills,
      manaCost,
      duration,
    };
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat/active-mage-sight.hbs",
      data
    );
    const chatMessage = getDocumentClass("ChatMessage");
    const create = await chatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: chatContent,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
    });
    console.log("swnr-mage", 292, create);
  }

  async _handleFocusedRevelation(event, actor, formData) {
    let r;
    let paradoxRoll;
    let paradoxDmgRoll;
    let isChanceDie = false;
    let rolls = [];
    let arcanum;
    const gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );
    const gnosisRanks = gnosis ? gnosis.system.rank + 1 : 0;

    let dicePool = gnosisRanks;

    if (this.calculatedValues["focused-mage-sight-arcanum"]) {
      arcanum = actor.items.find(
        (f) =>
          f.type == "skill" &&
          f.name.toLowerCase() ==
            this.calculatedValues["focused-mage-sight-arcanum"].toLowerCase()
      );
      console.log("swnr-mage", "focusedArcanum", arcanum);
      dicePool += arcanum.system.rank + 1;
    }

    if (dicePool < 1) {
      r = new Roll("1d10cs=8", { dicePool: 1 });
      isChanceDie = true;
    } else {
      r = new Roll(dicePool + "d10x10cs>=8", { dicePool });
    }

    console.log("swnr-mage", r.terms);
    await r.evaluate({ async: true });
    rolls.push(r);

    var successType = "failure";
    if (isChanceDie && r.dice[0].results[0].result == 1) {
      successType = "dramafail";
    } else if (r.result >= 5) {
      successType = "exceptional";
    } else if (r.result > 0) {
      successType = "success";
    }

    let data = {
      actor,
      gnosis,
      r,
      successType,
      arcanum,
    };

    console.log("swnr-mage", "paradoxRoll", paradoxRoll);
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat/focused-mage-sight-revelation.hbs",
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
  }

  async _handleFocusedScrutiny(event, actor) {
    let r;
    let paradoxRoll;
    let paradoxDmgRoll;
    let isChanceDie = false;
    let rolls = [];
    let arcanum;
    const gnosis = actor.items.find(
      (f) => f.type == "skill" && f.name.toLowerCase() == "gnosis"
    );
    const gnosisRanks = gnosis ? gnosis.system.rank + 1 : 0;

    let dicePool = gnosisRanks;

    if (this.calculatedValues["focused-mage-sight-arcanum"]) {
      arcanum = actor.items.find(
        (f) =>
          f.type == "skill" &&
          f.name.toLowerCase() ==
            this.calculatedValues["focused-mage-sight-arcanum"].toLowerCase()
      );
      console.log("swnr-mage", "focusedArcanum", arcanum);
      dicePool += arcanum.system.rank + 1;
    }

    if (dicePool < 1) {
      r = new Roll("1d10cs=8", { dicePool: 1 });
      isChanceDie = true;
    } else {
      r = new Roll(dicePool + "d10x10cs>=8", { dicePool });
    }

    console.log("swnr-mage", r.terms);
    await r.evaluate({ async: true });
    rolls.push(r);

    var successType = "failure";
    if (isChanceDie && r.dice[0].results[0].result == 1) {
      successType = "dramafail";
    } else if (r.result >= 5) {
      successType = "exceptional";
    } else if (r.result > 0) {
      successType = "success";
    }

    let data = {
      actor,
      gnosis,
      r,
      successType,
      arcanum,
    };

    console.log("swnr-mage", "paradoxRoll", paradoxRoll);
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat/focused-mage-sight-scrutiny.hbs",
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
  }

  _handleCombatTabRoll(type) {
    try {
      if (type == "cod") {
        new RollCod(null, {
          actorId: this.object.id,
          combatRollSkills: this.combatRollSkills,
        }).render(true);
      }
      if (type == "swnr") {
        new RollSwnr(null, {
          actorId: this.object.id,
          combatRollSkills: this.combatRollSkills,
        }).render(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  _handleChallengeMorality() {
    new ChallengeMorality(null, {
      actorId: this.object.id,
    }).render(true);
  }

  /**
   * Toggle editing hit points. Stolen from D&D5e.
   * @param {PointerEvent} event  The triggering event.
   * @param {boolean} edit        Whether to toggle to the edit state.
   * @protected
   */
  _toggleEditMeter(event, edit) {
    const target = event.currentTarget.closest(".progress");
    const label = target.querySelector(":scope > .label");
    const input = target.querySelector(":scope > .progress-controls");
    console.log("swnr-mage", { target, label, input });
    label.hidden = edit;
    input.hidden = !edit;
    if (edit) input.focus();
  }

  async _handleButtonClick(event, html) {
    const clickedElement = $(event.currentTarget);
    const action = clickedElement.data().action;
    const slotId = clickedElement.parents("[data-slot-id]")?.data()?.slotId;
    const castLevel = clickedElement.data()?.castLevel;
    const spellId = clickedElement.data()?.spellId;
    const skillId = clickedElement.data()?.skill;

    const actor = this.object;
    const swNMage = await isSwNMage(actor);
    const mtAMage = await isMtAMage(actor);

    switch (action) {
      case "castBySlot": {
        await SpellSlots.updateSlot(actor.id, slotId, {
          isUsed: true,
        });
        this.showSpellInChat(actor.id, spellId);
        this.render();
        break;
      }

      case "castByLevel": {
        await SpellSlots.useBySpell(actor, spellId);
        this.showSpellInChat(actor.id, spellId);
        this.render();
        break;
      }

      case "prepare": {
        console.log("swnr-mage");
        await SpellSlots.prepareByLevel(actor.id, castLevel, spellId);
        this.render();
        break;
      }

      case "edit-spell": {
        event.preventDefault();
        event.stopPropagation();
        const item = actor.getEmbeddedDocument("Item", spellId);
        if (item instanceof Item) item.sheet?.render(true);
        break;
      }

      case "combat-skill-edit": {
        event.preventDefault();
        event.stopPropagation();
        const item = actor.getEmbeddedDocument("Item", skillId);
        if (item instanceof Item) item.sheet?.render(true);
        break;
      }

      case "unprepare": {
        await SpellSlots.updateSlot(actor.id, slotId, {
          spell: null,
        });
        this.render();
        break;
      }

      case "restoreSlot": {
        await SpellSlots.updateSlot(actor.id, slotId, {
          isUsed: false,
        });
        this.render();
        break;
      }

      case "add-mana": {
        var mana = new Mana(actor);
        var val = await mana.getCurrentValue();
        await mana.setCurrentValue(val + 1);
        this.render();
        break;
      }

      case "subtract-mana": {
        var mana = new Mana(actor);
        var val = await mana.getCurrentValue();
        await mana.setCurrentValue(val - 1);
        this.render();
        break;
      }

      case "add-strain": {
        if (actor.system.systemStrain.value < actor.system.systemStrain.max) {
          await this.actor.update({
            data: {
              systemStrain: { value: actor.system.systemStrain.value + 1 },
            },
          });
        }
        this.render();
        break;
      }

      case "subtract-strain": {
        if (actor.system.systemStrain.value > 0) {
          await this.actor.update({
            data: {
              systemStrain: { value: actor.system.systemStrain.value - 1 },
            },
          });
        }
        this.render();
        break;
      }

      case "add-scene-paradox": {
        var sceneParadox = await actor.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX
        );
        actor.setFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX,
          sceneParadox && sceneParadox > 0 ? sceneParadox + 1 : 1
        );
        this.render();
        break;
      }

      case "subtract-scene-paradox": {
        var sceneParadox = await actor.getFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX
        );
        actor.setFlag(
          MageMagicAddon.ID,
          MageMagicAddon.FLAGS.ACTOR_SCENE_PARADOX,
          sceneParadox && sceneParadox > 0 ? sceneParadox - 1 : 0
        );
        this.render();
        break;
      }

      case "toggle-skill-importance": {
        if (skillId) {
          const skill = actor.items.get(skillId);
          const importance = skill.getFlag(
            MageMagicAddon.ID,
            MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE
          );
          if (!importance) {
            await skill.setFlag(
              MageMagicAddon.ID,
              MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE,
              "ruling"
            );
          } else if (importance == "ruling") {
            await skill.setFlag(
              MageMagicAddon.ID,
              MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE,
              "inferior"
            );
          } else if (importance == "inferior") {
            await skill.unsetFlag(
              MageMagicAddon.ID,
              MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE
            );
          }
        }
        // if (actor.system.systemStrain.value > 0) {
        //   actor.system.systemStrain.value -= 1;
        // }
        this.render();
        break;
      }

      case "active-mage-sight": {
        this._handleActiveMageSightClick(event, actor, this.formData);
        break;
      }

      case "focused-mage-sight-revelation": {
        const formData = new FormData(html[2]);
        const formVals = Object.fromEntries(formData);
        this.calculatedValues["focused-mage-sight-arcanum"] =
          formVals["focused-mage-sight-arcanum"];

        this._handleFocusedRevelation(event, actor, this.formData);
        break;
      }

      case "focused-mage-sight-scrutiny": {
        const formData = new FormData(html[2]);
        const formVals = Object.fromEntries(formData);
        this.calculatedValues["focused-mage-sight-arcanum"] =
          formVals["focused-mage-sight-arcanum"];

        this._handleFocusedScrutiny(event, actor, this.formData);
        break;
      }

      case "mta-cast-spell": {
        try {
          new SpellcastConfig(null, {
            actorId: actor.id,
            spellId,
          }).render(true);
        } catch (e) {
          console.error(e);
        }
        break;
      }

      case "combat-swnr-roll": {
        this._handleCombatTabRoll("swnr");
        break;
      }
      case "combat-cod-roll": {
        this._handleCombatTabRoll("cod");
        break;
      }
      case "challenge-morality": {
        this._handleChallengeMorality();
        break;
      }

      case "add-gnosis": {
        var current = actor.items.contents.find(i => i.name == 'Gnosis');
        if (current == undefined) {
          const skillData = {
            name: "Gnosis",
            img: "icons/svg/item-bag.svg",
            type: "skill",
            system: {
              defaultStat: "ask",
              description: "",
              dice: "2d6",
              pool: "ask",
              rank: -1,
              source: "Space Magic",
            }
          };

          await actor.createEmbeddedDocuments("Item", [skillData]);
        }
        break;
      }

      case "add-arcana": {
        var arcana = new Arcanum;
        var newSkills = [];
        for (var arcanum of arcana.names) {
          var current = actor.items.contents.find(i => i.name == arcanum);
          if (current == undefined) {
            newSkills.push({
              name: arcanum,
              img: "icons/svg/item-bag.svg",
              type: "skill",
              system: {
                defaultStat: "ask",
                description: "",
                dice: "2d6",
                pool: "ask",
                rank: -1,
                source: "Space Magic",
              }
            });
          }


        }
        if (newSkills.length > 0) {
          await actor.createEmbeddedDocuments("Item", newSkills);
        }
        break;
      }

      default:
        MageMagicAddon.log(false, "Invalid action detected", action);
    }
  }

  _compileFormData(htmlForm) {
    const rawFormData = $(htmlForm).serializeArray();
    return rawFormData.reduce((acc, i) => {
      var key = i.name;
      var value = i.value;
      if (i.name.substring(i.name.length - 2) == "[]") {
        key = key.substring(0, key.length - 2);
        if (!Array.isArray(acc[key])) {
          acc[key] = new Array();
        }
        acc[key].push(i.value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  activateListeners(html) {
    super.activateListeners(html);
    const sheet = this;
    const actor = this.object;

    // html.on("click", "[data-action]", this._handleButtonClick.bind(this));
    html.on("click", "[data-action]", (event) => {
      this._handleButtonClick(event, html);
    });

    html.on("change", ".input-mage-sight-arcana", (event) => {
      this.formData = this._compileFormData(html[2]);

      this.activeMageSightArcana = this.formData["mage-sight-arcana"];

      this.render();
    });

    html.on("change", ".input-swnr-space-magic-combat-tab-skill", (event) => {
      this.formData = this._compileFormData(html[2]);

      this.combatRollSkills =
        this.formData["swnr-space-magic-combat-tab-skills"];

      this.render();
    });

    Hooks.on("reRenderMageActorSheet", (actorId) => {
      console.log("swnr-mage", "should we rerender?", actorId, actor);
      if (actorId == actor.id) {
        console.log("swnr-mage", "doing the rerender", sheet);
        sheet.render();
      }
    });

    html
      .find(".meter > .progress.editable")
      .on("click", (event) => this._toggleEditMeter(event, true));

    html.find(".swnr-mage-actor-header-name").on("input", (event) => {
      event.target.parentNode.classList.add("dirty");
    });
    html.find(".swnr-mage-actor-header-name-save-btn").on("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      console.log(
        "swnr-mage",
        "name change",
        this.object,
        event.target.parentNode,
        event.target.parentNode.querySelector("[contenteditable]").innerText
      );
      if (event.target && event.target.innerText) {
        // this.object.name = event.target.innerText;
        this.object.update({
          name: event.target.parentNode.querySelector("[contenteditable]")
            .innerText,
        });
        event.target.parentNode.classList.remove("dirty");
      }

      this.render();
    });

    html.on("click", ".swnr-mage-improvised-spellcasting-btn", (event) => {
      var actorId = this.object.id;
      console.log("swnr-mage", "open improvised spellcast menu", actorId);
      try {
        new SpellcastConfig(null, {
          actorId,
        }).render(true);
      } catch (e) {
        console.error(e);
      }
    });

    html.on("keyup", ".swnr-space-magic-actor-search", async (event) => {
      var searchable = html.find(".swnr-space-magic-actor-searchable");
      var search = event.target.value;
      for (var s of searchable) {
        if (
          search.length == 0 ||
          s.dataset.searchString.toLowerCase().indexOf(search.toLowerCase()) !=
            -1
        ) {
          s.style.opacity = 1;
        } else {
          s.style.opacity = 0.25;
        }
      }
    });

    html.on("click", ".swnr-space-mage-toggle-spell-filter", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      var arcanum = event.target.dataset.arcanum;
      var actorId = this.object.id;

      var isSet = await this.object.getFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ACTOR_SPELL_FILTER_ARCANUM
      );

      if (isSet) {
        arcanum = null;
      }

      await this.object.setFlag(
        MageMagicAddon.ID,
        MageMagicAddon.FLAGS.ACTOR_SPELL_FILTER_ARCANUM,
        arcanum
      );

      this.render();
    });

    Hooks.on("updateItem", (item) => {
      console.log("swnr-mage", "updateItem", actor, item);

      if (actor.items.find((i) => item.id == i.id)) {
        this.render();
      }
    });

    if (this.isEditable) {
      html
        .find(".profile-img[data-edit]")
        .on("click", this._onEditImage.bind(this));
    }
  }

  // render() {
  //   // let defaultSheet = this.actor.getFlag(MageMagicAddon.ID, 'defaultSheet') ?? game.settings.get('ffs', `${this.actor.type}ActorDefaultSheet`)
  //   //   //Object.entries(game.settings.get('ffs', 'sheets')).find(([k,v])=>v.document=="Actor"&&v.defaults?.includes(this.actor.type))?.at(0)
  //   // if (!defaultSheet) {
  //   //   new DocumentSheetConfig(this.actor).render(true)
  //   //   if (game.user.isGM) alert(`Default Freeform Sheet not defined for actor type ${this.actor.type}`)
  //   //   return
  //   // }
  //   // this.actor.freeformSheet(defaultSheet)
  //   this.close()
  // }
}