![ElevenLabs & Netlify](/images/elevenlabs-logo-black.svg)

# ElevenLabs + Netlify AI Starter

[![Netlify Status](https://api.netlify.com/api/v1/badges/d5efd8aa-ae58-4fae-8633-c8c35c46bf3e/deploy-status)](https://app.netlify.com/sites/nuxt-ai-chat/deploys)

This is a [Astro](https://astro.build/) project set up to be instantly deployed to [Netlify](https://www.netlify.com/)! You can take a look at the live version of the site [here](https://elevenlabs-ai-chat.netlify.app).

This project is a simple example of ElevenLabs Conversational AI product. It is bootstrapped to automatically deploy to Netlify using Netlify Functions as the server. This fascilitates the Server Side Authentication rather than handling the process entirely on the client. 

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SeanMcTernan/elevenlabs_astro_template&utm_source=github)

(If you click this button, it will create a new repo for you that looks exactly like this one, and sets that repo up immediately for deployment on Netlify)

⚠️ **Warning** ⚠️

This project will deploy a live site available all over the web. If you do not want your Model being hit directly from the public internet, we recommend locking your site on Netlify using [Site Protection](https://docs.netlify.com/security/secure-access-to-sites/site-protection/#basic-password-protection-versus-team-login-protection)

## Table of Contents:

- [Getting Started](#getting-started)
- [Installation options](#installation-options)
- [App Images](#app-images)
  
## Getting Started

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

First, run the development server,
if you have the [Netlify CLI](https://github.com/netlify/cli) installed, you can run:

```bash
netlify dev
```

Open [http://localhost:8888](http://localhost:8888) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.astro`. The page auto-updates as you edit the file.

### Installation options

**Option one:** One-click deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SeanMcTernan/elevenlabs_astro_template)

**Option two:** Manual clone

1. Clone this repo: `git clone https://github.com/SeanMcTernan/elevenlabs_astro_template.git`
2. Navigate to the directory and run `npm install`
3. Run `npm run dev` or `ntl dev`
4. Make your changes

### Environment Variables

Currently this Astro site supports ElevenLabs Conversational AI please enter them exactly as you see them below to avoid errors:

**ELEVENLABS_API_KEY:** 
```
YOUR API KEY
```

**AGENT_ID:** 
```
YOUR AGENT ID
```
⚠️ **Warning** ⚠️

This project will deploy a live site available all over the web. If you do not want your Model being hit directly from the public internet, we recommend locking your site on Netlify using [Site Protection](https://docs.netlify.com/security/secure-access-to-sites/site-protection/#basic-password-protection-versus-team-login-protection)

