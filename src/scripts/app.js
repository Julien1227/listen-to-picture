//Web audio api
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var myBuffer;

var request = new XMLHttpRequest();

var o = context.createOscillator();
o.start(0);

var g = context.createGain();
g.gain.value = 0;

o.connect(g);
o.type = "triangle";
g.connect(context.destination);


require('../scripts/vibrant.js')
require("node-vibrant");

const imgInput = document.getElementById("imgInput"),
      img = document.querySelector(".img"),
      goBtn = document.getElementById("goBtn"),
      ul = document.querySelector(".color-list");

//Actualise l'image uploadée
imgInput.addEventListener('change', (e) => {
    img.src = URL.createObjectURL(e.target.files[0]);
});

//Récupère les couleurs de l'image et les joue
goBtn.addEventListener('click', function () {
    ul.innerHTML = "";
    var vibrant = new Vibrant(img);
    var swatches = vibrant.swatches();

    const rgbColors = [],
      hslColors = [],
      gainValues = [],
      frqs = [];

    for (var swatch in swatches){
        if (swatches.hasOwnProperty(swatch) && swatches[swatch]){
            
            //Affiche la couleur dans le html
            var li = document.createElement('li');
            li.classList.add('color');
            li.style.backgroundColor = swatches[swatch].getHex();
            ul.appendChild(li);
            
            //Récupère les couleurs RGB dans un tableau - pour la fréquence
            let rgbColor = swatches[swatch].getRgb();
            rgbColors.push(rgbColor);
            
            //Récupère les couleurs HSL dans un tableau (getHsl donne des valeurs inutilisable) - pour le gain
            let hslColor = RGBToHSL(rgbColor[0], rgbColor[1], rgbColor[2]);
            hslColors.push(hslColor);
            
            //Récupère une fréquence pour chaque couleurs
            let frq = Math.round((rgbColor[0]*1 + rgbColor[1]*1.8 + rgbColor[2]*0.3) * 100) / 100;
            frqs.push(frq);
            
            //crée et récupère un gain
            let gain = setGain(hslColor[1], hslColor[2]);
            gainValues.push(gain);
        }
    }

    // A BOUCLER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    g.gain.value = gainValues[0];
    o.frequency.value = frqs[0];
    //console.log(frqs[0]);

    setTimeout(() => {
        o.frequency.value = frqs[1];
        g.gain.value = gainValues[1];
        //console.log(frqs[1]);
    }, 250);

    setTimeout(() => {
        o.frequency.value = frqs[2];
        g.gain.value = gainValues[2];
        //console.log(frqs[2]);
    }, 500);

    setTimeout(() => {
        o.frequency.value = frqs[3];
        g.gain.value = gainValues[3];
        //console.log(frqs[3]);
    }, 750);

    setTimeout(() => {
        o.frequency.value = frqs[4];
        g.gain.value = gainValues[4];
        //console.log(frqs[4]);
    }, 1000);

    setTimeout(() => {
        g.gain.value = 0;
    }, 1250);
});

// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHSL(r,g,b) {
    let color = [];
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
    cmax = Math.max(r,g,b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;
    // Calculate hue
    // No difference
    if (delta == 0)
    h = 0;
    // Red is max
    else if (cmax == r)
    h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
    h = (b - r) / delta + 2;
    // Blue is max
    else
    h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    
    // Make negative hues positive behind 360°
    if (h < 0)
    h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        
    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    color.push(h);
    color.push(s);
    color.push(l);

    return color;
}

function setGain(lumValue, satValue) {
    var gainValue = 0.5;
    g.gain.value = gainValue;
    //Si la couleur est lumineuse, alors le son s'estompe également
    if(lumValue >= 50) {
        lumValue = 100 - lumValue;
    }

    gainValue = (satValue/100)*(lumValue/100);
    gainValue = (Math.round(gainValue * 100) / 100)*2;

    //Si couleur invisible -> son 0
    if(lumValue == 0 || lumValue == 100 || satValue == 0) {
        gainValue = 0;
    }

    return gainValue;
}