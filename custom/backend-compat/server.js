'use strict';

const http =
    require('http');

const core =
    require('./core');


const HOST =
    process.env.ETHYLNET_COMPAT_HOST ||
    '127.0.0.1';

const PORT =
    Number(
        process.env.ETHYLNET_COMPAT_PORT ||
        39001
    );


function send(
    res,
    status,
    body
) {
    const data =
        JSON.stringify(
            body,
            null,
            2
        );

    res.writeHead(
        status,
        {
            'Content-Type':
                'application/json; charset=utf-8',

            'Content-Length':
                Buffer.byteLength(data),

            'Cache-Control':
                'no-store'
        }
    );

    res.end(data);
}


const server =
    http.createServer(
        (req, res) => {
            let url;

            try {
                url =
                    new URL(
                        req.url,
                        `http://${req.headers.host || 'localhost'}`
                    );
            } catch (_) {
                send(
                    res,
                    400,
                    {
                        ok: false,
                        error: 'bad-url'
                    }
                );

                return;
            }


            if (
                req.method === 'GET' &&
                url.pathname === '/health'
            ) {
                send(
                    res,
                    200,
                    {
                        ok: true,
                        service:
                            'ETHYLNET backend compatibility core'
                    }
                );

                return;
            }


            if (
                req.method === 'GET' &&
                url.pathname === '/policy'
            ) {
                send(
                    res,
                    200,
                    core.normalizedInfo()
                );

                return;
            }


            if (
                req.method === 'GET' &&
                url.pathname === '/license'
            ) {
                send(
                    res,
                    200,
                    core.displayLicense()
                );

                return;
            }


            if (
                req.method === 'GET' &&
                url.pathname === '/capacity'
            ) {
                const type =
                    url.searchParams.get(
                        'type'
                    );

                const current =
                    Number(
                        url.searchParams.get(
                            'current'
                        )
                    );

                send(
                    res,
                    200,
                    core.checkCapacity(
                        type,
                        current
                    )
                );

                return;
            }


            /*
             * Do not pretend the original
             * /pppoe or /voucher payload contract
             * is fully known yet.
             */
            if (
                url.pathname === '/pppoe' ||
                url.pathname === '/voucher'
            ) {
                send(
                    res,
                    501,
                    {
                        ok: false,

                        error:
                            'contract-payload-not-yet-verified',

                        path:
                            url.pathname
                    }
                );

                return;
            }


            send(
                res,
                404,
                {
                    ok: false,
                    error: 'not-found'
                }
            );
        }
    );


server.listen(
    PORT,
    HOST,
    () => {
        console.log(
            `ETHYLNET_COMPAT_READY=http://${HOST}:${PORT}`
        );
    }
);
