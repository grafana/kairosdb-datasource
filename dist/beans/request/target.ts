import {Aggregator} from "../aggregators/aggregator";
import * as Aggregators from "../aggregators/aggregators";
import {AggregatorParameter} from "../aggregators/parameters/aggregator_parameter";
import {GroupBy} from "./group_by";

export class KairosDBTarget {
    public static fromObject(object: any): KairosDBTarget {
      const rval = new KairosDBTarget();
      rval.metricName = object.metricName;
      rval.alias = object.alias;
      rval.tags = object.tags || {};
      rval.groupBy = GroupBy.fromObject(object.groupBy);
      rval.aggregators = (object.aggregators || []).map(
          (val) => Aggregators.fromObject(val));
      return rval;
    }

    public metricName: string = undefined;
    public alias: string = undefined;
    public tags: {[key: string]: string[]} = {};
    public groupBy: GroupBy = new GroupBy();
    public aggregators: Aggregator[] = [];

    public asString(): string {
      let str = "SELECT ";

      if (this.aggregators.length > 0) {
        this.aggregators.slice().reverse().forEach((agg: Aggregator) => {
          str += agg.name + "(";
        });

        this.aggregators.forEach((agg: Aggregator, aggIndex: number) => {
          if (aggIndex === 0) {
            str += "*";
          }

          agg.parameters.filter((param) => {
            return param.type === "any" || param.type === "enum";
          })
            .forEach((param: AggregatorParameter, index: number) => {
              if ( aggIndex === 0 || index !== 0 ) {
               str += ", ";
              }
              str += param.value;
            });

          str += ")";
        });
      } else {
        str += "*";
      }

      if (this.alias) {
        str += " as " + this.alias;
      }

      str += " FROM " + this.metricName;

      if (Object.keys(this.tags).length > 0) {
        const filteredKeys = Object.keys(this.tags).filter((key) => {
          return !(this.tags[key] === undefined || this.tags[key].length === 0);
        });
        if (filteredKeys.length > 0) {
          str += " WHERE ";
          filteredKeys.forEach((key: string, index: number) => {
            if (index !== 0) {
              str += ", ";
            }
            const value = this.tags[key];

            if (value.length > 1) {
              str += key + "=[" + value.join(",") + "]";
            } else {
              str += key + "=" + value[0];
            }
          });
        }
      }

      str += this.groupBy.asString();

      return str;
    }
}
