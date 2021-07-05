"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var newparser = require('xml2json');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var projectNames = tl.getInput('projectNames', true);
            var projectThresholds = tl.getInput('projectThresholds', true);
            var codeCoverageFormat = tl.getInput('codeCoverageFormat', false);
            var codeCoverageFile = tl.getInput('codeCoverageFile', true);
            var coverageCalculation = tl.getInput('coverageCalculation', false);
            if (projectNames == 'bad' && projectThresholds == 'bad') {
                tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                return;
            }
            if (codeCoverageFormat == 'Cobertura') {
                var coverageReport = fs.readFileSync(codeCoverageFile, "utf8");
                parser.parseString(coverageReport, function (error, result) {
                    if (error === null) {
                        var convertedJson = JSON.parse(newparser.toJson(coverageReport, { reversible: true }));
                        var projectNames_array = projectNames === null || projectNames === void 0 ? void 0 : projectNames.split(',');
                        var projectThresholds_array = projectThresholds === null || projectThresholds === void 0 ? void 0 : projectThresholds.split(',').map(Number);
                        var belowThresholds = [];
                        //console.log(convertedJson);
                        for (var i = 0; i < (projectNames_array === null || projectNames_array === void 0 ? void 0 : projectNames_array.length); i++) {
                            console.log(projectNames_array[i]);
                            var objecttoCalculate = convertedJson.coverage.packages.package.find((record) => record.name === projectNames_array[i]);
                            console.log(objecttoCalculate);
                            var coveragePercent = projectThresholds_array[i] / 100;
                            if (coveragePercent < objecttoCalculate[coverageCalculation]) {
                                console.log("Coverage of " + projectNames_array[i] + " is " + objecttoCalculate[coverageCalculation] * 100 + " percent" + " which is above the defined threshold of " + projectThresholds_array[i] + " percent");
                            }
                            else {
                                console.log("Coverage of " + projectNames_array[i] + " is " + objecttoCalculate[coverageCalculation] * 100 + " percent" + " which is below the defined threshold of " + projectThresholds_array[i] + " percent");
                                belowThresholds.push(projectNames_array[i]);
                            }
                        }
                        if (belowThresholds.length > 0) {
                            for (var k = 0; k < belowThresholds.length; k++) {
                                console.log(belowThresholds[k]);
                            }
                            tl.setResult(tl.TaskResult.Failed, 'Code coverage of above project(s) is below the defined threshold');
                        }
                    }
                    else {
                        console.log(error);
                        tl.setResult(tl.TaskResult.Failed, 'Failed Parsing Cobertura XML');
                    }
                });
            }
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
