export default class FlutterJsBridge {
    private constructor() { }
    private static _instance = new FlutterJsBridge();
    static get instance() { return this._instance; }

    private static seq = 0;

    async send(message: string, params?: { timeoutMs?: number }): Promise<any> {
        const ready = await this.isReady();
        if (!ready) return undefined;
        return new Promise(resolve => {
            const funcName = this._getCallbackName();

            // @ts-ignore
            if (!globalThis.__flutterCallbacks__) {
                // @ts-ignore
                globalThis.__flutterCallbacks__ = Object.create(null);
            }

            let done = false;

            // @ts-ignore
            globalThis.__flutterCallbacks__[funcName] = (result: any) => {
                if (done) return;
                done = true;
                resolve(result);
                // @ts-ignore
                delete globalThis.__flutterCallbacks__[funcName];
            };

            this.post(JSON.stringify({ func: funcName, message }));

            setTimeout(() => {
                if (done) return;
                done = true;
                resolve(undefined);
                // @ts-ignore
                delete globalThis.__flutterCallbacks__[funcName];
            }, params?.timeoutMs ?? 60000);
        });
    }

    async isReady(): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            await new Promise(res => setTimeout(res, 200));
            // @ts-ignore
            if (typeof globalThis.FlutterJsBridgeChannel !== "undefined") {
                resolve(true);
            } else {
                setTimeout(() => {
                    // @ts-ignore
                    if (typeof globalThis.FlutterJsBridgeChannel !== "undefined") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }, 1800);
            }
        });
    }

    private post(message: string) {
        // @ts-ignore
        globalThis.FlutterJsBridgeChannel.postMessage(message);
    }

    private _getCallbackName() {
        return `cb_${Date.now()}_${FlutterJsBridge.seq++}`;
    }
}
