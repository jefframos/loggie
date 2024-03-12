export default class ObjectCloner {
    static clone<T>(config: T, overrider: T | undefined = undefined) : T {
        if (overrider) {
            const clone = { ...config } as any;
            for (const key in overrider) {
                if (overrider[key] || overrider[key] == 0) {
                    clone[key] = overrider[key];
                }
            }

            return clone;
        }
        return { ...config }
    }
}