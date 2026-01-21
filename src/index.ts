import { PluginMetadata } from "merlmovie-sdk";
import FlutterJsBridge from "./bridge";
import { MessageModel, PlayEmbedScriptParams, PlayScriptParams, QuickAccess, ThemeData } from "./types";

export * from "./types";
export * from "./bridge";

const getImage = (imagePath: string, size?: ImageSize) => {
    return `https://images.tmdb.org/t/p/${(size ?? ImageSize.original).toString()}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

enum ImageSize {
    original = "original", w500 = "w500", w400 = "w400", w300 = "w300", w200 = "w200"
}

const Play = (params: PlayScriptParams) => {
    const payload: MessageModel = { action: "play", data: params };
    const message = JSON.stringify(payload);
    return FlutterJsBridge.instance.send(message);
}

const PlayEmbed = (params: PlayEmbedScriptParams) => {
    const logoPath = params.media.images?.logos?.[0]?.file_path;
    let thumbnail = getImage(params.media.backdrop_path ?? "");
    if (params.season && params.episode) {
        const season = params.media.seasons?.find((e: any) => e.season_number === parseInt(params.season ?? "1"));
        const episode = season?.episodes?.find((e: any) => e.episode_number === parseInt(params.episode ?? "1"));
        if (episode) thumbnail = getImage(episode.still_path ?? "");
    }
    const payload: MessageModel = {
        action: "playEmbed",
        data: {
            title: params.media.title ?? params.media.name,
            title_logo: logoPath ? getImage(logoPath ?? "") : null,
            thumbnail: thumbnail,
            tmdb_id: `${params.media.id}`,
            imdb_id: params.media.external_ids?.imdb_id,
            type: params.media.name ? "tv" : "movie",
            season: params.media.name ? (params.season ?? "1") : null,
            episode: params.media.name ? (params.episode ?? "1") : null,
            detail: params.media,
            plugin: params.plugin,
        }
    };
    const message = JSON.stringify(payload);
    return FlutterJsBridge.instance.send(message);
}

const Fetch = async (url: string, params?: { method?: string, headers?: Record<any, any>, body?: any, timeoutMs?: number }): Promise<{ status: number, body: any } | undefined> => {
    const payload: MessageModel = {
        action: "fetch",
        data: {
            url: url,
            headers: params?.headers || null,
            method: params?.method || "GET",
            body: params?.body || null,
        }
    };
    const message = JSON.stringify(payload);
    const result = await FlutterJsBridge.instance.send(message, { timeoutMs: params?.timeoutMs });
    if (!result) return { status: 500, body: "" };
    let data = JSON.parse(result);
    if (typeof data === "string") data = JSON.parse(data);
    return data;
}

const GetTheme = async (): Promise<ThemeData | undefined> => {
    const payload: MessageModel = {
        action: "getTheme",
        data: {},
    };
    const message = JSON.stringify(payload);
    const result = await FlutterJsBridge.instance.send(message);
    let data = JSON.parse(result);
    if (typeof data === "string") data = JSON.parse(data);
    return data;
}

const ShowAd = () => {
    const payload: MessageModel = {
        action: "showAd",
        data: {},
    };
    const message = JSON.stringify(payload);
    return FlutterJsBridge.instance.send(message);
}

const InstallExtension = (data: string | PluginMetadata) => {
    const payload: MessageModel = {
        action: "installExtension",
        data: data,
    };
    const message = JSON.stringify(payload);
    return FlutterJsBridge.instance.send(message);
}

const AddQuickAccess = (data: QuickAccess) => {
    const payload: MessageModel = {
        action: "addQuickAccess",
        data: data,
    };
    const message = JSON.stringify(payload);
    return FlutterJsBridge.instance.send(message);
}

const AddSCF = (websites: string[]) => {
    const payload: MessageModel = {
        action: "addSCF",
        data: websites,
    };
    const message = JSON.stringify(payload);
    return FlutterJsBridge.instance.send(message);
}

// @ts-expect-error
const SetPopFunc = (popFunc: () => boolean) => { globalThis['__popFunc'] = popFunc; }

const CheckExtension = async (id: string): Promise<PluginMetadata | undefined> => {
    const payload: MessageModel = {
        action: "checkExtension",
        data: id,
    };
    const message = JSON.stringify(payload);
    const result = await FlutterJsBridge.instance.send(message);
    let data = JSON.parse(result);
    if (typeof data === "string") data = JSON.parse(data);
    return data;
}

const isPlaylink = async () => {
    const payload: MessageModel = { action: "isPlaylink", data: {} };
    const message = JSON.stringify(payload);
    const result = await FlutterJsBridge.instance.send(message);
    return result === "1";
}

const GetSCF = async (): Promise<string[]> => {
    const payload: MessageModel = { action: "getSCF", data: {} };
    const message = JSON.stringify(payload);
    const result = await FlutterJsBridge.instance.send(message);
    let data = JSON.parse(result);
    if (typeof data === "string") data = JSON.parse(data);
    return data; 
}

export { Play, PlayEmbed, Fetch, ShowAd, InstallExtension, AddQuickAccess, SetPopFunc, GetTheme, AddSCF, CheckExtension, GetSCF, isPlaylink }