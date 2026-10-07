'use strict';

const assert =
    require('assert');

const pppoe =
    require('./pppoe-adapter');

const eload =
    require('./eload-adapter');


/* ---------------------------------------------
 * PPPoE get-info
 * --------------------------------------------- */

const info =
    pppoe.buildGetInfo({
        active: {
            expired: false,
            remoteIP: '172.16.10.2',
            mac: 'AA:BB:CC:DD:EE:FF',
            uptime: 3600
        },

        info: {
            expiration:
                1893456000000,

            download:
                10000000,

            upload:
                5000000
        }
    });


assert.deepStrictEqual(
    info,
    {
        active: {
            expired: false,
            remoteIP: '172.16.10.2',
            mac: 'AA:BB:CC:DD:EE:FF',
            uptime: 3600
        },

        info: {
            expiration:
                1893456000000,

            download:
                10000000,

            upload:
                5000000
        }
    }
);


/* ---------------------------------------------
 * PPPoE capacity
 * --------------------------------------------- */

assert.deepStrictEqual(
    pppoe.accessCheck(999),
    {
        ok: true,
        message: ''
    }
);


const full =
    pppoe.accessCheck(1000);

assert.strictEqual(
    full.ok,
    false
);

assert.match(
    full.message,
    /1000/
);


/* ---------------------------------------------
 * eLoad local entitlement
 * --------------------------------------------- */

const state =
    eload.createState();

assert.strictEqual(
    state.enabled,
    true
);


/* ---------------------------------------------
 * Provider allowed + API
 * --------------------------------------------- */

eload.applyProviderStatus(
    state,
    {
        allowed: true,
        apikey: 'PROVIDER-KEY'
    }
);

assert.strictEqual(
    state.enabled,
    true
);

assert.strictEqual(
    state.providerAllowed,
    true
);

assert.strictEqual(
    state.apiKey,
    'PROVIDER-KEY'
);


/* ---------------------------------------------
 * Provider disallowed does NOT disable
 * local ETHYLNET eLoad feature flag.
 * It only marks provider unavailable.
 * --------------------------------------------- */

eload.applyProviderStatus(
    state,
    {
        allowed: false
    }
);

assert.strictEqual(
    state.enabled,
    true
);

assert.strictEqual(
    state.providerAllowed,
    false
);

assert.strictEqual(
    state.apiKey,
    null
);


/* ---------------------------------------------
 * getAllowed request
 * --------------------------------------------- */

const req =
    eload.buildGetAllowedRequest();

assert.strictEqual(
    req.getAllowed,
    true
);

assert.ok(
    Object.prototype.hasOwnProperty.call(
        req,
        'serial'
    )
);


console.log(
    JSON.stringify(
        {
            pppoe: {
                info,
                at999:
                    pppoe.accessCheck(
                        999
                    ),

                at1000:
                    pppoe.accessCheck(
                        1000
                    )
            },

            eload: {
                local_enabled:
                    state.enabled,

                getAllowed:
                    req
            }
        },
        null,
        2
    )
);

console.log();
console.log(
    'ETHYLNET_ADAPTER_SELFTEST=PASS'
);
