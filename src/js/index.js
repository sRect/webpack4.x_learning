import '../css/base.less';
require('../css/index.css');
import logo from '../img/demo.jpeg';
import photo from '../img/11.jpeg';

let a = 1;
console.log(a);

let img = document.createElement('img');
let pic = document.createElement('img');
img.src = logo;
pic.src = photo;
img.onload = function() {
  document.body.appendChild(img);
}

pic.onload = function () {
  document.body.appendChild(pic);
}