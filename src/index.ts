import { PluginMetadata } from "merlmovie-sdk";

interface PlayScriptParams {
    plugin: PluginMetadata,
    type: string,
    id: string,
    season?: string,
    episode?: string,
}

interface PlayEmbedScriptParams {
    media: Record<any, any>,
    season?: string,
    episode?: string,
    plugin?: PluginMetadata,
}

interface PlyinkArgs {
    __isPlaylink__?: boolean,
    __extensions__?: Array<{ name?: string, _docId?: string }>,
    __plugin__?: Record<any, any>,
}

const Play = (params: PlayScriptParams) => {
    const payload = {
        plugin: params.plugin,
        type: params.type,
        id: params.id,
        season: params.season,
        episode: params.episode,
    };
    const encoded = btoa(JSON.stringify(payload));
    window.open(`play://open.playlink.dev/?b64=${encoded}`);
}

enum ImageSize {
    original = "original", w500 = "w500", w400 = "w400", w300 = "w300", w200 = "w200"
}

const getImage = (imagePath: string, size?: ImageSize) => {
    return `https://images.tmdb.org/t/p/${(size ?? ImageSize.original).toString()}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

const PlayEmbed = (params: PlayEmbedScriptParams) => {
    const logoPath = params.media.images?.logos?.[0]?.file_path;
    let thumbnail = getImage(params.media.backdrop_path ?? "");
    if (params.season && params.episode) {
        const season = params.media.seasons?.find((e: any) => e.season_number === parseInt(params.season ?? "1"));
        const episode = season?.episodes?.find((e: any) => e.episode_number === parseInt(params.episode ?? "1"));
        if (episode) thumbnail = getImage(episode.still_path ?? "");
    }
    const embed = JSON.stringify({
        title: params.media.title ?? params.media.name,
        title_logo: logoPath ? getImage(logoPath ?? "") : null,
        thumbnail: thumbnail,
        tmdb_id: `${params.media.id}`,
        imdb_id: params.media.external_ids?.imdb_id,
        type: params.media.name ? "tv" : "movie",
        season: params.media.name ? (params.season ?? "1") : null,
        episode: params.media.name ? (params.episode ?? "1") : null,
        detail: params.media,
        plugin: params.plugin ?? {
            name: "VENUS.SH",
            _docId: "venus-sh-plyink"
        },
    });
    // @ts-expect-error
    PlayEmbedChannel.postMessage(embed);
}

const GetPlyinkArgs = async (): Promise<PlyinkArgs> => {
    let data: PlyinkArgs = {};
    let counter = 0;
    while (true) {
        if (typeof globalThis !== "undefined") {
            // @ts-expect-error
            if (globalThis["__isPlaylink__"]) {
                data["__isPlaylink__"] = true;
                // @ts-expect-error
                data["__extensions__"] = globalThis["__extensions__"];
                // @ts-expect-error
                data["__plugin__"] = globalThis["__plugin__"];
                break;
            }
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        if (counter >= 1000) break;
        counter = counter + 200;
    }
    return data;
}

const Fetch = async (url: string, headers?: Record<any, any>): Promise<{ status: number, body: any } | undefined> => {
    const rand = `${Math.random() * (99 - 10) + 10}`;
    const payload = {
        key: rand,
        url: url,
        headers: headers || null,
    };
    window.open(`fetch://open.playlink.dev/?b64=${btoa(JSON.stringify(payload))}`);
    return new Promise(async (resolve) => {
        while (true) {
            // @ts-expect-error
            if (globalThis[rand]) {
                // @ts-expect-error
                resolve(globalThis[rand]);
                break;
            }
            await new Promise((res) => setTimeout(res, 500));
        }
    });
}

const ShowAd = () => {
    window.open("show-ad://open.playlink.dev");
}

// @ts-expect-error
const __Plugin__: PluginMetadata | undefined = globalThis["__plugin__"];

export { Play, PlayEmbed, GetPlyinkArgs, Fetch, ShowAd, __Plugin__ }