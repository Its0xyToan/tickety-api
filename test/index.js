const { TicketyClient } = require("../");

const tickety = new TicketyClient({ port: 3001, key: "" });

tickety.on("ready", (infos) => {
    console.log("Tickety is now listening on port " + infos.port);
});

tickety.listen();