'use strict';

const pppoe =
    require('./pppoe-adapter');

const eload =
    require('./eload-adapter');


function bindPppoe(
    socket,
    runtimeProvider
) {
    pppoe.bind(
        socket,
        runtimeProvider
    );

    return socket;
}


function bindEload(
    socket,
    state,
    persist
) {
    return eload.bindRx(
        socket,
        state,
        persist
    );
}


module.exports = Object.freeze({
    bindPppoe,
    bindEload
});
