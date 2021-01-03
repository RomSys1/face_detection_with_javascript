const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo);

function startVideo(){
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
        err => console.error(err),
    );
}

/* startVideo(); */
video.addEventListener('play', ()=>{
    console.log("hace play");
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width:video.width, height: video.height};
    /* alfa: */
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(
        async () => {
            const detections = await faceapi.detectAllFaces(
                video, 
                new faceapi.TinyFaceDetectorOptions(),
            ).withFaceLandmarks().withFaceExpressions();
            console.log(detections);
            const resizeDetections = faceapi.resizeResults(
                detections,
                displaySize,
            );
            /* alfa: con esta linea limpia la imagen anterior */
            canvas.getContext('2d').clearRect(
                0,
                0,
                canvas.width, 
                canvas.height,
            );
            /* pinta el marco azul que detecta la cara*/
            faceapi.draw.drawDetections(canvas, resizeDetections);
            /* pinta una especie de carita ensima de las partes de la cabeza */
            /* pinta los puntos rosados */
            faceapi.draw.drawFaceLandmarks(canvas, resizeDetections);
            /* reconoce las expresiones como happy, sad */
            faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
        }, 
        100,
    );
});