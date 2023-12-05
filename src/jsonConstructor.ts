import { ArgumentOptions, JSONArray, JSONObject } from './types';
import { areSameTypes, isArray, isObject } from './utils';

class JSONConstructor {
  private generateBoilerplate: boolean = false;

  constructor({ generateBoilerplate }: Pick<ArgumentOptions, 'generateBoilerplate'>) {
    this.generateBoilerplate = generateBoilerplate || false;
  }

  public syncObjects(source: JSONObject, target: JSONObject) {
    for (const key of Object.keys(source)) {
      this.mergeKey(source, target, key);
    }
  }

  public mergeKey(source: JSONObject, target: JSONObject, key: string) {
    const sourceValue = source[key] as JSONObject;
    const targetValue = target[key] as JSONObject;

    if (target.hasOwnProperty(key)) {
      if (areSameTypes(sourceValue, targetValue)) {
        if (isArray(sourceValue)) {
          // need to think on what to do here.
        } else if (isObject(sourceValue)) {
          this.syncObjects(sourceValue, targetValue);
        } else {
          target[key] = this.copyValue(sourceValue as unknown as string, targetValue as unknown as string);
        }
      } else {
        new Error('mismatch on types');
      }
    } else {
      this.manipulateTarget(source, target, key);
    }
  }

  public copyArray(source: JSONArray, target: JSONArray): JSONArray {
    // change this until there is a way to control items in array like an id
    if (this.generateBoilerplate || (target && target.length > 0)) return [];

    const targetArr = [];
    for (let item of source) {
      if (isArray(item)) {
        const newArray = this.copyArray(item as unknown as JSONArray, [] as JSONArray);
        targetArr.push(newArray);
      } else if (isObject(item)) {
        const target = {} as JSONObject;
        this.syncObjects(item, target);
        targetArr.push(target);
      } else {
        targetArr.push(this.copyValue(item as unknown as string, ''));
      }
    }

    return targetArr as JSONArray;
  }

  public manipulateTarget(source: JSONObject, target: JSONObject, key: string): any {
    const sourceValue = source[key as keyof Object];
    const targetValue = target[key as keyof Object];

    if (isObject(sourceValue)) {
      target[key as keyof typeof target] = {} as JSONObject;
      return this.syncObjects(sourceValue, target[key] as JSONObject);
    } else if (isArray(sourceValue)) {
      target[key] = this.copyArray(sourceValue as unknown as JSONArray, targetValue as unknown as JSONArray);
    } else {
      target[key] = this.copyValue(sourceValue as unknown as string, '');
    }
  }

  public copyValue(sourceValue: string, targetValue: string): string {
    if (this.generateBoilerplate) return '';
    return targetValue ? targetValue : sourceValue;
  }
}

export default JSONConstructor;
