const SWNRSkillList = ["Know Magic", "Use Magic"];
const MTASkillList = ["Gnosis", "Death", "Fate", "Forces", "Life", "Matter", "Mind", "Prime", "Space", "Spirit", "Time"];

export function filterSkillsBySystem(token, i) {
    if (token.document.actor.constructor.name == "SWNRCharacterActor") {
        return (
          i.type == "skill" &&
          [...SWNRSkillList, ...MTASkillList].indexOf(i.name) != -1
        );
    }

    return false;
}

export function validateSkillsExist(token, ) {
  if (token.document.actor.constructor.name == "SWNRCharacterActor") {
    var skills = token.document.actor.items.contents.filter((i) =>
      filterSkillsBySystem(token, i)
    );

    return skills.length == SWNRSkillList.length;
  }

  return false;
}

export function isArcanist(actor) {
  return (
    actor.items.contents.findIndex(
      (i) =>
        i.type == "class" &&
        i.name.toLowerCase().trim() == "arcanist"
    ) != -1
  );
}
export function isMagister(actor) {
  return (
    actor.items.contents.findIndex(
      (i) =>
        i.type == "class" &&
        ["magister", "pacter", "rectifier", "war mage"].indexOf(
          i.name.toLowerCase().trim()
        ) != -1
    ) != -1
  );
}

export function isMtAMage(actor) {
  return (
    actor.items.contents.findIndex(
      (i) => i.type == "class" && i.name.toLowerCase().trim() == "mage"
    ) != -1
  );
}

export function isSwNMage(actor) {
  return isArcanist(actor) || isMagister(actor);
}

export function isPsychic(actor) {
  return actor.items.contents.findIndex(
      (i) =>
        i.type == "class" &&
        ["Psychic", "Partial Psychic"].indexOf(i.name) != -1
    ) != -1;
}