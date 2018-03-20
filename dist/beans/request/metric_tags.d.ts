export declare class MetricTags {
    tags: {
        [key: string]: string[];
    };
    size: number;
    initialized: boolean;
    combinations: number;
    multiValuedTags: string[];
    updateTags(tags: any): void;
    private updateInfo();
}
