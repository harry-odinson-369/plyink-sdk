export default class FlutterJsBridgeEventEmitter {
    private events = new Map<string, Set<(data: any) => void>>();

    on(type: string, cb: (data: any) => void) {
        if (!this.events.has(type)) {
            this.events.set(type, new Set());
        }
        this.events.get(type)!.add(cb);
    }

    emit(type: string, data: any) {
        this.events.get(type)?.forEach(cb => cb(data));
    }

    off(type: string, cb: (data: any) => void) {
        this.events.get(type)?.delete(cb);
    }
}
