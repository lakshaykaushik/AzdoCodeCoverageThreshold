# AzdoCodeCoverageThreshold

# AzdoCodeCoverageThreshold Extension
This extension can be used in Azure devops to assert different code coverage threshold values on different projects inside a same repo. This extension can also be used to assert overall code coverage threshold value on the complete repo. 


Supported features:
1. Failing builds on Overall Code Coverage
2. Failing builds on individual code coverages of projects within a repo
3. Asserting thresholds on line and branch
4. All languages which support Cobertura format for code coverage


## Usage:

### 1. Install the below extension in your azure devops org:
Name: Code Coverage Thresholds
Publisher: LakshayKaushik



### 2.Select codecoveragethreshold task from pipeline tasks.
```
- task: codecoveragethreshold@1
  inputs:
    projectNames: 'project1,project2,project3'
    projectThresholds: '10,15,20'
    codeCoverageFile: 'Cobertura.xml'
    codeCoverageFormat: Cobertura
    coverageCalculation: line-rate```

* projectNames: Accepts either 'Overall' or a comma seperated list of all projects for which code coverage threshold needs to be defined.
* projectThresholds: Accepts a comma seperated list of threshold values for projects. Index 0 of this list corresponds to index 0 of projectNames list. 
* codeCoverageFile: File which contains the code coverage results. For e.g. Cobertura.xml
* codeCoverageFormat: Format of the code coverage report. By default Cobertura is supported. 
* coverageCalculation: Code coverage calculation mechanism. Both line-rate and branch-rate are supported.



### 3. Now, use the task in your pipeline.

```
- task: codecoveragethreshold@1
  inputs:
    projectNames: 'project1,project2,project3'
    projectThresholds: '10,15,20'
    codeCoverageFile: 'Cobertura.xml'
    codeCoverageFormat: Cobertura
    coverageCalculation: line-rate
  
```

#### 3.1 For Overall Code Coverage Assertion
```
- task: codecoveragethreshold@1
  inputs:
    projectNames: 'Overall'
    projectThresholds: '50'
    codeCoverageFile: 'Cobertura.xml'
    codeCoverageFormat: Cobertura
    coverageCalculation: line-rate

```
## Build Process of the extension.

Before building the extension, you need to have docker engine installed on your local machine or if you are doing a build in a CI pipeline, docker engine needs to be installed on the pipeline agent too. 

Steps to build:

### 1. Spin a docker container based on node10.
```
docker run  -it -d --name nodejs2 node:10.13.0

```

### 2. Install tfx-cli, typescript inside the container.

``` npm install -i -g tfx-cli ```
``` npm install -i -g typescript ```

### 3. Now increment the build version in task.json and vss-extension.json. 

```
{
    "manifestVersion": 1,
    "id": "CodeCoverageThresholds",
    "name": "Code Coverage Thresholds",
    "version": "1.0.11",
    "publisher": "LakshayKaushik",
    "targets": [
        {
            "id": "Microsoft.VisualStudio.Services"
        }
    ],  
```
```
"$schema": "https://raw.githubusercontent.com/Microsoft/azure-pipelines-task-lib/master/tasks.schema.json",
    "id": "61a77633-0c67-4dc1-94c0-4b695d23fbdf",
    "name": "codecoveragethreshold",
    "friendlyName": "codecoveragethreshold",
    "description": "This task lets you define threshold on project level within an application",
    "helpMarkDown": "",
    "category": "Utility",
    "author": "LakshayKaushik",
    "version": {
        "Major": 1,
        "Minor": 0,
        "Patch": 11
    },
```
        

### 4. Generate vsix file.

Run ```codecoveragethreshold/tsc``` and ```tfx extension create --manifest-globs vss-extension.json```, this will generate vsix file which can be uploaded to the marketplace.


This project welcomes contributions and suggestions. 

## Communication and Support

TO BE UPDATED



