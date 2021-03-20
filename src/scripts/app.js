console.info('Hello world');
require('../scripts/vibrant.js')
require("node-vibrant");

const imgInput = document.getElementById("imgInput");
const img = document.querySelector(".img");
const goBtn = document.getElementById("goBtn");
const color = document.querySelector(".color");
const ul = document.querySelector(".color-list");
var colors = [];

imgInput.addEventListener('change', (e) => {
    let target = e.currentTarget
    img.src = URL.createObjectURL(e.target.files[0]);
});

goBtn.addEventListener('click', function () {
    ul.innerHTML = "";
    var vibrant = new Vibrant(img);

    var swatches = vibrant.swatches();

    for (var swatch in swatches){
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
            console.log(swatch, swatches[swatch].getRgb());
            
            var li = document.createElement('li');
            li.classList.add('color');
            li.style.backgroundColor = swatches[swatch].getHex();
            ul.appendChild(li);

            let color = swatches[swatch].getRgb();
            colors.push(color);
        }
    }

    console.log(colors);
    
});