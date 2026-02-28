import { PluginMetadata } from "merlmovie-sdk";

export interface MessageModel {
    action: string,
    data: any,
}

export interface PlayScriptParams {
    plugins: PluginMetadata[],
    type: string,
    id: string,
    season?: string,
    episode?: string,
}

export interface QuickAccess {
    url: string,
    image: string,
    name: string,
    "bg-color"?: string,
}

export interface PlayEmbedScriptParams {
    plugins: PluginMetadata[],
    media: Record<any, any>,
    season?: string,
    episode?: string,
}

export interface ThemeData {
    brightness: string,
    bgColor: string,
    panelBgColor: string,
    textColor: string,
}

export interface AppInfo {
    appName: string,
    packageName: string,
    buildNumber: string,
    version: string,
    buildSignature?: string,
    installerStore?: string,
    installTime?: string,
    updateTime?: string,
}