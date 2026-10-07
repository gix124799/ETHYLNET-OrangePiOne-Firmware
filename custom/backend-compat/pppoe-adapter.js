'use strict';

const core =
    require('./core');


/*
 * Verified frontend contract:
 *
 * {
 *   active: {
 *     expired,
 *     remoteIP,
 *     mac,
 *     uptime
 *   },
 *
 *   info: {
 *     expiration,
 *     download,
 *     upload
 *   }
 * }
 *
 * NOTE:
 * PPPoE account expiration is NOT the same thing
 * as ETHYLNET license expiration.
 */
function buildGetInfo(
    runtime = {}
) {
    const active =
        runtime.active || null;

    const account =
        runtime.info || {};


    return {
        active:
            active
                ? {
                    expired:
                        Boolean(
                            active.expired
                        ),

                    remoteIP:
                        active.remoteIP ||
                        '',

                    mac:
                        active.mac ||
                        '',

                    uptime:
                        Number(
                            active.uptime || 0
                        )
                }
                : null,

        info: {
            expiration:
                Number(
                    account.expiration || 0
                ),

            download:
                account.download ?? 0,

            upload:
                account.upload ?? 0
        }
    };
}


/*
 * Verified callback contract:
 *
 * success:
 * { ok: true, message: "" }
 *
 * full:
 * { ok: false, message: "PPPoE is full..." }
 *
 * ETHYLNET policy has a real local limit of 1000.
 */
function accessCheck(
    activeCount
) {
    const result =
        core.checkCapacity(
            'pppoe',
            activeCount
        );

    if (!result.allowed) {
        return {
            ok: false,

            message:
                'PPPoE is full. Maximum ETHYLNET PPPoE capacity is 1000.'
        };
    }

    return {
        ok: true,
        message: ''
    };
}


/*
 * Generic Socket.IO-compatible binder.
 *
 * runtimeProvider may return:
 *
 * {
 *   active: {...},
 *   info: {...}
 * }
 */
function bind(
    socket,
    runtimeProvider
) {
    if (
        !socket ||
        typeof socket.on !== 'function'
    ) {
        throw new TypeError(
            'Socket must provide .on()'
        );
    }

    const provider =
        typeof runtimeProvider === 'function'
            ? runtimeProvider
            : () => ({});


    socket.on(
        'get-info',
        async function (callback) {
            if (
                typeof callback !== 'function'
            ) {
                return;
            }

            try {
                const runtime =
                    await provider();

                callback(
                    buildGetInfo(
                        runtime
                    )
                );
            } catch (_) {
                callback(
                    buildGetInfo({})
                );
            }
        }
    );
}


module.exports = Object.freeze({
    buildGetInfo,
    accessCheck,
    bind
});
