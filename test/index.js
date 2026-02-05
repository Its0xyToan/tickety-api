const { TicketyClient } = require("../");

const tickety = new TicketyClient({
  port: 3001,
  route: "tickety",
  key: "a1aa03e4a19b98fb0fe110943de1140c052b0219c3d70ba19c35aa6f",
});

tickety.on("ready", (infos) => {
  console.log(
    "Tickety is now listening on port " +
      infos.port +
      ", route: " +
      infos.connectUrl,
  );
});

tickety.on("ticket.create", (create) => {
  console.log(create);
});

tickety.on("ticket.close", (close) => {
  console.log(close);
});

tickety.on("ticket.claim", (claim) => {
  console.log(claim);
});

tickety.listen();
