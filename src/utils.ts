export function isObject(value: any): value is { [key: string]: string } {
  return getTypeName(value) === "Object";
}

export function isArray(value: any): value is { [key: string]: string } {
  return getTypeName(value) === "Array";
}
export function areSameTypes(value: any, otherValue: any) {
  return getTypeName(value) === getTypeName(otherValue);
}

export function getTypeName(object: any) {
  const fullName: string = Object.prototype.toString.call(object);
  return fullName.split(" ")[1].slice(0, -1);
}
