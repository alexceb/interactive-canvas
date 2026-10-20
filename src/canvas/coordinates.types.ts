export interface Point {
  x: number;
  y: number;
}
export interface Viewport extends Point {
  zoom: number;
}
export interface Bounds extends Point {
  width: number;
  height: number;
}
