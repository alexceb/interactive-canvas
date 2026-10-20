import type { TestModelProps } from './test-model.types';

/** Supplies a lightweight successful model renderer after a simulated import retry. */
export function TestModel({ shape }: TestModelProps) {
  return <div>Loaded {shape} preview</div>;
}
