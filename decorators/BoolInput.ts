import { Input } from '@angular/core';

/**
 * If the property exists in the HTML, it will be true. If not, it will be false
 */
export function BoolInput(name?: string) {
  return function(target: any, propertyKey: string) {
    Input(name)(target, propertyKey)
    
    const ngOnInit = target.ngOnInit || function() {}
    target.ngOnInit = function(...args) {
      this[propertyKey] = typeof this[propertyKey] == 'undefined' || this[propertyKey] === false ? false : true
      ngOnInit.apply(this, args)
    }
  }
}