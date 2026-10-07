'use strict';

const path = require('path');

const entitlements =
    require(
        path.resolve(
            __dirname,
            '../backend/ethyl-entitlements.js'
        )
    );


function runtimeLicense() {
    const license =
        entitlements.licenseObject();

    return {
        level: 4,

        hotspot:
            1000,

        pppoe:
            1000,

        vendo:
            1000,

        eload:
            true,

        movie:
            true,

        /*
         * Actual Orange Pi serial remains the source.
         * UI/runtime-facing formatted form:
         * OPI- + final 10 characters.
         */
        serial:
            license.serial,

        /*
         * Numeric backend representation.
         * UI display remains "Lifetime".
         */
        expiration:
            entitlements.expirationTimestamp(),

        lifetime:
            true
    };
}


function displayLicense() {
    const license =
        runtimeLicense();

    return {
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
            license.serial,

        expiration:
            'Lifetime'
    };
}


function checkCapacity(
    type,
    currentCount
) {
    const key =
        String(type || '')
            .toLowerCase();

    if (
        key !== 'hotspot' &&
        key !== 'pppoe' &&
        key !== 'vendo'
    ) {
        return {
            allowed: false,
            reason: 'unknown-type'
        };
    }

    const limit =
        entitlements.limitFor(key);

    const current =
        Number(currentCount);

    if (
        !Number.isFinite(current) ||
        current < 0
    ) {
        return {
            allowed: false,
            reason: 'invalid-count',
            type: key,
            limit
        };
    }

    return {
        allowed:
            current < limit,

        type: key,

        current,

        limit,

        remaining:
            Math.max(
                0,
                limit - current
            )
    };
}


function featureStatus() {
    return {
        eload:
            entitlements.featureEnabled(
                'eload'
            ),

        movie:
            entitlements.featureEnabled(
                'movie'
            )
    };
}


/*
 * eLoad feature entitlement is enabled locally.
 *
 * Actual transaction execution still requires the
 * existing valid provider/API configuration.
 * This function does NOT manufacture or bypass
 * provider credentials.
 */
function eloadStatus(apiKey) {
    const feature =
        entitlements.featureEnabled(
            'eload'
        );

    const providerReady =
        entitlements.eloadProviderReady(
            apiKey || ''
        );

    return {
        enabled:
            feature,

        provider_ready:
            providerReady
    };
}


function normalizedInfo() {
    return {
        license:
            runtimeLicense(),

        display:
            displayLicense(),

        features:
            featureStatus(),

        limits: {
            hotspot:
                1000,

            pppoe:
                1000,

            vendo:
                1000
        }
    };
}


module.exports = Object.freeze({
    runtimeLicense,
    displayLicense,
    checkCapacity,
    featureStatus,
    eloadStatus,
    normalizedInfo
});
