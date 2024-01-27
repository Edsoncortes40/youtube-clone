import express  from "express";

const app = express();
const port = 3000;

//This an HTTP GET endpoint
app.get("/", (req, res) =>{
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(
        'Video processing service listening at http://localhost:${port}');
});
