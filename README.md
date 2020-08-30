# mongoose-document-log
A plugin for mongoose to record document change. This plugin will create a new collection called _history, it has field structure : 
```
collectionName : string <it will record the name of your collection>, 
operation: string <this will record what the action/operation that change the document>
data: object <it contains "before" and "after" document change>
```

### Installation

```
npm install --save mongoose-document-log
```

### Usage
In your schema file, you can call this and use as plugin 

```
const mongoose = require("mongoose");
const mongooseDocumentLog = require("mongoose-document-log");

const userSchema = new mongoose.Schema({....})

userSchema.plugin(mongooseDocumentLog)

module.export = mongoose.model("users", userSchema);
```
