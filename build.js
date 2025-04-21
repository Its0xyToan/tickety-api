const rollup = require("rollup");

const files = [
  { input: "./src/index.js", output: "./build/index.js", format: "cjs" },
  { input: "./src/index.js", output: "./build/index.mjs", format: "es" },
];

let queue = [];

files.forEach((a) => {
  queue.push(
    new Promise((resolve) => {
      rollup
        .rollup({
          input: {
            input: a.input,
          },
          output: {
            file: a.output,
            format: a.format,
          },
        })
        .then(resolve);
    }),
  );
});

Promise.all(queue).then(() => {
  console.log("Build complete!");
});
