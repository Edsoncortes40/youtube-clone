import express  from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json()); //tell express to use json for Request body format.

//This an HTTP GET endpoint
app.post("/process-video", (req, res) =>{
    //Get path of the input video file from the request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath){
        res.status(400).send("Bad Request: Missing file Paths.");
    }

    //This function is Asynchronous
    ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360') //converting the video file into 360p resolution
    .on('end', function() {
        res.status(200).send("Video Processing Finished Successful!");
    })
    .on("error", function(err: any) {
        console.log('An error occured:' + err.message);
        res.status(500).send('Internal Server Error:' + err.message);
    })
    .save(outputFilePath);

});

const port = 3000;
app.listen(port, () => {
    console.log(
        'Video processing service listening at http://localhost:' + port);
});
