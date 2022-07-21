import { validate, validateId } from "../src/controller";

describe("validate test", () => {
  it("correct messageType", async() => {
      // testing correct messageType ("info" , "warning" , "error")
      let messageType:any = "info";
      expect(validate({id: 0, type: messageType, text: "validation test", read: false})).toEqual(true);
      messageType = "warning";
      expect(validate({id: 0, type: messageType, text: "validation test", read: false})).toEqual(true);
      messageType = "error";
      expect(validate({id: 0, type: messageType, text: "validation test", read: false})).toEqual(true);
  });

  it("incorrect messageType", async() => {
      // testing incorrect messageType
      let messageType:any = "Xinfo";
      expect(validate({id: 0, type: messageType, text: "validation test", read: false})).toEqual(false);
      messageType = "Xwarning";
      expect(validate({id: 0, type: messageType, text: "validation test", read: false})).toEqual(false);
      messageType = "Xerror";
      expect(validate({id: 0, type: messageType, text: "validation test", read: false})).toEqual(false);
  });

  it("empty text", async() => {
    // testing empty text
    expect(validate({id: 0, type: "info", text: "", read: false})).toEqual(false);
  });
});

describe("validateId test", () => {
    it("correct id", async() => {
        // testing correct id
        expect(validateId({id: 0, type: "info", text: "validation test", read: false})).toEqual(true);
    });

    it("incorrect id", async() => {
      // testing incorrect id
      expect(validateId({id: -1, type: "info", text: "validation test", read: false})).toEqual(false);
  });
});
