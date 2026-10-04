# ETHYLNET Orange Pi One v1.8.30

Two evaluation firmware disk images are included:

- **24H-TEST:** Admin trial starts at the first verified online time.
  After reboot, admin waits for fresh online verification.
  After 24 hours, admin access is locked with "Your trial is expired".
- **UNLIMITED:** No trial timer or admin expiry restriction.

Trial expiry locks admin only. Internet service, coin ingestion, active
phone rentals, eLoad and TarakiPay service paths and required payment
connections are retained.

Build verification passed: filesystem checks, XZ integrity, image
checksums, declared file comparisons, boot prefix and partition layout.
Original inputs remained unchanged.

Actual Orange Pi One boot and the full application integration suite
have NOT been tested. This is a prerelease for evaluation.

Trial protection does not prevent root access, storage rollback,
reflashing or replacement of application code.

These are disk images, not packages for the existing manual web updater.
Verify downloads against SHA256SUMS.txt before use.
