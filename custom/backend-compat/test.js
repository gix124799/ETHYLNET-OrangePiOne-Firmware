'use strict';

const assert =
    require('assert');

const core =
    require('./core');


const runtime =
    core.runtimeLicense();

const display =
    core.displayLicense();


assert.strictEqual(
    runtime.level,
    4
);

assert.strictEqual(
    runtime.hotspot,
    1000
);

assert.strictEqual(
    runtime.pppoe,
    1000
);

assert.strictEqual(
    runtime.vendo,
    1000
);

assert.strictEqual(
    runtime.eload,
    true
);

assert.strictEqual(
    runtime.movie,
    true
);

assert.strictEqual(
    runtime.lifetime,
    true
);


assert.strictEqual(
    display.expiration,
    'Lifetime'
);


for (
    const type
    of [
        'hotspot',
        'pppoe',
        'vendo'
    ]
) {
    const at999 =
        core.checkCapacity(
            type,
            999
        );

    const at1000 =
        core.checkCapacity(
            type,
            1000
        );

    assert.strictEqual(
        at999.allowed,
        true
    );

    assert.strictEqual(
        at1000.allowed,
        false
    );

    assert.strictEqual(
        at999.limit,
        1000
    );
}


assert.strictEqual(
    core.featureStatus().eload,
    true
);

assert.strictEqual(
    core.featureStatus().movie,
    true
);


assert.strictEqual(
    core.eloadStatus('').enabled,
    true
);

assert.strictEqual(
    core.eloadStatus('').provider_ready,
    false
);

assert.strictEqual(
    core.eloadStatus('VALID-TEST-KEY').enabled,
    true
);

assert.strictEqual(
    core.eloadStatus('VALID-TEST-KEY').provider_ready,
    true
);


console.log(
    JSON.stringify(
        {
            runtime,
            display,

            capacity: {
                hotspot_999:
                    core.checkCapacity(
                        'hotspot',
                        999
                    ),

                hotspot_1000:
                    core.checkCapacity(
                        'hotspot',
                        1000
                    ),

                pppoe_999:
                    core.checkCapacity(
                        'pppoe',
                        999
                    ),

                pppoe_1000:
                    core.checkCapacity(
                        'pppoe',
                        1000
                    ),

                vendo_999:
                    core.checkCapacity(
                        'vendo',
                        999
                    ),

                vendo_1000:
                    core.checkCapacity(
                        'vendo',
                        1000
                    )
            },

            features:
                core.featureStatus()
        },
        null,
        2
    )
);

console.log();
console.log(
    'ETHYLNET_COMPAT_SELFTEST=PASS'
);
