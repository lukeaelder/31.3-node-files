const fs = require("fs");
const process = require("process");
const axios = require("axios");

function output(data, out){
    if (out) {
        fs.writeFile(out, data, 'utf8', function(err) {
            if (err) {
                console.error(`Couldn't write ${out}: ${err}`);
                process.exit(1);
            }
        });
    } else {
        console.log(data);
    }
}

function readError(path, err){
    console.log(`Error reading ${path}: \n ${err}`);
    process.exit(1);
}

function cat(path, out){
    fs.readFile(path, "utf8", function(err, data){
        err ? readError(path, err) : output(data, out);
    });
}

async function webCat(path, out){
    try {
        let resp = await axios.get(path);
        output(resp.data, out);
    } catch (err) {
        readError(path, err)
    }
}

let path;
let out;

if (process.argv[2] === '--out') {
    out = process.argv[3];
    path = process.argv[4];
} else {
    path = process.argv[2];
}

path.slice(0, 7) === 'http://' ? webCat(path, out) : cat(path, out);