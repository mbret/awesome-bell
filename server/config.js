var path = require("path");

module.exports = {
    rootPath: __dirname,
    resourcesPath: path.join(__dirname, "resources"),
    tokenSecret: "foo",
    hostAlias: "",
    port: 3000
};