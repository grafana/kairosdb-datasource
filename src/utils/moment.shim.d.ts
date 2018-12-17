
import * as moment from "moment";

declare module "moment" {
    export type Moment = any;
}

export = moment;
