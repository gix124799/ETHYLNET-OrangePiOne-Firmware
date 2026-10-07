(() => {
  const fs = require("fs");

  function show(label, path) {
    try {
      const data = fs.readFileSync(path, "utf8");

      console.log(
        "[ETHYL-SELFTEST]",
        label,
        data
      );
    } catch (e) {
      console.log(
        "[ETHYL-SELFTEST]",
        label,
        "ERROR",
        e && e.message
      );
    }
  }

  show(
    "VENDO_RUNTIME",
    "/mnt/wifi5/config/vendo.json"
  );

  show(
    "RENTAL_RUNTIME",
    "/mnt/wifi5/rental-app/data.json"
  );

  show(
    "ELOAD_RUNTIME",
    "/mnt/wifi5/config/eload.json"
  );

  console.log(
    "[ETHYL-SELFTEST] LICENSE_INITIAL",
    JSON.stringify(global.license)
  );

  setTimeout(() => {
    try {
      console.log(
        "[ETHYL-SELFTEST] LICENSE_AFTER_APP",
        JSON.stringify(global.license)
      );
    } catch (e) {
      console.log(
        "[ETHYL-SELFTEST] LICENSE_AFTER_APP",
        "ERROR",
        e && e.message
      );
    }
  }, 5000);
})();
