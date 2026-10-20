import { lazy } from 'react';

// Each retry needs a fresh lazy component rather than React's cached rejected promise.
export const createModel = () =>
  lazy(() => import('../model/model').then((module) => ({ default: module.Model })));
export const InitialModel = createModel();
