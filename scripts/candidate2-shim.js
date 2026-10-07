(() => {
  const FUTURE = 4102444800000;

  /* ---------- LOCAL LICENSE ---------- */

  let localLicense = {};

  function normalizeLicense(v) {
    const incoming =
      v && typeof v === "object" ? v : {};

    const n = Object.assign(
      {},
      localLicense,
      incoming
    );

    n.hotspot = 1;
    n.pppoe = 1;
    n.vendo = 1;
    n.movie = true;
    n.eload = true;
    n.checked = FUTURE;
    n.expiration = FUTURE;

    return n;
  }

  try {
    Object.defineProperty(global, "license", {
      configurable: true,
      enumerable: true,

      get() {
        return localLicense;
      },

      set(v) {
        localLicense = normalizeLicense(v);
      }
    });

    global.license = {};

    console.log(
      "[ETHYLNET] local license enabled"
    );
  } catch (e) {
    console.log(
      "[ETHYLNET] license hook error:",
      e && e.message
    );
  }


  /* ---------- LOCAL JSON STATE ---------- */

  const fs = require("fs");

  const oldReadFile = fs.readFile;
  const oldReadFileSync = fs.readFileSync;
  const oldWriteFile = fs.writeFile;
  const oldWriteFileSync = fs.writeFileSync;


  function pathText(v) {
    try {
      return Buffer.isBuffer(v)
        ? v.toString()
        : String(v || "");
    } catch (_) {
      return "";
    }
  }


  function transform(path, data) {
    const p = pathText(path);

    const isVendo =
      p.endsWith(
        "/mnt/wifi5/config/vendo.json"
      );

    const isRental =
      p.endsWith(
        "/mnt/wifi5/rental-app/data.json"
      );

    if (!isVendo && !isRental) {
      return data;
    }

    try {
      const wasBuffer =
        Buffer.isBuffer(data);

      const text =
        wasBuffer
          ? data.toString("utf8")
          : String(data);

      const obj = JSON.parse(text);


      if (isVendo) {
        const walk = (x) => {
          if (
            !x ||
            typeof x !== "object"
          ) {
            return;
          }

          if (
            Object.prototype.hasOwnProperty.call(
              x,
              "alloweddate"
            )
          ) {
            x.alloweddate = FUTURE;
          }

          for (const k of Object.keys(x)) {
            walk(x[k]);
          }
        };

        walk(obj);
      }


      if (
        isRental &&
        obj &&
        typeof obj === "object"
      ) {
        for (const k of Object.keys(obj)) {
          const d = obj[k];

          if (
            !d ||
            typeof d !== "object"
          ) {
            continue;
          }

          if (
            "serial" in d ||
            "activated" in d ||
            "license_status" in d ||
            "expiration" in d
          ) {
            d.activated = true;
            d.license_status = "active";
            d.expiration = FUTURE;
          }
        }
      }


      const out = JSON.stringify(obj);

      return wasBuffer
        ? Buffer.from(out)
        : out;

    } catch (_) {
      return data;
    }
  }


  fs.readFile = function(path) {
    const args =
      Array.from(arguments);

    const pos =
      args.length - 1;

    const cb =
      args[pos];

    if (typeof cb === "function") {
      args[pos] =
        function(err, data) {
          if (!err) {
            data = transform(
              path,
              data
            );
          }

          return cb.call(
            this,
            err,
            data
          );
        };
    }

    return oldReadFile.apply(
      this,
      args
    );
  };


  fs.readFileSync = function(path) {
    const data =
      oldReadFileSync.apply(
        this,
        arguments
      );

    return transform(
      path,
      data
    );
  };


  fs.writeFile = function(path, data) {
    const args =
      Array.from(arguments);

    args[1] =
      transform(
        path,
        data
      );

    return oldWriteFile.apply(
      this,
      args
    );
  };


  fs.writeFileSync = function(path, data) {
    const args =
      Array.from(arguments);

    args[1] =
      transform(
        path,
        data
      );

    return oldWriteFileSync.apply(
      this,
      args
    );
  };


  /* ---------- REMOTE CONTROL FILTER ---------- */

  const oldLoad = Module._load;

  const vendorRE =
    /wifi5-soft\.net|wifi5-server1\.com|wifi5-server2\.com/i;

  const blocked =
    new Set([
      "@SSH0887",
      "@HTTP0887",
      "eval",
      "@sysupgrade-!688$"
    ]);


  function isVendor(v) {
    return vendorRE.test(
      String(v || "")
    );
  }


  function filterOn(socket) {
    if (
      !socket ||
      typeof socket.on !== "function" ||
      socket.__ethylFiltered
    ) {
      return socket;
    }

    const oldOn =
      socket.on;

    try {
      Object.defineProperty(
        socket,
        "__ethylFiltered",
        {
          value: true,
          enumerable: false
        }
      );
    } catch (_) {}

    socket.on =
      function(event) {
        if (
          blocked.has(
            String(event)
          )
        ) {
          console.log(
            "[ETHYLNET] blocked:",
            event
          );

          return this;
        }

        return oldOn.apply(
          this,
          arguments
        );
      };

    return socket;
  }


  function callbackOf(args) {
    for (
      let i = args.length - 1;
      i >= 0;
      i--
    ) {
      if (
        typeof args[i] === "function"
      ) {
        return args[i];
      }
    }

    return null;
  }


  Module._load =
    function(request) {

      const loaded =
        oldLoad.apply(
          this,
          arguments
        );

      const req =
        String(request || "");


      /*
       * Preserve the socket itself because
       * eLoad uses @E-Load-TX / @E-Load-RX.
       */
      if (
        req === "socket.io-client" &&
        loaded &&
        typeof loaded.connect === "function" &&
        !loaded.__ethylWrapped
      ) {
        const oldConnect =
          loaded.connect;

        try {
          Object.defineProperty(
            loaded,
            "__ethylWrapped",
            {
              value: true,
              enumerable: false
            }
          );
        } catch (_) {}

        loaded.connect =
          function(url) {
            const socket =
              oldConnect.apply(
                this,
                arguments
              );

            if (isVendor(url)) {
              filterOn(socket);
            }

            return socket;
          };
      }


      /*
       * Localize license and sub-vendo API.
       * start/socket/sendinfo remain original.
       */
      if (
        req.includes("client-io.js") &&
        loaded &&
        typeof loaded === "object" &&
        !loaded.__ethylLocal
      ) {
        try {
          Object.defineProperty(
            loaded,
            "__ethylLocal",
            {
              value: true,
              enumerable: false
            }
          );
        } catch (_) {}


        loaded.redemlicense =
          function() {
            const args =
              Array.from(arguments);

            const cb =
              callbackOf(args);

            global.license =
              normalizeLicense(
                global.license
              );

            if (cb) {
              try {
                cb(global.license);
              } catch (_) {}
            }

            return global.license;
          };


        function localSub() {
          const args =
            Array.from(arguments);

          const cb =
            callbackOf(args);

          const result = {
            allow: true,
            allowed: true,
            timeout: FUTURE,
            alloweddate: FUTURE,
            expirationdate: FUTURE
          };

          if (cb) {
            try {
              cb(result);
            } catch (_) {}
          }

          return result;
        }


        loaded.redemsublicense =
          localSub;

        loaded.subvendo =
          localSub;


        console.log(
          "[ETHYLNET] local client license enabled"
        );
      }


      return loaded;
    };


  console.log(
    "[ETHYLNET] candidate2 loaded"
  );
})();
