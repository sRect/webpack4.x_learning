import {tree} from './test_tree_shaking';

let a = 1;
let b = 2;
let c = 3;
export const d  = a + b + c;

export const sum = (a, b) => {
  return a + b + 'sum';
};
export const minus = (a, b) => {
  return a - b + 'minus';
};