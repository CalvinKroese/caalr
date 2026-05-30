// "Publish Website" endpoint.
//
// Triggers exactly ONE Netlify build by calling a build hook. Because build
// hooks bypass the `ignore` command in netlify.toml, this is the only thing
// that actually deploys the site — every CMS save is skipped until someone
// presses Publish.
//
// Configured entirely through environment variables in the Netlify dashboard,
// so no secrets live in the repo or the public page:
//   BUILD_HOOK_URL  (required) — the build hook URL from Netlify
//   PUBLISH_KEY     (optional) — a shared password the page must send

export const handler = async (event) => {
  const hookUrl = process.env.BUILD_HOOK_URL;
  const expectedKey = process.env.PUBLISH_KEY;

  if (!hookUrl) {
    return json(500, 'This site is not set up to publish yet (missing BUILD_HOOK_URL).');
  }

  const key = (event.queryStringParameters || {}).key;
  if (expectedKey && key !== expectedKey) {
    return json(401, 'Wrong password — please check and try again.');
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' });
    if (!res.ok) {
      return json(502, `Netlify refused the request (status ${res.status}). Try again in a minute.`);
    }
  } catch {
    return json(502, 'Could not reach Netlify. Please try again in a minute.');
  }

  return json(200, 'Publishing! Your changes will be live in a couple of minutes.');
};

function json(statusCode, message) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ok: statusCode === 200, message }),
  };
}
