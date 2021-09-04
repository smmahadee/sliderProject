const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const spinner = document.getElementById('spinner-loader');

let sliders = [];



const KEY = '15674931-a9d714b6e9d654524df198e00&q';


const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title 
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    // console.log(image);
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  spinToggler(false);
}

// SpinToggler Function....
const spinToggler = (show)=>{
  // console.log(show);
  // console.log(spinner.classList)
  if(show){
    spinner.classList.remove('d-none');
  }
  else{
    spinner.classList.add('d-none');
  }

}
const getImages = (query) => {
  spinToggler(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {

      
      document.getElementById("wrong-duration").style.display = "none";
      if(data.hits.length === 0){
        gallery.innerHTML = '';
        document.getElementById('not-found').innerHTML = `Image not found for <span class="text-danger">${query}</span>`;
        spinToggler(false);
      }
      else{
        document.getElementById('not-found').innerHTML = "";
        showImages(data.hits)
      }
    })
    .catch(err => console.log(err))
    
}

getImages("")

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
  } else {
    element.classList.remove('added');
    sliders = sliders.filter(slider => slider !== sliders[item]);

  }
}
let timer;
const createSlider = (duration) => {
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  
  document.querySelector('.main').style.display = 'block';
  imagesArea.style.display = 'none';
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

const changeItem = (index) => {
  changeSlide(slideIndex += index);
}

const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0 || index === 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none";
  })

  items[index].style.display = "block";
}

searchBtn.addEventListener('click', (evt) =>{
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
 
  getImages(search.value);
  evt.preventDefault();
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  const duration = document.getElementById('duration').value || 1000;
  const p = document.createElement("p");
  p.className = "text-center text-danger";
  p.id = "wrong-duration-text";
  p.innerText = "Sorry!!! Time Duration Can Not Be Negative Or Zero";
  if(duration <= 0){
    document.getElementById("wrong-duration").style.display = "block";
    document.getElementById("wrong-duration").innerHTML = "";
    document.getElementById("wrong-duration").appendChild(p);
  }
  else{
    createSlider(duration);
  }
})
