import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const HGN_API_URL = (process.env.HGN_API_URL ?? "").replace(/\/$/, "");
const HGN_API_TOKEN = process.env.HGN_API_TOKEN ?? "";

if (!HGN_API_URL) {
    process.stderr.write("ERROR: HGN_API_URL is not set\n");
    process.exit(1);
}
if (!HGN_API_TOKEN) {
    process.stderr.write("ERROR: HGN_API_TOKEN is not set\n");
    process.exit(1);
}

const ENTITY_TYPE = z.enum(["series", "franchise", "media_mix_group"]);

async function hgnFetch(path: string): Promise<unknown> {
    const url = `${HGN_API_URL}/api/v1/mcp${path}`;
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${HGN_API_TOKEN}`,
            Accept: "application/json",
        },
    });

    const body = await res.text();

    if (!res.ok) {
        throw new Error(`HGN API ${res.status}: ${body}`);
    }

    return JSON.parse(body);
}

async function hgnPost(path: string, payload: Record<string, string>): Promise<unknown> {
    const url = `${HGN_API_URL}/api/v1/mcp${path}`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HGN_API_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const body = await res.text();

    if (!res.ok) {
        throw new Error(`HGN API ${res.status}: ${body}`);
    }

    return JSON.parse(body);
}

const server = new McpServer({ name: "hgn-mcp", version: "1.0.0" });

server.tool(
    "get_schema",
    [
        "エンティティのフィールド定義（スキーマ）を返します。",
        "JSONを書き換える前に呼び出して、どのフィールドが編集可能か・型・制約を確認してください。",
        "type には series / franchise / media_mix_group のいずれかを指定します。",
    ].join(" "),
    {
        type: ENTITY_TYPE.describe("エンティティ種別"),
    },
    async ({ type }) => {
        const data = await hgnFetch(`/schema/${type}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    }
);

server.tool(
    "list_entities",
    [
        "エンティティの一覧を取得します。",
        "IDを調べるときや、作業対象を絞り込むときに使ってください。",
        "q パラメータでキーワード検索できます（名前・よみがな）。",
        "type には series / franchise / media_mix_group のいずれかを指定します。",
    ].join(" "),
    {
        type: ENTITY_TYPE.describe("エンティティ種別"),
        q: z.string().optional().describe("検索キーワード（省略可）"),
        per_page: z
            .number()
            .int()
            .min(1)
            .max(100)
            .optional()
            .describe("1ページの件数（省略時: 20、最大100）"),
    },
    async ({ type, q, per_page }) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (per_page != null) params.set("per_page", String(per_page));
        const qs = params.size > 0 ? `?${params.toString()}` : "";
        const data = await hgnFetch(`/entities/${type}${qs}`);
        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    }
);

server.tool(
    "export_json",
    [
        "エンティティのJSONをエクスポートします。",
        "このJSONを編集して、HGN管理画面の「JSON入力」画面から取り込みます。",
        "JSON入力後は管理画面で差分を確認し、適用する変更を選択してください。",
        "type には series / franchise / media_mix_group のいずれかを指定します。",
    ].join(" "),
    {
        type: ENTITY_TYPE.describe("エンティティ種別"),
        id: z.number().int().positive().describe("エンティティのID"),
    },
    async ({ type, id }) => {
        const resp = (await hgnFetch(`/export/${type}/${id}`)) as { data: unknown };
        return {
            content: [{ type: "text", text: JSON.stringify(resp.data, null, 2) }],
        };
    }
);

server.tool(
    "diff_json",
    [
        "AIが書き換えたJSONを投稿すると、現在のDBの値との差分だけを返します。",
        "変更点をチャット上で確認するために使ってください。実際の保存は管理画面の「JSON入力」→「差分確認」→「保存」から行います。",
        "type には series / franchise / media_mix_group のいずれかを指定します。",
    ].join(" "),
    {
        type: ENTITY_TYPE.describe("エンティティ種別"),
        id: z.number().int().positive().describe("エンティティのID"),
        json: z.string().describe("export_json で取得したJSONをAIが書き換えたもの（JSON文字列）"),
    },
    async ({ type, id, json }) => {
        const resp = (await hgnPost(`/diff/${type}/${id}`, { imported_json: json })) as {
            data: {
                warnings: string[];
                has_changes: boolean;
                [key: string]: unknown;
            };
        };

        const data = resp.data;

        if (!data.has_changes) {
            return {
                content: [{ type: "text", text: "変更点はありません。" }],
            };
        }

        return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
    }
);

const transport = new StdioServerTransport();
await server.connect(transport);
