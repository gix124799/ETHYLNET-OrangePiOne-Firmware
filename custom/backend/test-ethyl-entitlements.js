'use strict';

const assert =
    require('assert');

const ent =
    require('./ethyl-entitlements');


const license =
    ent.licenseObject();


assert.strictEqual(
    license.level,
    4
);

assert.strictEqual(
    license.hotspot,
    1000
);

assert.strictEqual(
    license.pppoe,
    1000
);

assert.strictEqual(
    license.vendo,
    1000
);

assert.strictEqual(
    license.eload,
    true
);

assert.strictEqual(
    license.movie,
    true
);

assert.strictEqual(
    license.lifetime,
    true
);

assert.strictEqual(
    ent.expirationLabel(),
    'Lifetime'
);

assert.strictEqual(
    ent.isExpired(),
    false
);


assert.strictEqual(
    ent.canCreate(
        'hotspot',
        999
    ),
    true
);

assert.strictEqual(
    ent.canCreate(
        'hotspot',
        1000
    ),
    false
);


assert.strictEqual(
    ent.canCreate(
        'pppoe',
        999
    ),
    true
);

assert.strictEqual(
    ent.canCreate(
        'pppoe',
        1000
    ),
    false
);


assert.strictEqual(
    ent.canCreate(
        'vendo',
        999
    ),
    true
);

assert.strictEqual(
    ent.canCreate(
        'vendo',
        1000
    ),
    false
);


assert.strictEqual(
    ent.featureEnabled('eload'),
    true
);

assert.strictEqual(
    ent.featureEnabled('movie'),
    true
);


const sample =
    ent.formatSerial(
        '1234567890ABCDEFGHIJK'
    );

assert.strictEqual(
    sample,
    'OPI-BCDEFGHIJK'
);


console.log(
    JSON.stringify(
        {
            policy: license,

            display: {
                level:
                    license.level,

                hotspot:
                    license.hotspot,

                pppoe:
                    license.pppoe,

                vendo:
                    license.vendo,

                eload:
                    license.eload,

                movie:
                    license.movie,

                serial:
                    license.serial ||
                    'OPI-[hardware serial unavailable on this PC]',

                expiration:
                    ent.expirationLabel()
            },

            tests: {
                hotspot_999:
                    ent.canCreate(
                        'hotspot',
                        999
                    ),

                hotspot_1000:
                    ent.canCreate(
                        'hotspot',
                        1000
                    ),

                pppoe_999:
                    ent.canCreate(
                        'pppoe',
                        999
                    ),

                pppoe_1000:
                    ent.canCreate(
                        'pppoe',
                        1000
                    ),

                vendo_999:
                    ent.canCreate(
                        'vendo',
                        999
                    ),

                vendo_1000:
                    ent.canCreate(
                        'vendo',
                        1000
                    ),

                movie:
                    ent.featureEnabled(
                        'movie'
                    ),

                eload:
                    ent.featureEnabled(
                        'eload'
                    ),

                lifetime:
                    !ent.isExpired()
            }
        },
        null,
        2
    )
);

console.log();
console.log(
    'BACKEND_POLICY_SELFTEST=PASS'
);
