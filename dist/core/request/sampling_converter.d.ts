export declare class SamplingConverter {
    private static MILLISECONDS_STRING;
    convert(value: any, unit: any): {
        interval: string;
        unit: string;
    };
    isApplicable(value: any): boolean;
    private isFloat(value);
    private convertToMiliseconds(value, shortUnit);
}
