import { PluginMetadata } from "merlmovie-sdk";

export interface MessageModel {
    action: string,
    data: any,
}

export interface PlayScriptParams {
    plugin: PluginMetadata,
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
    media: Record<any, any>,
    season?: string,
    episode?: string,
    plugin: PluginMetadata,
}

export interface ThemeData {
    brightness: string,
    bgColor: string,
    panelBgColor: string,
    textColor: string,
}