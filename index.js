let fs = require('fs-extra'),
    path = require('path');

let fsPlus = {

    /**
     * Gets an array of all files in a folder. Returns either full paths (default) or filenames.
     */
    readFilesInDirSync : function(dir, fullPath = true){
        let items = fs.readdirSync(dir)
            results = [];

        for(let item of items){
            if (!fs.lstatSync(path.join(dir, item)).isFile())
                continue;

            results.push(fullPath ? path.join(dir, item) : item);
        }

        return results;
    },


    /**
     * Gets all files nested under a path. 
     * Set fullpath to false for file names only. 
     * Extension mask can be a string or array of strings, must be fill extensions with leading dots.
     */
    readFilesUnderDirSync : function(dir, fullPath = true, extensionMask = []){
        let results = [];
        if (!extensionMask)
            extensionMask = [];

        if (typeof extensionMask === 'string')
            extensionMask= [extensionMask];

        function processDirectory(dir){
            let items = fs.readdirSync(dir)

            for (let item of items){
                let stat = fs.lstatSync();
                if (stat.isDirectory())
                    processDirectory(path.join(dir, item));
                else if(stat.isFile()){
                    if (extensionMask.length && !extensionMask.includes(path.extname(item)))
                        continue;
                    results.push(fullPath ? path.join(dir, item ): item);
                }
            }
        };

        processDirectory(dir)
        return results;
    },


    /**
     * Deletes a file or an array of files. Fullpaths required. 
     */
    unlinkAllSync : function(files){
        if (typeof files === 'string') 
            files = [files];

        for (let file of files)
            fs.unlinkSync(file);
    }
};

module.exports = Object.assign(fs, fsPlus);
