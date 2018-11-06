import {GroupByTimeEntry} from "../../directives/group_by/group_by_time_entry";

export class GroupBy {
    public static fromObject(object: any) {
      const rval = new GroupBy();
      if (object) {
          rval.tags = object.tags || [];
          rval.value = object.value || [];
          rval.time = (object.time || []).map((val) => {
              return new GroupByTimeEntry(val.interval, val.unit, val.count);
          });
      }
      return rval;
    }

    public tags: string[] = [];
    public value: string[] = [];
    public time: GroupByTimeEntry[] = [];

    public asString(): string {
      let str = "";
      let needsSeparator = false;
      if (this.tags.length > 0 || this.value.length > 0 || this.time.length > 0) {
        str += " GROUP BY ";
      }

      if ( this.tags.length > 0 ) {
        needsSeparator = true;
        str += this.tags.join(", ");
      }

      if (this.value.length > 0) {
        if (needsSeparator) {
          str += ", ";
        }
        needsSeparator = true;
        str += "value(" + this.value.join(",") + ")";
      }

      if (this.time.length > 0) {
        if (needsSeparator) {
          str += ", ";
        }
        str += this.time.map((entry: GroupByTimeEntry) => entry.asString()).join(", ");
      }

      return str;
    }
}
