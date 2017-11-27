import * as _ from 'underscore';
import { IStringMap } from '../interfaces/IStringMap';
import { flatten, unflatten } from 'flat';
import { Dictionary } from '../collections/Dictionary';

export class JsonUtils {
  static flatten(jsonObject: any): any {
    return flatten(jsonObject);
  }

  /**
   * Remove key value pairs from the JSON object.
   *
   * @static
   * @param {*} obj JSON
   * @param {string[]} [keysToRemove=[]]
   * @returns {*} any
   */
  static removeKeyValuePairsFromJson(obj: any, keysToRemove: string[] = []): any {
    if (keysToRemove.length === 0) {
      // Do not waste time for nothing
      return obj;
    }

    let map = flatten(obj);

    map = _.omit(map, (value: any, key: string) => {
      let keys = key.split('.');
      return _.intersection(keys, keysToRemove).length > 0;
    });

    return unflatten(map);
  }

  /**
   * Parse throught a JSON object and determine if the object contains the specified key
   *
   * @static
   * @param {*} obj
   * @param {string[]} [fields=[]]
   * @returns {boolean} Contains or not the specified key
   */
  static hasKey(obj: any, keysToFind: string[] = []): boolean {
    const map = flatten(obj);
    let noCommonElements = Object.keys(map).every((key: string) => {
      let keys = key.split('.');
      return _.intersection(keys, keysToFind).length === 0;
    });

    return !noCommonElements;
  }

  static convertJsonToDictionary(json: any, fieldsToIgnore?: string[]): Dictionary<any> {
    let ignoreList = fieldsToIgnore || new Array<string>();
    let newDictionary: Dictionary<any> = new Dictionary<any>();

    Object.keys(json).forEach((key: string) => {
      if (ignoreList.indexOf(key) === -1) {
        newDictionary.add(key, json[key]);
      }
    });

    return newDictionary;
  }
}
