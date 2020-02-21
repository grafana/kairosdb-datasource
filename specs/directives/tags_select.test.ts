import {SegmentLike, TagsSelectCtrl} from "../../src/directives/tags_select";

const valAsSegment = (val: string): SegmentLike => {
    return {
        value: val,
        type: "plus-button",
    };
};

const newPlusButtonSegment = (): SegmentLike => {
    return {
        value: undefined, // or nil?
        type: "plus-button",
    };
};

const buildUiSegmentSrvMock = () => {
    return {
        newSegment: valAsSegment,
        newPlusButton: newPlusButtonSegment,
    };
};

const val1 = "val1";
const val2 = "val2";

describe("TagsSelectCtrl", () => {
    const uiSegmentSrv = buildUiSegmentSrvMock();

    // Nasty hack to avoid dealing with nginject stuff
    beforeEach( () => {
        TagsSelectCtrl.prototype.selectedValues = [
            val1,
            null, // just some scary values we expect to be cleaned up
            undefined
        ];
    });

    it("render, even when the selected values contain nil values", () => {
        const tagsSelectCtrl: TagsSelectCtrl = new TagsSelectCtrl(uiSegmentSrv);
        tagsSelectCtrl.selectedValues.should.deep.equal([val1]);
        tagsSelectCtrl.segments.should.deep.equal([
            valAsSegment(val1), // the set value
            newPlusButtonSegment(), // the plus-button after it
        ]);
    });

    it("Remove works", () => {
        const tagsSelectCtrl: TagsSelectCtrl = new TagsSelectCtrl(uiSegmentSrv);
        tagsSelectCtrl.segments.should.deep.equal([
            valAsSegment(val1),
            newPlusButtonSegment(), // the plus-button after it
        ]);

        // remove the first one and see what happens
        tagsSelectCtrl.remove(tagsSelectCtrl.segments[0]);
        tagsSelectCtrl.selectedValues.should.deep.equal([]);
        tagsSelectCtrl.segments.should.deep.equal([
            newPlusButtonSegment(),
        ]);
    });

    it("Update changes selected values", () => {
        const tagsSelectCtrl: TagsSelectCtrl = new TagsSelectCtrl(uiSegmentSrv);
        tagsSelectCtrl.segments.should.deep.equal([
            valAsSegment(val1),
            newPlusButtonSegment(), // the plus-button after it
        ]);

        // Simulate the value being changed in the view
        tagsSelectCtrl.segments[0].value = val2;

        tagsSelectCtrl.onChange();
        tagsSelectCtrl.selectedValues.should.deep.equal([val2]);
        tagsSelectCtrl.segments.should.deep.equal([
            valAsSegment(val2),
            newPlusButtonSegment(),
        ]);
    });

});
