---
description: When writing code for a Netlify site, you can use the following context for these capabilities: Creating new sites,
globs: **/*.{ts,tsx,js,jsx,toml}
trigger: always_on
---

<ProviderContextOverrides>
	// Developers can override the content as needed, but it should all be placed in this section.


</ProviderContextOverrides>

ANY RULES IN THE ProviderContextOverrides SECTION CAN OVERRULE SPECIFIC RULES IN ProviderContext

<ProviderContext version="1.0" provider="netlify">
## General
- The `.netlify` folder is not for user code. Add it to `.gitignore`.
- Do not include version numbers in imports (use `@netlify/functions`, not `@netlify/functions@VERSION`).
- Never add CORS headers (e.g., `Access-Control-Allow-Origin`) unless explicitly requested by the user.
- Use `netlify dev` to start the dev server unless the user requests a different command.

## Guidelines
- Netlify Blobs: Use for general object/state/data storage.
- Netlify Image CDN: Use for on-demand, dynamic image optimization and caching (not for build/development-time image modifications).
- Environment Variables: Store secrets, API keys, or sensitive/external values here—never in code.


# Creating new sites

- do not add redirects to netlify.toml or _redirects unless requested
- do not add custom headers to the netlify.toml or _headers unless requested

# Initializing sites or linking them
- determine if a site is linked by checking if `PROJECT_FOLDER/.netlify/state.json` file exists and it has a populated `siteId` value.
- if the site is not linked, run `netlify init` to allow the user to set up the site with Netlify. If the user deploys manually, it will set up the site to use Netlify automatically. If the user decides to set up a repo, they might have to set up the repo first. If the site is already set up on netlify then run `netlify link` for the user to input the credentials to link.

</ProviderContext>
