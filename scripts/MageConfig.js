import { MageMagicAddon } from "./MageMagicAddon.js";
import { filterSkillsBySystem, isMtAMage, isArcanist, isMagister, isSwNMage } from "./utils.js";
import SpellSlots from './Models/SpellSlots.js';
import Mana from "./Models/Mana.js";
import {SpellcastConfig} from "./SpellcastConfig.js";
import Arcanum from "./Models/Arcanum.js";
import Gnosis from "./Models/Gnosis.js";

export class MageConfig extends FormApplication {
  static get defaultOptions() {
    const defaults = super.defaultOptions;

    var tokens = null;
    var token = null;
    var actorId = null;

    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
      actorId = token.document.actor.id;
    }

    const overrides = {
      height: 600,
      width:850,
      id: "mage-magic",
      template: MageMagicAddon.TEMPLATES.SPELLCASTING,
      title: "Grimoire",
      actorId: actorId,
      actor: game.actors?.get(actorId),
      popOut: true,
      resizable: true,
      minimizable: true,
      closeOnSubmit: false,
      submitOnChange: true,
    };

    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

    return mergedOptions;
  }

  bind(html) {
    MageMagicAddon.log(true, { html });
  }

  async getData(options) {
    var tokens = null;
    var token = null;
    var magicSkills = [];
    var spells = [];
    var spellsById = {};
    var actorId = null;
    var actor = {};

    tokens = canvas?.tokens?.controlled;
    if (tokens) {
      token = tokens[0];
    }
    if (token) {
      actorId = token.document.actor.id;
      actor = game.actors.get(actorId);
      var arcana = new Arcanum(actor);
      magicSkills = arcana.getAll();

      spells = actor.items.contents
        .filter((i) => i.type == "power")
        .reduce((acc, i) => {
          if (!acc.hasOwnProperty(i.system.level)) {
            acc[i.system.level] = [];
          }
          acc[i.system.level.toString()].push(i);
          acc[i.system.level.toString()].sort((a, b) => b.sort - a.sort);
          return acc;
        }, {});

      spellsById = actor.items.contents
        .filter((i) => i.type == "power")
        .reduce((acc, i) => {
          acc[i.id] = i;
          return acc;
        }, {});
    }

    const spellSlots = await SpellSlots.getForActor(actor);

    var numSpellSlots = Object.values(spellSlots).reduce((acc, i) => {
      var chClass = i.class.toLowerCase().trim();
      var level = parseInt(i.level, 10);

      if (!acc[chClass]) {
        acc[chClass] = {};
      }
      if (!acc[chClass][level]) {
        const maxSpellSlots = SpellSlots.getMaxSpellSlots(
          chClass,
          actor.system.level.value
        );

        acc[chClass][level] = { available: 0, max: maxSpellSlots[i.level] };
      }

      if (i.isUsed == false) {
        acc[chClass][level].available++;
      }

      return acc;
    }, {});

    var spellSlotsByLevel = Object.values(spellSlots).reduce((acc, i) => {
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

    const activeMagicTab = game.actors
      .get(actorId)
      ?.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.ACTIVE_MAGIC_TAB);

    const mtAMage = isMtAMage(actor);
    var defaultValues = {};

    const strain = actor.system.systemStrain;
    var mageInfo = {};
    if (mtAMage) {
      mageInfo.gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis')
      mageInfo.gnosisData = Gnosis.byRank(mageInfo.gnosis.system.rank);
      mageInfo.maxSafeRolls = mageInfo.gnosis.system.rank;
      mageInfo.scrutinyPenalty = Math.ceil((mageInfo.gnosis.system.rank + 1) / 2);
      var mana = new Mana(actor);
      var arcana = new Arcanum(actor);
      var allArcana = arcana.getAll();

      mageInfo.mana = {
        current: mana.getCurrentValue(),
        max: mana.getMax(),
      };

      //Add MtA default values
      defaultValues = {...defaultValues, ...{
        "focused-mage-sight-arcanum": allArcana.filter(a => a.importance == 'ruling')[0].name,
        "mage-sight-arcana": allArcana.filter(a => a.importance == 'ruling').map(a => a.name),
        activeManaCost: 0,
        activeDuration: mageInfo.gnosis.system.rank + 1,
      }};

      //Update with chosen form values
      if (this.formData) {
        console.log('swnr-mage', 'formData', this.formData)
        defaultValues["focused-mage-sight-arcanum"] = this.formData["focused-mage-sight-arcanum"];
        defaultValues['mage-sight-arcana'] = this.formData['mage-sight-arcana[]'].filter(i => i);
      }

      //Active mage sight mana cost adjustments
      console.log('swnr-mage', 'default Values', defaultValues['mage-sight-arcana'])

      for (var a of defaultValues['mage-sight-arcana']) {
        var arcanum = allArcana.find(i => i.name == a);
        console.log('swnr-mage', 'arcanum', arcanum)
        if (arcanum.importance != 'ruling') {
          defaultValues.activeManaCost++;
        }
      }
    }
    console.log('swnr-mage', 'default Values', defaultValues)
    this.calculatedValues = defaultValues;

    return {
      token,
      actor: actorId,
      magicSkills,
      numSpellSlots,
      spellSlotsByLevel,
      spells,
      spellsById,
      isArcanist: await isArcanist(actor),
      isMagister: await isMagister(actor),
      isSwNMage: await isSwNMage(actor),
      mtAMage,
      activeMagicTab: activeMagicTab || 1,
      flag: MageMagicAddon.FLAGS.ID + "-" + MageMagicAddon.FLAGS.SPELLSLOTS,
      strain,
      mageInfo,
      defaultValues,
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

  async showSpellInChat(actorId, spellId) {
    const actor = game.actors?.get(actorId);
    const spell = actor.items.find(i => i.id == spellId);
    const data = {
      actor: actor,
      spell,
    };
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat-spellcast.hbs",
      data
    );
    const chatMessage = getDocumentClass("ChatMessage");
    chatMessage.create(
        {
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: chatContent,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        }
    );
  }

  async _handleCastSpellClick(event) {
    const clickedElement = $(event.currentTarget);
    const level = clickedElement.data().level;
    const actorId = clickedElement.data().actor;

    SpellSlots.useSpellSlot(actorId, level);
  }

  async _handleRestClick(event) {
    const clickedElement = $(event.currentTarget);
    const actorId = clickedElement.data().actor;

    SpellSlots.fillSpellSlots(actorId);
  }

  async _handleActiveMageSightClick(event, actor, formData) {
    console.log('swnr-mage', formData);
    var arcana;
    if (formData) {
      arcana = formData['mage-sight-arcana[]']
    }

    var actorArcana = new Arcanum(actor);
    var magicSkills = actorArcana.getAll();
    var manaCost = 0;
    var gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis');
    var duration = gnosis.system.rank + 1;

    magicSkills = magicSkills.filter(s => arcana ? arcana.indexOf(s.name) != -1 : s.importance == 'ruling');

    if (!arcana) {
      arcana = magicSkills.map(s => s.name);
    }

    for (const s of magicSkills) {
      if (s.importance !== 'ruling') {
        manaCost++;
      }
    }

    console.log('swnr-mage', 'active sight skills', magicSkills);
    const data = {
      actor: actor,
      arcana,
      magicSkills,
      manaCost,
      duration
    };
    const chatContent = await renderTemplate(
      "modules/swnr-space-magic/templates/chat/active-mage-sight.hbs",
      data
    );
    const chatMessage = getDocumentClass("ChatMessage");
    const create = await chatMessage.create(
        {
          speaker: ChatMessage.getSpeaker({ actor: actor }),
          content: chatContent,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER,
        }
    );
    console.log('swnr-mage', 292, create);
  }

  async _handleFocusedRevelation(event, actor, formData) {
    let r;
    let paradoxRoll;
    let paradoxDmgRoll;
    let isChanceDie = false;
    let rolls = [];
    let arcanum;
    const gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis');
    const gnosisRanks = gnosis.system.rank + 1;

    let dicePool = gnosisRanks;

    if (this.calculatedValues['focused-mage-sight-arcanum']) {
      arcanum = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == this.calculatedValues['focused-mage-sight-arcanum'].toLowerCase());
      console.log('swnr-mage', 'focusedArcanum', arcanum);
      dicePool += (arcanum.system.rank + 1);
    }

    if (dicePool < 1) {
      r = new Roll("1d10cs=8", {dicePool: 1});
      isChanceDie = true;
    } else {
      r = new Roll(dicePool + "d10x10cs>=8", {dicePool});
    }

    console.log("swnr-mage", r.terms);
    await r.evaluate({ async: true });
    rolls.push(r);

    var successType = 'failure';
    if (isChanceDie && r.dice[0].results[0].result == 1) {
      successType = 'dramafail';
    } else if (r.result >= 5) {
      successType = 'exceptional';
    } else if (r.result > 0) {
      successType = 'success';
    }

    let data = {
      actor,
      gnosis,
      r,
      successType,
      arcanum,
    };

    console.log('swnr-mage', 'paradoxRoll', paradoxRoll);
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
    const gnosis = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == 'gnosis');
    const gnosisRanks = gnosis.system.rank + 1;

    let dicePool = gnosisRanks;

    if (this.calculatedValues['focused-mage-sight-arcanum']) {
      arcanum = actor.items.find(f => f.type == 'skill' && f.name.toLowerCase() == this.calculatedValues['focused-mage-sight-arcanum'].toLowerCase());
      console.log('swnr-mage', 'focusedArcanum', arcanum);
      dicePool += (arcanum.system.rank + 1);
    }

    if (dicePool < 1) {
      r = new Roll("1d10cs=8", {dicePool: 1});
      isChanceDie = true;
    } else {
      r = new Roll(dicePool + "d10x10cs>=8", {dicePool});
    }

    console.log("swnr-mage", r.terms);
    await r.evaluate({ async: true });
    rolls.push(r);

    var successType = 'failure';
    if (isChanceDie && r.dice[0].results[0].result == 1) {
      successType = 'dramafail';
    } else if (r.result >= 5) {
      successType = 'exceptional';
    } else if (r.result > 0) {
      successType = 'success';
    }

    let data = {
      actor,
      gnosis,
      r,
      successType,
      arcanum,
    };

    console.log('swnr-mage', 'paradoxRoll', paradoxRoll);
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

  async _handleButtonClick(event, html) {
    const clickedElement = $(event.currentTarget);
    const action = clickedElement.data().action;
    const slotId = clickedElement.parents("[data-slot-id]")?.data()?.slotId;
    const castLevel = clickedElement.data()?.castLevel;
    const spellId = clickedElement.data()?.spellId;
    const skillId = clickedElement.data()?.skill;

    const actor = game.actors?.get(this.options.actorId);
    const swNMage = await isSwNMage(actor);
    const mtAMage = isMtAMage(actor);

    switch (action) {
      case "rest": {
        if (swNMage) {
          await SpellSlots.fillSpellSlots(this.options.actorId);
        }
        if (mtAMage) {
          var mana = new Mana(actor);
          await mana.addRestMana();
        }
        this.render();
        break;
      }

      case "castBySlot": {
        await SpellSlots.updateSlot(this.options.actorId, slotId, {
          isUsed: true,
        });
        this.showSpellInChat(this.options.actorId, spellId);
        this.render();
        break;
      }

      case "castByLevel": {
        await SpellSlots.castByLevel(this.options.actorId, castLevel);
        this.showSpellInChat(this.options.actorId, spellId);
        this.render();
        break;
      }

      case "prepare": {
        await SpellSlots.prepareByLevel(
          this.options.actorId,
          castLevel,
          spellId
        );
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

      case "unprepare": {
        await SpellSlots.updateSlot(this.options.actorId, slotId, {
          spell: null,
        });
        this.render();
        break;
      }

      case "restoreSlot": {
        await SpellSlots.updateSlot(this.options.actorId, slotId, {
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
          actor.system.systemStrain.value += 1;
        }
        this.render();
        break;
      }

      case "subtract-strain": {
        if (actor.system.systemStrain.value > 0) {
          actor.system.systemStrain.value -= 1;
        }
        this.render();
        break;
      }

      case "toggle-skill-importance": {
        if (skillId) {
          const skill = actor.items.get(skillId);
          const importance = skill.getFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE);
          if (!importance) {
            await skill.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE, 'ruling');
          } else if (importance == 'ruling') {
            await skill.setFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE, 'inferior');
          } else if (importance == 'inferior') {
            await skill.unsetFlag(MageMagicAddon.ID, MageMagicAddon.FLAGS.MTA_ARCANA_IMPORTANCE)
          }
        }
        // if (actor.system.systemStrain.value > 0) {
        //   actor.system.systemStrain.value -= 1;
        // }
        this.render();
        break;
      }

      case 'active-mage-sight': {
        this._handleActiveMageSightClick(event, actor, this.formData);
        break;
      }

      case 'focused-mage-sight-revelation': {
        console.log('swnr-mage', 441, this.formData);

        this._handleFocusedRevelation(event, actor, this.formData);
        break;
      }

      case 'focused-mage-sight-scrutiny': {
        console.log('swnr-mage', 447, this.formData);

        this._handleFocusedScrutiny(event, actor, this.formData);
        break;
      }

      case 'mta-cast-spell': {
        console.log("swnr-mage", "open improvised spellcast menu", actor.Id, spellId);
        try {
          new SpellcastConfig(null, {
            actorId: actor.id,
            spellId
          }).render(true);
        } catch (e) {
          console.error(e);
        }
        break;
      }

      default:
        MageMagicAddon.log(false, "Invalid action detected", action);
    }
  }

  activateListeners(html) {
    super.activateListeners(html);

    const actor = this.options.actor;

    // html.on("click", "[data-action]", this._handleButtonClick.bind(this));
    html.on("click", "[data-action]", (event) => {
      this._handleButtonClick(event, html);
    });

    html.on("change", ".input-mage-sight-arcana", (event) => {
      this.render();
    });

    html.on("click", ".swnr-mage-improvised-spellcasting-btn", (event) => {
      var actorId = event.target.dataset.actor;
      console.log("swnr-mage", "open improvised spellcast menu", actorId);
      try {
        new SpellcastConfig(null, {
          actorId,
        }).render(true);
      } catch (e) {
        console.error(e);
      }
    });

    Hooks.on("updateItem", (item) => {
      console.log('swnr-mage', 'updateItem', actor, item)

      if (actor.items.find(i => item.id == i.id)) {
        this.render();
      }
    });
  }

  async _updateObject(event, formData) {
    console.log('swnr-mage', 'mageConfig updateObject formdata', formData);

    this.formData = formData;

    if (!this.object || !this.object.id) return;

    return this.object.update(formData);
  }
}
