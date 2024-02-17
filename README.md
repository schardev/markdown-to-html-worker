# `markdown-to-html-worker`

A simple [Cloudflare Worker](https://workers.cloudflare.com/) to convert markdown to html.

- Sanitizes incoming HTML
- Supports code highlighting using [`rehype-pretty-code`](https://github.com/rehype-pretty/rehype-pretty-code)
- Supports Github markdown flavor
- Uses rehype-remark ecosystem to easily extend configuration

## Getting Started

Clone this repository and install required packages:

```bash
# clone repo
git clone https://github.com/schardev/markdown-to-html-worker

# install packages
cd markdown-to-html-worker && pnpm install
```

Running `pnpm dev` will start the dev server on `http://localhost:8787`.

## Sending markdown text

To send the markdown text do a `POST` request to the running server (make sure you set `Content-Type` to `text/plain`).

```js
const markdownText = `# this is markdown heading\nthis is a paragraph`;

// ...
const res = await fetch("http://localhost:8787", {
  method: "POST",
  body: markdownText,
});

console.log(await res.text());
// will log:
//
// <h1>this is markdown heading</h1>
// <p>this is a paragraph</p>
```

## Environment variables

`ALLOWED_HOSTNAMES` - Hostnames to allow cross-origin requests from. Leaving empty will disable CORS.
