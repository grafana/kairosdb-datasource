export class PromiseUtils {
    private $q: any;
    constructor($q) {
        this.$q = $q;
    }

    public resolvedPromise(value?: any) {
        const defer = this.$q.defer();
        defer.resolve(value);
        return defer.promise;
    }
}
