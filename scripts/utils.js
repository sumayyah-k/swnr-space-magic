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
  console.log('swnr-mage', 'utils-actor', actor);
  return actor.system.class.toLowerCase().trim() == "arcanist";
}
export function isMagister(actor) {
  return ["magister", "pacter", "rectifier", "war mage"].indexOf(
    actor.system.class.toLowerCase().trim()
  ) != -1;
}

export function isMtAMage(actor) {
  return actor.system.class.toLowerCase().trim() == "mage";
}

export function isSwNMage(actor) {
  return isArcanist(actor) || isMagister(actor);
}