"use strict";
var fs = require("fs");

class DataStorage {
    constructor(filePathTechnologies, filePathFluidInfo) {
        console.info("Path to technologies: " + filePathTechnologies);
        this.filePathTechnologies = filePathTechnologies;

        fs.stat(this.filePathTechnologies, (err, stat) => {
                if (err) {
                    console.log("Create empty file for technologies under " + this.filePathTechnologies);
                    fs.writeFileSync(this.filePathTechnologies, JSON.stringify([]));
                }

                fs.readFile(this.filePathTechnologies, "utf8", (err, data) => {
                    this.cacheTechnologies = JSON.parse(data);
                });
            }
        );

        console.info("Path to fluids: " + filePathFluidInfo);
        this.filePathFluidInfo = filePathFluidInfo;

        fs.stat(this.filePathFluidInfo, (err, stat) => {
                if (err) {
                    console.log("Create empty file for fluids under " + this.filePathFluidInfo);
                    fs.writeFileSync(this.filePathFluidInfo, JSON.stringify([]));
                }

                fs.readFile(this.filePathFluidInfo, "utf8", (err, data) => {
                    this.cacheFluids = JSON.parse(data);
                });
            }
        );
    }

    getTechnologies() {
        return this.cacheTechnologies;
    }

    getFluidsByType(fluidType) {
      return this.cacheFluids.filter(i => i.aggregateType === fluidType);
    }
}

module.exports = DataStorage;
