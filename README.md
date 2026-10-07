# ETHYLNET Orange Pi One Firmware

Stable ETHYLNET firmware build for Orange Pi One.

## Stable Release

Current stable version:

**v1.0.0**

Primary release artifact:

`ETHYLNET-OrangePiOne-UNLIMITED-STABLE.img.gz`

## Firmware Scope

This repository contains the build, modification, verification, and release resources used for the ETHYLNET Orange Pi One firmware.

The stable firmware preserves the original disk layout and boot structure while applying the documented ETHYLNET runtime changes.

### Preserved

- Original DOS/MBR layout
- FAT16 boot partition
- Original partition geometry
- Original firmware trailer and metadata
- Local Dropbear SSH
- nginx
- ETHYLNET/soft startup service
- Portal and vendo infrastructure
- PPPoE infrastructure
- GPIO/system components
- eLoad runtime path

### Intentional RootFS Changes

1. `/soft/index.o` replaced with the verified ETHYLNET runtime candidate.
2. `/etc/rc.d/S250ngrok` removed.
3. `/etc/rc.d/S90zerotier` removed.

## Verification

The release has passed:

- ARM/QEMU runtime smoke testing
- Local license-state runtime checks
- Runtime sub-vendo validation
- Runtime rental activation validation
- eLoad configuration preservation check
- Full rootfs logical comparison
- Regular-file SHA-256 comparison
- Partition geometry verification
- MBR preservation verification
- Boot partition verification
- Exact p2 verification
- Firmware trailer verification
- gzip integrity verification
- Decompressed raw SHA-256 verification

## Hardware Validation

The firmware was validated offline using ARM/QEMU and filesystem-level verification.

A physical Orange Pi One boot test was not part of this build-validation environment.

## Installation

Flash the `.img.gz` release artifact using a compatible disk-imaging application such as Balena Etcher.

Always verify the SHA-256 checksum before flashing.

## Source and Build Resources

Build and audit scripts are stored under:

`/scripts`

Verification evidence is stored under:

`/verification`

Large original/intermediate disk images are intentionally excluded from Git history because of repository size constraints. Their cryptographic hashes and verification records are retained instead.

## Legal

See:

- `LICENSE`
- `TERMS.md`
- `SECURITY.md`
- `PRIVACY.md`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SUPPORT.md`
- `DISCLAIMER.md`

## Copyright

Copyright © 2026 ETHYLNET.

Third-party software and components remain subject to their respective licenses and copyright notices.

<!-- ETHYLNET-LATEST-RELEASE:START -->

## Latest Stable Release — v1.1.0

**ETHYLNET Orange Pi One v1.1.0 Stable — License Patch**

This release includes the ETHYLNET License Patch with:

- Level 4
- HotSpot max 1000
- PPPoE max 1000
- Vendo max 1000
- eLoad enabled
- Movie enabled
- Lifetime license status
- Original hardware serial preserved internally
- `OPI-[last 10]` serial format for License Info display
- Local SSH/Dropbear preserved
- Vendor remote startup links removed

Flashable artifact:

`ETHYLNET-OrangePiOne-v1.1.0-UNLIMITED-STABLE.img.gz`

See `docs/releases/v1.1.0.md` for complete release and verification information.

<!-- ETHYLNET-LATEST-RELEASE:END -->
