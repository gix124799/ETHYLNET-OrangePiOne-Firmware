'use strict';

const fs = require('fs');

/*
 * ETHYLNET local entitlement policy.
 *
 * This is intended to be the authoritative backend
 * source of entitlement values.
 */

const POLICY = Object.freeze({
    level: 4,

    limits: Object.freeze({
        hotspot: 1000,
        pppoe: 1000,
        vendo: 1000
    }),

    features: Object.freeze({
        eload: true,
        movie: true
    }),

    lifetime: true
});


function readHardwareSerial() {
    /*
     * Orange Pi / ARM first choice.
     */
    try {
        const cpuinfo =
            fs.readFileSync(
                '/proc/cpuinfo',
                'utf8'
            );

        const match =
            cpuinfo.match(
                /^Serial\s*:\s*(.+)$/im
            );

        if (
            match &&
            match[1]
        ) {
            return match[1].trim();
        }
    } catch (_) {}


    /*
     * Device-tree fallback.
     */
    const candidates = [
        '/sys/firmware/devicetree/base/serial-number',
        '/proc/device-tree/serial-number'
    ];

    for (const path of candidates) {
        try {
            if (
                fs.existsSync(path)
            ) {
                const value =
                    fs.readFileSync(path)
                        .toString()
                        .replace(/\0/g, '')
                        .trim();

                if (value) {
                    return value;
                }
            }
        } catch (_) {}
    }

    return '';
}


function formatSerial(serial) {
    const raw =
        String(serial || '')
            .trim();

    if (!raw) {
        return '';
    }

    if (
        /^OPI-[A-Za-z0-9]{1,10}$/i
            .test(raw)
    ) {
        return raw;
    }

    return (
        'OPI-' +
        raw.slice(-10)
    );
}


function serial() {
    return formatSerial(
        readHardwareSerial()
    );
}


function limitFor(type) {
    const key =
        String(type || '')
            .toLowerCase();

    if (
        !Object.prototype
            .hasOwnProperty
            .call(
                POLICY.limits,
                key
            )
    ) {
        throw new Error(
            'Unknown entitlement type: ' +
            type
        );
    }

    return POLICY.limits[key];
}


function canCreate(
    type,
    currentCount
) {
    const count =
        Number(currentCount);

    if (
        !Number.isFinite(count) ||
        count < 0
    ) {
        return false;
    }

    return (
        count <
        limitFor(type)
    );
}


function featureEnabled(name) {
    const key =
        String(name || '')
            .toLowerCase();

    return (
        POLICY.features[key] === true
    );
}


/*
 * Local ETHYLNET license never expires.
 *
 * 8640000000000000 is the maximum valid
 * JavaScript Date timestamp.
 */
function expirationTimestamp() {
    return 8640000000000000;
}


function expirationLabel() {
    return 'Lifetime';
}


function isExpired() {
    return false;
}


/*
 * eLoad entitlement is locally enabled.
 *
 * A valid provider/API key is still required
 * for actual eLoad transactions.
 */
function eloadProviderReady(apiKey) {
    return (
        featureEnabled('eload') &&
        typeof apiKey === 'string' &&
        apiKey.trim().length > 0
    );
}


function licenseObject() {
    return {
        level:
            POLICY.level,

        hotspot:
            POLICY.limits.hotspot,

        pppoe:
            POLICY.limits.pppoe,

        vendo:
            POLICY.limits.vendo,

        eload:
            POLICY.features.eload,

        movie:
            POLICY.features.movie,

        serial:
            serial(),

        expiration:
            expirationTimestamp(),

        lifetime:
            true
    };
}


module.exports = Object.freeze({
    POLICY,
    readHardwareSerial,
    formatSerial,
    serial,
    limitFor,
    canCreate,
    featureEnabled,
    expirationTimestamp,
    expirationLabel,
    isExpired,
    eloadProviderReady,
    licenseObject
});
