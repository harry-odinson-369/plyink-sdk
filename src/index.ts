import { PluginMetadata } from "merlmovie-sdk";
import FlutterJsBridge from "./bridge";
import FlutterJsBridgeEventEmitter from "./event";
import { MessageModel, PlayEmbedScriptParams, PlayScriptParams, QuickAccess, ThemeData } from "./types";

const getImage = (imagePath: string, size?: ImageSize) => {
    return `https://images.tmdb.org/t/p/${(size ?? ImageSize.original).toString()}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

enum ImageSize {
    original = "original", w500 = "w500", w400 = "w400", w300 = "w300", w200 = "w200"
}

export default class PlyinkSDK {
    private constructor() { }
    private static _instance: PlyinkSDK = new PlyinkSDK();
    static get instance(): PlyinkSDK { return this._instance }

    get emitter(): FlutterJsBridgeEventEmitter | undefined {
        // @ts-ignore
        if (!globalThis.__flutterJsBridgeEventEmitter) {
            // @ts-ignore
            globalThis.__flutterJsBridgeEventEmitter = new FlutterJsBridgeEventEmitter();
        }
        // @ts-ignore
        return globalThis.__flutterJsBridgeEventEmitter;
    }

    static play = (params: PlayScriptParams) => {
        const payload: MessageModel = { action: "play", data: params };
        const message = JSON.stringify(payload);
        return FlutterJsBridge.instance.send(message);
    }

    static playEmbed = (params: PlayEmbedScriptParams) => {
        const payload: MessageModel = { action: "playEmbed", data: params };
        const message = JSON.stringify(payload);
        return FlutterJsBridge.instance.send(message);
    }

    static request = async (url: string, params?: { method?: "GET" | "POST", headers?: Record<any, any>, data?: any, timeoutMs?: number }): Promise<{ status: number, data: any } | undefined> => {
        const payload: MessageModel = {
            action: "request",
            data: {
                url: url,
                headers: params?.headers || null,
                method: params?.method || "GET",
                data: params?.data || null,
                timeoutMs: params?.timeoutMs || 60000,
            }
        };
        const message = JSON.stringify(payload);
        let result = await FlutterJsBridge.instance.send(message, { timeoutMs: params?.timeoutMs });
        if (!result) return undefined;
        if (typeof result === "string") result = JSON.parse(result);
        return result;
    }

    static getTheme = async (): Promise<ThemeData | undefined> => {
        const payload: MessageModel = {
            action: "getTheme",
            data: {},
        };
        const message = JSON.stringify(payload);
        let result = await FlutterJsBridge.instance.send(message, { timeoutMs: 2000 });
        if (!result) return undefined;
        if (typeof result === "string") result = JSON.parse(result);
        return result;
    }

    static showAd = () => {
        const payload: MessageModel = {
            action: "showAd",
            data: {},
        };
        const message = JSON.stringify(payload);
        return FlutterJsBridge.instance.send(message);
    }

    static installExtension = async (data: string | PluginMetadata) => {
        const payload: MessageModel = {
            action: "installExtension",
            data: data,
        };
        const message = JSON.stringify(payload);
        const result = await FlutterJsBridge.instance.send(message);
        return result === "1";
    }

    static addQuickAccess = (data: QuickAccess) => {
        const payload: MessageModel = {
            action: "addQuickAccess",
            data: data,
        };
        const message = JSON.stringify(payload);
        return FlutterJsBridge.instance.send(message);
    }

    static getQuickAccess = async (): Promise<QuickAccess[] | undefined> => {
        const payload: MessageModel = { action: "getQuickAccess", data: {} }
        const message = JSON.stringify(payload);
        let result = await FlutterJsBridge.instance.send(message);
        if (!result) return undefined;
        if (typeof result === "string") result = JSON.parse(result);
        return result;
    }

    static addSCF = (websites: string[]) => {
        const payload: MessageModel = {
            action: "addSCF",
            data: websites,
        };
        const message = JSON.stringify(payload);
        return FlutterJsBridge.instance.send(message);
    }

    static getSCF = async (): Promise<string[] | undefined> => {
        const payload: MessageModel = { action: "getSCF", data: {} };
        const message = JSON.stringify(payload);
        let result = await FlutterJsBridge.instance.send(message);
        if (!result) return undefined;
        if (typeof result === "string") result = JSON.parse(result);
        return result;
    }

    // @ts-expect-error
    static setPopFunc = (popFunc: () => boolean) => { globalThis['__popFunc'] = popFunc; }

    static getExtension = async (id: string): Promise<PluginMetadata | undefined> => {
        const payload: MessageModel = {
            action: "getExtension",
            data: id,
        };
        const message = JSON.stringify(payload);
        let result = await FlutterJsBridge.instance.send(message, { timeoutMs: 2000 });
        if (!result) return undefined;
        if (typeof result === "string") result = JSON.parse(result);
        return result;
    }

    static isPlaylink = async () => {
        const payload: MessageModel = { action: "isPlaylink", data: {} };
        const message = JSON.stringify(payload);
        const result = await FlutterJsBridge.instance.send(message, { timeoutMs: 2000 });
        return result === "1";
    }

}

export { FlutterJsBridge }