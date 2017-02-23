import * as angular from 'angular';
import {permanentList} from './token-lists';

const modules = new Map<string, angular.IModule>();

type DefineMetadata = (declaration: any, type: symbol, data: any) => void;
const defineMetadata: DefineMetadata =
  (declaration, type, data) =>
    Reflect.defineMetadata(type, data, declaration.prototype);

type GetMetadata = (declaration: any) => any;
const getMetadata: GetMetadata =
  declaration => {
    for (const token of permanentList) {
      if (Reflect.hasMetadata(token, declaration.prototype)) {
        return Reflect.getMetadata(token, declaration.prototype);
      }
    }

    throw new Error(`Declaration ${declaration.name} have no specified metadata`);
  };

type GetPluginMetadata = (type: symbol, declaration: any) => any;
const getPluginMetadata: GetPluginMetadata =
  (type, declaration) => {
    if (Reflect.hasMetadata(type, declaration.prototype)) {
      return Reflect.getMetadata(type, declaration.prototype);
    }

    throw new Error(`Declaration ${declaration.name} have no specified metadata`);
  };

export {
  modules,
  DefineMetadata,
  defineMetadata,
  GetMetadata,
  getMetadata,
  GetPluginMetadata,
  getPluginMetadata
};
