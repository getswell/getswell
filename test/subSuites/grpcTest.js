const chai = require("chai");
const chaiHttp = require("chai-http");
const fs = require("fs");
const path = require("path");
const sideBar = require("../pageObjects/Sidebar.js");
const reqRes = require("../pageObjects/ReqRes.js");
chai.use(chaiHttp);
const expect = chai.expect;
module.exports = () => {
  describe("gRPC requests", () => {
    beforeEach(async () => {
      await reqRes.removeBtn.click();
    });
    let body = "";
    before((done) => {
      fs.readFile(path.join(__dirname, "../hw2.proto"), "utf8", (err, data) => {
        if (err) console.log(err);
        body = data;
        done();
      });
    });
    const sideBarSetup = async () => {
      await sideBar.gRPC.click();
      await sideBar.url.addValue("0.0.0.0:50051");
      await sideBar.grpcBody.addValue(body);
      await sideBar.saveChanges.click();
    };
    const requestSetup = async (index) => {
      await sideBar.selectRequest.selectByIndex(index);
      await sideBar.addRequestBtn.click();
      await reqRes.sendBtn.click();
      const res = await reqRes.jsonPretty.getText();
      return res;
    };
    it("it should work on a unary request", async () => {
      await sideBarSetup();
      await sideBar.selectService.selectByIndex(1);
      const jsonPretty = await requestSetup(1);
      await new Promise((resolve) =>
        setTimeout(async () => {
          expect(jsonPretty).to.include(`"message": "Hello string"`);
          resolve();
        }, 800)
      );
    });
    it("it should work on a nested unary request", async () => {
      const jsonPretty = await requestSetup(2);
      await new Promise((resolve) =>
        setTimeout(async () => {
          expect(jsonPretty).to.include(
            `{\n    "serverMessage": [\n        {\n            "message": "Hello! string"\n        },\n        {\n            "message": "Hello! string"\n        }\n    ]\n}`
          );
          resolve();
        }, 800)
      );
    });
    it("it should work on a server stream", async () => {
      const jsonPretty = await requestSetup(3);
      await new Promise((resolve) =>
        setTimeout(async () => {
          expect(jsonPretty).to.include(
            `{\n    "response": [\n        {\n            "message": "You"\n        },\n        {\n            "message": "Are"\n        },\n        {\n            "message": "doing IT"\n        },\n        {\n            "": \n        },\n        {\n            "message": "hello!!! string"\n        }\n    ]\n}`
          );
          resolve();
        }, 800)
      );
    });
    it("it should work on a client stream", async () => {
      const jsonPretty = await requestSetup(4);
      await new Promise((resolve) =>
        setTimeout(async () => {
          expect(jsonPretty).to.include(
            `{\n    "message": "received 1 messages"\n}`
          );
          resolve();
        }, 800)
      );
    });
    it("it should work on a bidirectional stream", async () => {
      const jsonPretty = await requestSetup(5);
      await new Promise((resolve) =>
        setTimeout(async () => {
          expect(jsonPretty).to.include(
            `{\n    "message": "bidi stream: string"\n}`
          );
          resolve();
        }, 800)
      );
    });
  });
};