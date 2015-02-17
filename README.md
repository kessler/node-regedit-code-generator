# regedit-code-generator

Quick and dirty tool designed to scrape msdn for StdRegProv method signatures. 

The metadata obtained from there is then used to populate vbscript method templates that are used in Architecture Specific Registry api in [regedit](https://github.com/ironsource/node-regedit)

Clone this repo and then run ```node run.js > result.vbs```

## other files

### parseMsdnMethodUrls.js
parse the StdRegProv method summary page (defaults to [https://msdn.microsoft.com/en-us/library/aa393664(v=vs.85).aspx](https://msdn.microsoft.com/en-us/library/aa393664(v=vs.85).aspx)) to find all the methods. override url with --url

### parseMsdnMethod.js
parse a single method reference page to extract information that will later be used to construct the vbs method, must specify --url

### renderTemplate
buffers json piped into it, loads the template file specified by --template cl arg and the renders the template using the piped json as data

### vbMethodTemplate
a vbscript method template

## TODO
what about return values in current vbscript template (how do they work with ExecuteMethod?)

