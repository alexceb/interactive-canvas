import { lazy } from 'react';

// Creates a fresh lazy renderer so retries do not reuse a cached import rejection.
export const createModel = () =>
  lazy(() => import('../model/model').then((module) => ({ default: module.Model })));

export const InitialModel = createModel();
