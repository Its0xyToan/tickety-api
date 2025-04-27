const { TicketyClient } = require("../");

const tickety = new TicketyClient({ port: 3001 });

tickety.on("ready", (port) => {
    console.log("Tickety is now listening on port " + port);
});

tickety.listen();