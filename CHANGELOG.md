# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.10.0] - 2024-05-17

### Added

- Can change the value of strain recovery per rest via the stats tab
- Alternate Character Forms
  - Add a focus and switch the type to "Alternate Form"
    - note: focus sheet will need to be `swnr-space-magic.MageItemSheet` to see this option
  - On a power that should only show up for that form, put the form name in for the source
  - A dropdown will show up on the right side bar to change the character form which will filter out powers for other forms.
    - note: on the "Default" theme, choosing "No Form" will continue to use the power tab from the system instead of overriding it, which happens if an active form is chosen or the character is using the "New" theme
- Add search to powers and cyberware

### Fixed

- Fix error when accessing actor sheet while not a mage

## [1.9.1] - 2024-05-08

### Fixed

- Syntax error with starting morality

## [1.9.0] - 2024-05-08

### Added

- Add badge to spells in list showing damaging spells
- scene paradox that accumulates when spells with paradox are cast and clears with the end scene button
- Add Wisdom Stat & roll wisdom to defend vs. paradox
- Add button to roll for acts of hubris

### Changed

- All damage lowered by 2 dice levels. Bashing is d4, aggravated is d6, lethal is d8
- Switch ranks to dots on magic tab arcana list
- Show number of active spells on magic tab

### Fixed

- Number of turns was not taking mana per turn from gnosis into account
- Fix search not working with capitals

## [1.8.0] - 2024-05-01

### Added

- Search skills (combat tab only) and spells
- Add attainments section to magic tab
- Add forces & time spells to compendium
- Add Space: Everywhere Attainment support to spellcasting form
- Add Time in a Bottle Attainment support to spellcasting form
- Teamwork Casting

### Changed

- Spell addons can also cost reach

## [1.7.0] - 2024-04-17

### Added

- Mana in the sidebar
- Effort in sidebar
- Compendiums: SWNR Classes, SWNR Spells, MTA Spells
- Add badges to spell list to show rote if or praxis
- Filter MTA spells by arcanum by clicking the name in the magic tab sidebar
- Categorize skills on combat tab

## [1.6.1] - 2024-04-10

### Fixed

- Fix spells not attached to an actor breaking because of the addon arcanum

## [1.6.0] - 2024-04-10

### Added

- Added whole new theme for the actor sheet that can be chosen from the Theme button in the title bar
- Added 8 again, 9 again, and rote roll toggles to spellcasting form
- Sympathetic range support in spellcasting
  - Check for knowing a spell's subject's sympathetic name
  - Reach & mana cost
  - Cannot cast spells at sympathetic or temporal range without sympathetic yantra
  - Choosing strength automatically adjusts withstanding
- Add base mana cost field to spellcasting form
- Add mana cost field to spell items
- Add mana and strain cost to spell reach and addon options
- Added CoD style rolls to the Combat tab that also support the SWNR method
- Add Damage/Healing roll to spellcast form and spells
- Add "Any Arcanum" option to spell addons

### Fixed

- Mage sight options weren't working

### Changed

- Restyled improvised casting button
- Spells with potency equal or less than withstanding are uncastable

## [1.5.3] - 2024-03-23
## [1.5.2] - 2024-03-23 [YANKED]

### Fixed

- Item sheets for powers were showing the wrong thing when no subtype was chosen.
- Spell Addon buttons weren't showing for non active spells

## [1.5.1] - 2024-03-23

### Fixed

- Moved assets into style folder in the hope they are included in the build.

## [1.5.0] - 2024-03-23

### Added

- Active Spell Support
  - Button in chat to add active spell to sheet
  - Reach penalty for going over max active spells
  - Can relinquish active spells, just a checkbox, doesn't add strain or decrease max strain, need to figure out a SWN way to relinquish a spell safely still.
- Temp HP field to track... temp HP...
  - There was a spot in the system's class for temp hp, but it's not implemented fully yet... so it's just a manual thing for now.

### Changed

- First real pass at an actual style

## [1.4.0] - 2024-03-19

### Added

- Changelog
- Delete Spell Button on Magic Tab

### Changed

- Added more information about MtA stuff to the readme and fixed the old instructions.
- Heal to full on rest
- Conditionally show the magic tab
- Changed the "is MtAw spell" to a dropdown to account for Attainments and CotBS spells as  power types
- The Magic tab only shows spells now

## [1.3.0] - 2024-03-13

### Added

- Yantras
- Spell Addons
- Aimed Spell rolls
- Additional spell options

## [1.2.1] - 2024-03-06

### Fixed

- Fix errors for newly made actors using the new sheet

## [1.2.0] - 2024-03-06

### Added

- move stuff into actor sheet
- add item sheet
- add mage sight

### Removed

- The hotbar button has been removed as everything from the old modal was moved into the actor sheet

## [1.1.0] - 2024-02-28

#### Added

- Basic stuff for mage spellcasting

## [1.0.1] - 2024-02-18

### Fixed

- Fix incorrect path to modal html

## [1.0.0] - 2024-02-18

#### Added

- New modal to track spell slots for Arcanist and Magister classes
- Casting spells from modal shows details in chat and updates spell slots
- Prepare spells as arcanist

[unreleased]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.10.0...HEAD
[1.10.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.9.1...1.10.0
[1.9.1]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.9.0...1.9.1
[1.9.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.8.0...1.9.0
[1.8.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.7.0...1.8.0
[1.7.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.6.1...1.7.0
[1.6.1]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.6.0...1.6.1
[1.6.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.5.3...1.6.0
[1.5.3]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.5.1...1.5.3
[1.5.1]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.4.0...1.5.0
[1.4.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.3.0...1.4.0
[1.3.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.2.1...1.3.0
[1.2.1]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.2.0...1.2.1
[1.2.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.0.1...1.1.0
[1.0.1]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/sumayyah-k/swnr-space-magic/releases/tag/1.0.0