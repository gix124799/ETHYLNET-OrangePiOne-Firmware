# Contributing

Contributions should preserve firmware stability, reproducibility, and auditability.

## Before Submitting

1. Create a dedicated branch.
2. Keep changes narrowly scoped.
3. Document every modified firmware path.
4. Do not commit passwords, API keys, private keys, credentials, or customer information.
5. Preserve required third-party license notices.
6. Include test and verification results.
7. Do not silently modify the boot layout, partition table, firmware trailer, or recovery services.

## Pull Requests

A pull request should describe:

- purpose of the change;
- files modified;
- expected behavior;
- verification performed;
- compatibility impact;
- rollback procedure.

Firmware binaries should normally be distributed as GitHub Release assets rather than committed directly to Git history.
