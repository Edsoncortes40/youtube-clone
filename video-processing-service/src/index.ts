import express  from "express";
import { downloadRawVideo, setupDirectories, 
    uploadProcessedVideo, convertVideo, 
    deleteRawVideo, deleteProcessedVideo } from "./storage";

setupDirectories();

const app = express();
app.use(express.json()); //tell express to use json for Request body format.

//This an HTTP GET endpoint
app.post("/process-video", async (req, res) =>{
    //Get the bucket and filename from the Cloud Pub/Sub message
    let data;
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name){ //data.name will tell us the fileName
            throw new Error('Invalid message payload received!');
        }
    } catch (error){
        console.error(error);
        return res.status(400).send('Bad Request: missing filename.');
    }

    const inputFileName = data.name;
    const outputFileName = 'processed-' + inputFileName;

    // Download the raw video from Cloud storage
    await downloadRawVideo(inputFileName);

    // Convert the video to 360p resolution
    try{
        await convertVideo(inputFileName, outputFileName);
    }catch (err) {
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])
        
        console.error(err);
        return res.status(500).send('Internal Server Error: video processing failed!');
    }

    // Upload the processed video to Cloud storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ])

    return res.status(200).send('Processing finished successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        'Server is running on Port: ' + port);
});
