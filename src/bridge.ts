export default class FlutterJsBridge {
    private constructor() { }
    private static _instance: FlutterJsBridge = new FlutterJsBridge();
    static get instance() { return this._instance; }

    private readyPromise?: Promise<void>;

    async send(message: string, params?: { timeoutMs?: number }): Promise<any> {
        await this.isReady();
        return new Promise<any>((resolve, reject) => {
            const key = this._getRandomKey;
            // @ts-ignore
            globalThis["__pending__"].set(key, { resolve, reject });
            const payload = JSON.stringify({ key: key, message });
            this.post(payload);
            setTimeout(() => {
                // @ts-ignore
                const entry = globalThis["__pending__"].get(key);
                if (!entry) return;
                entry.resolve(undefined);
                // @ts-ignore
                globalThis["__pending__"].delete(key);
            }, params?.timeoutMs || 60000);
        });
    }

    async isReady(): Promise<boolean> {
        if (this.readyPromise) return this.readyPromise.then(() => true);
        this.readyPromise = new Promise((resolve) => {
            const check = async () => {
                // @ts-ignore
                if (typeof FlutterJsBridgeChannel !== "undefined") {
                    // @ts-ignore
                    if (typeof globalThis["__pending__"] === "undefined") {
                        // @ts-ignore
                        globalThis["__pending__"] = new Map<string, { resolve: Function, reject: Function }>();
                    }
                    // @ts-ignore
                    if (typeof globalThis["__resolveResult"] === "undefined") {
                        // @ts-ignore
                        globalThis["__resolveResult"] = (key: string, message: any) => {
                            // @ts-ignore
                            const entry = globalThis["__pending__"].get(key);
                            if (!entry) return;
                            entry.resolve(message);
                            // @ts-ignore
                            globalThis["__pending__"].delete(key);
                        }
                    }
                    resolve();
                    return;
                }
                setTimeout(check, 100);
            };
            check();
        });
        return this.readyPromise.then(() => true);
    }

    private post(message: string) {
        // @ts-ignore
        FlutterJsBridgeChannel.postMessage(message);
    }

    private get _getRandomKey() {
        return this.__random(999, 99999).toString();
    }

    private __random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
