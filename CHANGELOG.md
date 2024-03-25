# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Restyled improvised casting button

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

[unreleased]: https://github.com/sumayyah-k/swnr-space-magic/compare/1.5.3...HEAD
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