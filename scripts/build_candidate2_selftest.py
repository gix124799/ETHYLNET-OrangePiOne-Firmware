from pathlib import Path
import os
import stat
import hashlib

base = Path.home() / "ETHYLNET-OrangePiOne-Audit"

src = base / "baseline/rootfs/soft/index.o"
shim = base / "pkg-bootstrap/candidate2-shim.js"
test = base / "pkg-bootstrap/candidate2-selftest.js"
dst = base / "modified/index.o.candidate2-selftest"

PRELUDE_POS = 48862122
PAYLOAD_POS = 42575260
PAYLOAD_SIZE = 6286862

orig = src.read_bytes()
prelude = orig[PRELUDE_POS:]

needle = b"  Module.runMain = function runMain() {\n"

print(
    "INSERT_COUNT:",
    prelude.count(needle)
)

if prelude.count(needle) != 1:
    raise SystemExit(
        "ERROR: runMain marker not unique"
    )

insert = (
    shim.read_bytes() +
    b"\n" +
    test.read_bytes() +
    b"\n"
)

new_prelude = prelude.replace(
    needle,
    insert + needle,
    1
)

candidate = bytearray(
    orig[:PRELUDE_POS] +
    new_prelude
)

old_decl = (
    b"var PRELUDE_SIZE = '219629            ' | 0;"
)

print(
    "DECL_COUNT:",
    candidate[:PRELUDE_POS].count(old_decl)
)

if candidate[:PRELUDE_POS].count(old_decl) != 1:
    raise SystemExit(
        "ERROR: PRELUDE_SIZE marker not unique"
    )

size_text = str(
    len(new_prelude)
).encode("ascii")

new_decl = (
    b"var PRELUDE_SIZE = '" +
    size_text.ljust(18, b" ") +
    b"' | 0;"
)

candidate = candidate.replace(
    old_decl,
    new_decl,
    1
)

dst.write_bytes(candidate)

os.chmod(
    dst,
    stat.S_IMODE(
        src.stat().st_mode
    )
)

print(
    "V8_PAYLOAD_IDENTICAL:",
    orig[
        PAYLOAD_POS:
        PAYLOAD_POS + PAYLOAD_SIZE
    ] ==
    candidate[
        PAYLOAD_POS:
        PAYLOAD_POS + PAYLOAD_SIZE
    ]
)

print(
    "SIZE:",
    len(candidate)
)

print(
    "SHA256:",
    hashlib.sha256(
        candidate
    ).hexdigest()
)
