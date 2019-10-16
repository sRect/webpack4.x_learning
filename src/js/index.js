import "./test_react";
import '../css/base.less';
require('../css/index.css');
import logo from '../img/demo.jpeg';
import photo from '../img/11.jpeg';
import moment from 'moment';

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

const fn = () => {
  console.log("ff");
}

fn();

class Foo {
  constructor() {
    this.a = 1;
  }
}

console.log(Foo.a);

// 草案语法
@log
class A {
  a = 1;
}

function log(target) {
  console.log(target)
}

let arr = [1,2,[1, [1,2]],3].flat(Infinity);
console.log(arr)
console.log(A)

document.getElementById('content').innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');

// 用于热更新
if (module.hot) {
  module.hot.accept();
}
