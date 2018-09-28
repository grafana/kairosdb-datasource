import kbn from "app/core/utils/kbn";
import {TimeUnit} from "../../beans/aggregators/utils";
import {TimeUnitUtils} from "../../utils/time_unit_utils";

export class SamplingConverter {
    private static MILLISECONDS_STRING = TimeUnitUtils.getString(TimeUnit.MILLISECONDS);

    public convert(value, unit) {
        if (unit === SamplingConverter.MILLISECONDS_STRING) {
            throw new Error("Value must be integer when using milliseconds");
        }
        const shortUnit = TimeUnitUtils.getShortUnit(unit);
        return {
            interval: this.convertToMiliseconds(parseFloat(value), shortUnit).toString(),
            unit: TimeUnitUtils.getString(TimeUnit.MILLISECONDS)
        };
    }

    public isApplicable(value): boolean {
        return this.isFloat(value);
    }

    private isFloat(value): boolean {
        return value % 1 !== 0;
    }

    private convertToMiliseconds(value: number, shortUnit: string): number {
        return Math.round(kbn.intervals_in_seconds[shortUnit] * value * 1000);
    }
}
