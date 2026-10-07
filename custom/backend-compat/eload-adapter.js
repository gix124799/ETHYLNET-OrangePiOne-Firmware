'use strict';

const core =
    require('./core');


function createState() {
    return {
        /*
         * Local ETHYLNET entitlement:
         * always enabled by policy.
         */
        enabled:
            core.featureStatus()
                .eload === true,

        /*
         * Provider state remains independent.
         */
        providerAllowed:
            false,

        apiKey:
            null,

        ready:
            false
    };
}


/*
 * Verified outgoing provider request:
 *
 * {
 *   getAllowed: true,
 *   serial: <serial>
 * }
 */
function buildGetAllowedRequest() {
    return {
        getAllowed:
            true,

        serial:
            core.runtimeLicense()
                .serial || null
    };
}


/*
 * Existing provider response contract:
 *
 * {
 *   allowed: true/false,
 *   apikey: "..."
 * }
 *
 * Do not manufacture provider credentials.
 */
function applyProviderStatus(
    state,
    payload
) {
    const target =
        state || createState();

    const data =
        payload &&
        typeof payload === 'object'
            ? payload
            : {};


    target.enabled =
        true;

    target.ready =
        true;

    target.providerAllowed =
        data.allowed === true;


    if (
        data.allowed === true &&
        typeof data.apikey === 'string' &&
        data.apikey.trim()
    ) {
        target.apiKey =
            data.apikey.trim();
    }
    else if (
        data.allowed === false
    ) {
        target.apiKey =
            null;
    }


    return target;
}


/*
 * Verified add-API request family.
 */
function buildAddApiRequest(
    api,
    email
) {
    return {
        addEloadAPI:
            api,

        email:
            email || null,

        serial:
            core.runtimeLicense()
                .serial || null
    };
}


/*
 * Generic binder for the verified
 * @E-Load-RX provider event.
 */
function bindRx(
    socket,
    state,
    persist
) {
    if (
        !socket ||
        typeof socket.on !== 'function'
    ) {
        throw new TypeError(
            'Socket must provide .on()'
        );
    }

    const target =
        state || createState();


    socket.on(
        '@E-Load-RX',
        async function (payload) {
            applyProviderStatus(
                target,
                payload
            );

            if (
                typeof persist === 'function'
            ) {
                await persist(
                    {
                        allowed:
                            target.providerAllowed,

                        apikey:
                            target.apiKey
                    }
                );
            }
        }
    );


    return target;
}


/*
 * Emit verified getAllowed request.
 */
function requestProviderStatus(
    socket,
    callback
) {
    if (
        !socket ||
        typeof socket.emit !== 'function'
    ) {
        throw new TypeError(
            'Socket must provide .emit()'
        );
    }

    socket.emit(
        '@E-Load-TX',

        buildGetAllowedRequest(),

        function (response) {
            if (
                typeof callback === 'function'
            ) {
                callback(
                    response
                );
            }
        }
    );
}


module.exports = Object.freeze({
    createState,
    buildGetAllowedRequest,
    applyProviderStatus,
    buildAddApiRequest,
    bindRx,
    requestProviderStatus
});
