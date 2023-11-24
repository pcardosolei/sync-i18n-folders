import { ArgumentOptions, JSONArray, JSONObject, JSONValue } from "./types";
import { areSameTypes, isArray, isObject } from "./utils";

class JSONConstructor {
  private generateBoilerplate: boolean = false;

  constructor({
    generateBoilerplate,
  }: Pick<ArgumentOptions, "generateBoilerplate">) {
    this.generateBoilerplate = generateBoilerplate || false;
  }

  public syncObjects(source: JSONObject, target: JSONObject) {
    this.mergeKeys(source, target);
  }

  public mergeKeys(source: JSONObject, target: JSONObject) {
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
          // ignoring the plurals - need to include those
          target[key] = this.copyValue(
            source as unknown as string,
            target as unknown as string
          );
        }
      } else {
        new Error("mismatch on types");
      }
    } else {
      target[key] = this.copyValue(
        source as unknown as string,
        target as unknown as string
      );
    }
  }

  public copyEmptyArray(source: JSONObject, target: JSONObject, key: string) {
    const targetArray = target[key] as unknown as JSONArray;
    const sourceArray = source[key] as unknown as JSONArray;

    if (!targetArray || targetArray.length == 0) {
      // change this later
      console.log("here");
      target[key] = source[key];
    } else {
      // maintain arrays.
    }
  }

  public compare(source: JSONObject, target: JSONObject, key: string) {
    const sourceValue = source[key as keyof Object];
    const targetValue = target[key as keyof Object];
    if (isObject(sourceValue)) {
      target[key as keyof typeof target] = {} satisfies JSONObject;
      this.syncObjects(sourceValue, target[key] as JSONObject);
    } else if (isArray(sourceValue)) {
      this.copyEmptyArray(source, target, key);
    } else {
      target[key] = this.copyValue(
        sourceValue as unknown as string,
        targetValue as unknown as string
      );
    }
  }

  public copyValue(sourceValue: string, targetValue: string): string {
    if (this.generateBoilerplate) return "";
    return targetValue ? targetValue : sourceValue;
  }
}

export default JSONConstructor;
