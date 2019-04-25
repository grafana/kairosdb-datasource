import _ from "lodash";

export class GroupByTagsCtrl {
    public tags: string[];
    public selectedTags: { [key: string]: boolean } = {};
    public inputVisible: boolean;
    public allowedValues: string[];

    constructor() {
        this.tags.forEach((tag) => this.selectedTags[tag] = true);
    }

    public onChange(): void {
        this.tags = _.keys(_.pickBy(this.selectedTags));
    }

    public addCustom(tag: string): void {
        if (!_.isEmpty(tag)) {
            this.selectedTags[tag] = true;
        }
        this.inputVisible = !this.inputVisible;
    }
}

export function GroupByTagsDirective() {
    return {
        bindToController: true,
        controller: GroupByTagsCtrl,
        controllerAs: "ctrl",
        restrict: "E",
        scope: {
            allowedValues: "=",
            tags: "="
        },
        templateUrl: "public/plugins/grafana-kairosdb-datasource/partials/group.by.tags.html"
    };
}
