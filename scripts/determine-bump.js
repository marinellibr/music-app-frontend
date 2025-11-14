const fs = require("fs");

function main() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    console.error("GITHUB_EVENT_PATH not set");
    process.exit(2);
  }

  const ev = JSON.parse(fs.readFileSync(eventPath, "utf8"));
  let bump = "";

  if (process.env.GITHUB_EVENT_NAME === "pull_request") {
    if (
      ev.pull_request &&
      ev.pull_request.merged &&
      ev.pull_request.base &&
      ev.pull_request.base.ref === "main"
    ) {
      bump = "major";
    }
  } else {
    const commits = ev.commits || [];
    if (commits.some((c) => /^feat:/.test(c.message))) bump = "minor";
    else if (commits.some((c) => /^fix:/.test(c.message))) bump = "patch";
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, "bump=" + bump + "\n");
  } else {
    console.log("bump=" + bump);
  }
}

main();
