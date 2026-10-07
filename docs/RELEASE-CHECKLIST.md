# Stable Release Checklist

## Repository

- [x] README
- [x] License
- [x] Terms
- [x] Privacy policy
- [x] Security policy
- [x] Contribution guidelines
- [x] Code of Conduct
- [x] Support policy
- [x] Disclaimer
- [x] Notice
- [x] Build-source hashes
- [x] Verification records

## Firmware

- [x] Candidate runtime built
- [x] ARM ELF format preserved
- [x] Embedded V8 payload preserved
- [x] Runtime smoke test completed
- [x] Local feature state verified
- [x] Sub-vendo state verified
- [x] Rental state verified
- [x] eLoad configuration preserved
- [x] RootFS strict comparison completed
- [x] Local Dropbear SSH preserved
- [x] MBR preserved
- [x] Boot partition preserved
- [x] Partition geometry preserved
- [x] Firmware trailer preserved
- [x] gzip integrity verified
- [x] SHA-256 verification completed

## Hardware

- [ ] Physical Orange Pi One boot test

The unchecked hardware item reflects the validation environment and does not
invalidate the completed offline/QEMU and structural verification.
