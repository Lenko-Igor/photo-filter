const inputs = document.querySelector('.filters').querySelectorAll('input');
const img = document.querySelector('.editor').querySelector('img');
const btnContainer = document.querySelector('.btn-container');
const btns = btnContainer.querySelectorAll('.btn');
const loadInp = document.querySelector('#btnInput');
const root = document.querySelector(':root');
const rootStyles = getComputedStyle(root);
const screen = document.querySelector('.fullscreen');
let count = 1;


inputs.forEach(elem => {
  const output = elem.nextElementSibling;
  const sizing = elem.getAttribute('data-sizing');

  elem.addEventListener('input', (e) => {
    output.value = e.target.value;
    root.style.setProperty(`--${elem.name}`, `${e.target.value}${sizing}`);
  });
});

btnContainer.addEventListener('click', (event) => {
  let e = event.target;

  if(e.matches('.btn-reset')){
    getActive(e);

    inputs.forEach(elem => {
      if(elem.name === 'saturate'){
        elem.nextElementSibling.value = 100;
        elem.value = 100;
      } else {
        elem.nextElementSibling.value = 0;
        elem.value = 0;
      };
    root.style.setProperty(`--${elem.name}`, ``);
    });
  };

  if(e.matches('.btn-next')){
    getActive(e);

    const hour = new Date().getHours();
    let time = '';
    
    if(hour >= 6 && hour < 12){
      time = 'morning';
    } else if(hour >= 12 && hour < 18){
      time = 'day';
    } else if(hour >= 18 && hour < 24){
      time = 'evening';
    } else {
      time = 'night';
    };

    (function(){
      let num = null;
      
      if(count === 20 ){count = 1};
      (count >= 1 && count < 10)? num = `0${count++}`: num = `${count++}`

      img.src = getLinkImage(time, num)
    })();
  }

  if(e.id === 'btnInput'){
    getActive(e.parentElement)
  }

  if(e.matches('.btn-save')){
    getActive(e)
    const src = document.querySelector('.editor').querySelector('img').src
    createCanvasImage (src)
  }
})

loadInp.addEventListener('change', () => {
  const file = loadInp.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    img.src = this.result
  };
  
  reader.readAsDataURL(file);
});

screen.addEventListener('click', toggleFullScreen);

// it's functions for work app 

function getValueOfOutputs(){
  const inputs = document.querySelector('.filters').querySelectorAll('input');
  const props = [];

  inputs.forEach(elem => {
    const output = elem.nextElementSibling;
    const sizing = elem.getAttribute('data-sizing');
    const title = elem.name;
    const value = output.value;

    (title === 'hue')? props.push(`${title}-rotate(${value}${sizing})`) : props.push(`${title}(${value}${sizing})`);
  })
  return props;
};

function createCanvasImage (src){
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
   
  img.setAttribute('crossOrigin', 'anonymous'); 
  img.src = src;
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    const stylesForCanvas = getValueOfOutputs().map(elem => {
      const sliced = elem.slice(0,4);
      
      if (sliced === 'blur') {
        const number = +elem.slice(5, elem.length - 3);
        elem = `blur(${number * 2}px)`;
      };

      return elem;
    });
    ctx.filter = stylesForCanvas.join(' ');
    ctx.drawImage(img, 0, 0);
    getSaveImage(canvas);
  }; 
};

function getSaveImage(canvas) {
  var link = document.createElement('a');
  link.download = 'download.png';
  link.href = `${canvas.toDataURL()}`;
  link.click();
  link.delete;
};

function getActive(elem){
  btns.forEach(elem => elem.classList.remove('btn-active'));
  elem.classList.add('btn-active');
};

function getLinkImage(time, num){
  const url = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
  const day = `${time}/`;
  const img = `${num}.jpg`;
  return url+day+img;
};

function toggleFullScreen() {
  if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    };
  };
};