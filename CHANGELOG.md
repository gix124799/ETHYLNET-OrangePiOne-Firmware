# Changelog

## v1.0.0 — Stable

Initial stable ETHYLNET Orange Pi One firmware release.

### Firmware

- Added verified ETHYLNET runtime layer.
- Local firmware feature state enabled.
- Sub-vendo runtime license state localized.
- Rental activation state localized.
- eLoad runtime path preserved.
- Vendor remote SSH/HTTP/eval handlers blocked.
- ngrok boot activation removed.
- ZeroTier boot activation removed.
- Local Dropbear SSH preserved.

### Verification

- ARM/QEMU startup smoke test passed.
- Candidate/original normalized startup comparison passed.
- Runtime local-license self-test passed.
- Rental runtime-state test passed.
- Sub-vendo runtime-state test passed.
- eLoad configuration preservation test passed.
- RootFS logical diff completed.
- Regular-file SHA-256 comparison completed.
- MBR preserved.
- FAT16 boot partition preserved.
- Partition geometry preserved.
- Bytes outside p2 preserved.
- Firmware trailer preserved.
- gzip integrity verified.
- Decompressed firmware hash verified.

### Validation Scope

No physical Orange Pi One hardware boot test was performed for this release.
