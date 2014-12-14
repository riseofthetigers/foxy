"use strict";
var assert = require("chai").assert;
var request = require("supertest");
var connect = require("connect");
var http = require("http");
var foxy = require("../../../");
var getUrl = require("./helpers").getUrl;
var stripSchema = require("./helpers").stripSchema;
var getbase = function(url) {
  return ("\n        <html>\n        <a href=\"" + url + "\"></a>\n        </html>\n    ");
};
describe("rewrite links", (function() {
  var app,
      server,
      serverUrl;
  before((function(done) {
    app = connect();
    server = http.createServer(app).listen();
    serverUrl = getUrl(server.address().port);
    app.use("/links.html", (function(req, res) {
      return res.end(getbase(serverUrl));
    }));
    done();
  }));
  after((function() {
    return server.close();
  }));
  it("http://localhost:", (function(done) {
    request(foxy(serverUrl)).get("/links.html").set("accept", "text/html").expect(200).end((function(err, res) {
      assert.equal(res.text, getbase(stripSchema(res.req._headers.host)));
      done();
    }));
  }));
}));
