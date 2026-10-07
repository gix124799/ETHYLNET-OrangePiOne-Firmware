from pathlib import Path
import hashlib
import os
import stat

base = Path.home() / "ETHYLNET-OrangePiOne-Audit"

src = base / "baseline/rootfs/soft/index.o"
shimfile = base / "pkg-bootstrap/candidate2-shim.js"
dst = base / "modified/index.o.candidate2"
prelude_out = base / "pkg-bootstrap/prelude-candidate2.js"

PRELUDE_POS = 48862122
PAYLOAD_POS = 42575260
PAYLOAD_SIZE = 6286862

orig = src.read_bytes()
shim = shimfile.read_bytes()
prelude = orig[PRELUDE_POS:]

needle = b"  Module.runMain = function runMain() {\n"

count = prelude.count(needle)

print("INSERT_COUNT:", count)

if count != 1:
    raise SystemExit(
        "ERROR: runMain marker not unique"
    )

new_prelude = prelude.replace(
    needle,
    shim + b"\n" + needle,
    1
)

prelude_out.write_bytes(
    new_prelude
)

candidate = bytearray(
    orig[:PRELUDE_POS] +
    new_prelude
)

old_decl = (
    b"var PRELUDE_SIZE = '219629            ' | 0;"
)

decl_count = (
    candidate[:PRELUDE_POS]
    .count(old_decl)
)

print(
    "PRELUDE_DECL_COUNT:",
    decl_count
)

if decl_count != 1:
    raise SystemExit(
        "ERROR: PRELUDE_SIZE marker not unique"
    )

size_text = (
    str(len(new_prelude))
    .encode("ascii")
)

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

orig_payload = orig[
    PAYLOAD_POS:
    PAYLOAD_POS + PAYLOAD_SIZE
]

new_payload = candidate[
    PAYLOAD_POS:
    PAYLOAD_POS + PAYLOAD_SIZE
]

changes = [
    i
    for i, (a, b) in enumerate(
        zip(
            orig[:PRELUDE_POS],
            candidate[:PRELUDE_POS]
        )
    )
    if a != b
]

print(
    "ORIGINAL_SIZE:",
    len(orig)
)

print(
    "PRELUDE_SIZE:",
    len(new_prelude)
)

print(
    "CANDIDATE_SIZE:",
    len(candidate)
)

print(
    "V8_PAYLOAD_IDENTICAL:",
    orig_payload == new_payload
)

print(
    "CHANGED_BYTES_BEFORE_PRELUDE:",
    len(changes)
)

print(
    "CHANGED_OFFSETS:",
    changes[:30]
)

print(
    "SHA256:",
    hashlib.sha256(
        candidate
    ).hexdigest()
)
