import tl = require('azure-pipelines-task-lib/task');
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
var newparser = require('xml2json');

async function run() {
    try {
        var projectNames: string = tl.getInput('projectNames', true)!;
        var projectThresholds: string = tl.getInput('projectThresholds', true)!;
        var codeCoverageFormat: string = tl.getInput('codeCoverageFormat', false)!;
        var codeCoverageFile: string = tl.getInput('codeCoverageFile', true)!;
        var coverageCalculation: string = tl.getInput('coverageCalculation', false)!;
        if (projectNames == 'bad' && projectThresholds == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
    
        if (codeCoverageFormat == 'Cobertura'){
            var coverageReport = fs.readFileSync(codeCoverageFile, "utf8");
            parser.parseString(coverageReport, function(error: null, result: any) {
                if(error === null) {
                    var convertedJson = JSON.parse(newparser.toJson(coverageReport, {reversible: true}));
                    var projectNames_array = projectNames?.split(',');
                    var projectThresholds_array = projectThresholds?.split(',').map(Number);
                    var belowThresholds =[];
                    if (projectNames_array[0] == 'Overall'){
                        console.log("Overall code coverage is: " + convertedJson.coverage[coverageCalculation] + ", threshold defined is: " + projectThresholds_array[0])
                        if (projectThresholds_array[0] < convertedJson.coverage[coverageCalculation]){
                            tl.setResult(tl.TaskResult.Succeeded, 'Overall code coverage is below the defined threshold');
                        } else {
                            tl.setResult(tl.TaskResult.Failed, 'Overall code coverage is below the defined threshold'); 
                        }
                    } else {
                    for(var i = 0; i < projectNames_array?.length; i++) {
                        var objecttoCalculate = convertedJson.coverage.packages.package.find( (record: { name: string; }) => record.name === projectNames_array[i] )
                            var coveragePercent = projectThresholds_array[i]/100;
                            if (coveragePercent < objecttoCalculate[coverageCalculation]){
                                console.log("Coverage of " + projectNames_array[i] + " is " + objecttoCalculate[coverageCalculation]*100 + " percent"  + " which is above the defined threshold of " + projectThresholds_array[i] + " percent")
                            } else {
                                console.log("Coverage of " + projectNames_array[i] + " is " + objecttoCalculate[coverageCalculation]*100 + " percent"  + " which is below the defined threshold of " + projectThresholds_array[i] + " percent")
                                belowThresholds.push(projectNames_array[i])
                            }
                    }
                    if (belowThresholds.length > 0) {
                    for(var k = 0; k < belowThresholds.length; k++) {
                     console.log(belowThresholds[k])
                    }
                    tl.setResult(tl.TaskResult.Failed, 'Code coverage of above project(s) is below the defined threshold');
                } else {
                    tl.setResult(tl.TaskResult.Succeeded, 'Code coverage of project(s) is above the defined thresholds');
                }
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
}

run();