import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { imageSize } from "image-size";

// A markdown-it plugin must render synchronously. Because Node's HTTP APIs are
// asynchronous, we can't fetch an image URL directly here. Instead, this is a
// small standalone script that we run in a *separate* Node.js child process via
// execFileSync below. Running it in its own process lets it use the normal async
// node:http/https APIs freely, while execFileSync blocks the parent until the
// child exits and captures whatever it writes to stdout (the image bytes).
//
// It's an inline template string so the plugin ships as a single self-contained
// file with no extra runtime dependency. We pass the URL in as argv[1] (not via
// shell interpolation) and stream the raw image bytes back to the parent, which
// avoids the JSON/base64 serialization overhead of the old sync-fetch approach.
const FETCH_SCRIPT = `
const http = require("node:http");
const https = require("node:https");

function fetch(url, redirectCount) {
  if (redirectCount > 5) {
    process.stderr.write("Too many redirects");
    process.exit(1);
  }
  const mod = url.startsWith("https") ? https : http;
  mod.get(url, { timeout: 30000 }, (response) => {
    // Follow redirects (e.g. http -> https) up to a bounded number of times.
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      fetch(response.headers.location, redirectCount + 1);
      return;
    }
    // Any non-200 is an error; report it on stderr so the parent's execFileSync
    // throws instead of trying to parse a non-image body.
    if (response.statusCode !== 200) {
      process.stderr.write("HTTP " + response.statusCode);
      process.exit(1);
    }
    const chunks = [];
    response.on("data", (chunk) => chunks.push(chunk));
    response.on("end", () => {
      // stdout is captured synchronously by the parent and returned as a Buffer.
      process.stdout.write(Buffer.concat(chunks));
    });
    response.on("error", (err) => {
      process.stderr.write(err.message);
      process.exit(1);
    });
  }).on("error", (err) => {
    process.stderr.write(err.message);
    process.exit(1);
  });
}

fetch(process.argv[1], 0);
`;

export type Dimensions = {
  width?: number | undefined;
  height?: number | undefined;
};

export function getImageDimensionsFromLocalImage(imageUrl: string): Dimensions {
  try {
    const buffer = readFileSync(imageUrl);
    const { width, height } = imageSize(buffer);

    return { width, height };
  } catch (error) {
    console.error(
      `markdown-it-image-size: Could not get dimensions of image with url ${imageUrl}.\n\n`,
      error,
    );

    return { width: undefined, height: undefined };
  }
}

export function getImageDimensionsFromExternalImage(
  imageUrl: string,
): Dimensions {
  const isMissingProtocol = imageUrl.startsWith("//");
  const url = isMissingProtocol ? `https:${imageUrl}` : imageUrl;

  try {
    // Run the FETCH_SCRIPT above in a child Node process and block until it
    // finishes. process.execPath is the current Node binary, "--eval" runs the
    // script, and "--" separates Node's own flags from the URL argument, which
    // becomes process.argv[1] inside the script. The returned Buffer is the
    // image bytes that the child wrote to stdout.
    const buffer = execFileSync(
      process.execPath,
      ["--eval", FETCH_SCRIPT, "--", url],
      {
        maxBuffer: Number.POSITIVE_INFINITY,
        timeout: 30000,
      },
    );
    const { width, height } = imageSize(buffer);
    return { width, height };
  } catch (error) {
    console.error(
      `markdown-it-image-size: Could not get dimensions of image with url ${url}.\n\n`,
      error,
    );
    return { width: undefined, height: undefined };
  }
}
