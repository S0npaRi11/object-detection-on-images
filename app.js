// get all the html elements
const canvas = document.getElementById('canvas');
const results = document.getElementById('results');
const uploadImage = document.getElementById('uploadImage');
const detectBtn = document.getElementById('detectBtn');
const uploadedImage = document.getElementById('uploadedImage');
const instruction = document.getElementById('instruction');
const tryAgain = document.getElementById('tryAgain');

const context = canvas.getContext('2d');

// all the functions here
const objectDetector = ml5.objectDetector('cocossd',{}, () => {
    console.log('model is loaded!!!');
    instruction.innerHTML = `Please select an image.`;
    uploadImage.style.display = 'block'
})


const displayImage = () => {
    const file = uploadImage.files[0];

    // make canvas and detect button visible and file input invisible
    uploadImage.style.display = 'none'
    canvas.style.display = 'initial'
    detectBtn.style.display = 'block'
   
    // changing the text of the instruction.
    instruction.innerHTML = `Press the <b> Detect</b> button to detect the objects within the image.`

    //displaying preview of the image
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        uploadedImage.src = reader.result
        uploadedImage.addEventListener('load',() => {
          context.drawImage(uploadedImage,0,0, 300,300);
        })
    });
    reader.readAsDataURL(file)
}

const getDetection = () => {
    console.log('Get detection got called!!!!')
    objectDetector.detect(uploadedImage,(error, result) => {
        if(error) console.error(error)
        else{
            // iterate for every detected object
            for(let i = 0; i < result.length; i++){
                context.fillStyle = '#db92ff73'
                context.fillRect(result[i].x,result[i].y,result[i].height * 1.5,result[i].width * 1.5);
                context.fillStyle = '#000';
                context.font = "15px Courier";
                context.fillText(`${result[i].label} - conf: ${Math.floor(result[i].confidence * 100)}%`, result[i].x + 10, result[0].y + 25); 
            }

            // hide the detect button and show the try again button
            detectBtn.style.display = 'none';
            tryAgain.style.display = 'block';

            instruction.innerHTML = `Press <b> Try Again</b> to repeat`

        }
    })
}

const detectAgain = () => {
    context.clearRect(0,0,300,300);

    // hide tryAgain button and canvas
    tryAgain.style.display = 'none'
    canvas.style.display = 'none'

    instruction.innerHTML = `Please select an image.`;
    uploadImage.style.display = 'block'
}

// all the event listening here
uploadImage.addEventListener('change', displayImage)
detectBtn.addEventListener('click', getDetection)
tryAgain.addEventListener('click', detectAgain)
