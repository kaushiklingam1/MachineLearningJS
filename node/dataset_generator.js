// const draw=require('./draw.js');

const draw = {};

draw.path = (ctx,path,color="black")=>{
    ctx.strokeStyle=color;
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(...path[0]);
    for(let i=1;i<path.length;i++){ 
        ctx.lineTo(...path[i]);
    }
    ctx.lineCap="round"; 
    ctx.lineJoin="round";
    ctx.stroke();
}

draw.paths=(ctx,paths,color="black")=>{
    for(const path of paths){
        draw.path(ctx,path,color);
    }
}

const {createCanvas} = require('canvas');
const canvas = createCanvas(400,400);
const ctx=canvas.getContext('2d');

const constants = {};

// constants.DATA_DIR="../data";
constants.DATA_DIR="C:/Users/kaush/Downloads/MachineLearningJS/data"
constants.RAW_DIR= constants.DATA_DIR+"/raw";
constants.DATASET_DIR=constants.DATA_DIR+"/dataset";
constants.JSON_DIR=constants.DATASET_DIR+"/json";
constants.IMG_DIR=constants.DATASET_DIR+"/img";
constants.SAMPLES=constants.DATASET_DIR+"/samples.json";

const fs = require('fs');
const path = require('path');

const fileNames = fs.readdirSync(constants.RAW_DIR);
const samples = [];
let id = 1;
fileNames.forEach(fn=>{
    const content = fs.readFileSync(
        constants.RAW_DIR+"/"+fn
    );

    const {session,student,drawings}=JSON.parse(content);
    for(let label in drawings){
        samples.push({
            id,
            label,
            student_name:student,
            student_id:session
        });

        const paths = drawings[label];
        fs.writeFileSync( constants.JSON_DIR + "/" + id + ".json", JSON.stringify(paths));

        generateImageFile(constants.IMG_DIR+"/"+id+".png", paths)

        id++;

    }
})

fs.writeFileSync(constants.SAMPLES, JSON.stringify(samples));


function generateImageFile(outFile, paths){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw.paths(ctx,paths);

    const buffer=canvas.toBuffer("image/png");
    fs.writeFileSync(outFile,buffer);
}