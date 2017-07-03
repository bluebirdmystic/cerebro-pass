"use strict";

const plugin = require("./plugin");
const icon = require("./icon.png");

let passwordStoreDir =
  process.env.PASSWORD_STORE || `${process.env.HOME}/.password-store`;

const handler = ({ term, display, actions }) => {
  const parsed = plugin.parse(term);
  if (!parsed) {
    return;
  }

  switch (parsed.action) {
    case "pass":
    case "otp":
      plugin.search(passwordStoreDir, parsed.query, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }

        const commands = { pass: "show", otp: "otp" };
        const results = files.map(file => {
          const command = commands[parsed.action];
          const entry = file.substring(0, file.length - 4);
          const action = `pass ${command} -c "${entry}"`;
          return plugin.render(entry, action, icon);
        });

        display(results);
      });
      break;

    case "passgen":
      const action = `pass generate -c "${parsed.query}"`;
      display([plugin.render(`Generate ${parsed.query}...`, action, icon)]);
      break;
  }
};

module.exports = {
  fn: handler
};
