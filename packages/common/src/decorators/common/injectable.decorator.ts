import { INJECTABLE_METADATA } from '../../constants';
import { isUndefined } from '../../utils';

export interface IInjectableOptions {}

export function Injectable(
  injectableOptions?: IInjectableOptions
): ClassDecorator {
  const options = isUndefined(injectableOptions)
    ? undefined
    : injectableOptions;

  return (target: Object) => {
    Reflect.defineMetadata(INJECTABLE_METADATA, options, target);
  };
}
