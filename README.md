# `markdown-to-html-worker`

A simple [Cloudflare Worker](https://workers.cloudflare.com/) to convert markdown to html.

- Sanitizes incoming HTML
- Supports code highlighting using [`rehype-pretty-code`](https://github.com/rehype-pretty/rehype-pretty-code)
- Supports Github markdown flavor
- Uses rehype-remark ecosystem to easily extend configuration

## Environment variables

`ALLOWED_HOSTNAMES` - Hostnames to allow cross-origin requests from. Leaving empty will disable CORS.
