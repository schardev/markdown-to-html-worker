import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
  loadWasm,
  getHighlighterCore,
  bundledLanguages,
} from "shikiji/bundle-web.mjs";
import githubDarkDimmed from "shikiji/themes/github-dark-dimmed.mjs";
import wasm from "shikiji/onig.wasm";
import remarkGemoji from "remark-gemoji";
import { cors } from "cors-headers";

await loadWasm((obj) => WebAssembly.instantiate(wasm, obj));

const THEME = githubDarkDimmed;
const coreHighlighter = await getHighlighterCore({
  themes: [THEME],
  langs: Object.values(bundledLanguages),
});

const generateHTMLFromMarkdown = async (text: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGemoji)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      keepBackground: false,
      getHighlighter: () => Promise.resolve(coreHighlighter),
    })
    .use(rehypeStringify)
    .process(text);

  return file.toString();
};

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const ALLOWED_HOSTNAMES = env.ALLOWED_HOSTNAMES?.split(",");
    const { headers } = cors(req, {
      origin: (o) => {
        if (o && ALLOWED_HOSTNAMES) {
          try {
            const originUrl = new URL(o);
            if (ALLOWED_HOSTNAMES.includes(originUrl.hostname)) {
              return true;
            }
          } catch (error) {
            console.log(error);
          }
        }

        return false;
      },
    });

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    } else if (req.method !== "POST") {
      return Response.json(
        { error: "Method not allowed!" },
        { status: 405, headers },
      );
    }

    // validate content-type
    const contentType = req.headers.get("content-type")?.split(";")[0];
    if (!contentType || !contentType.includes("text/plain")) {
      return Response.json(
        { error: "Content-Type not allowed" },
        { status: 400, headers },
      );
    }

    try {
      const markdownText = await req.text();
      const html = await generateHTMLFromMarkdown(markdownText);
      headers.set("content-type", "text/html;charset=UTF-8");
      return new Response(html, { headers });
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Server error" }, { status: 500, headers });
    }
  },
};
