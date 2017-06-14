const fs = require('fs');
const path = require('path');

let config = null;
let configModule = null;

let configs = {};
let configsModules = {};

let fsWatcher = null;

const getConfig = ()=>config || configs;

getConfig.watch = (dir,files) => {
  if (!path.isAbsolute(dir)){
    dir=path.normalize(path.dirname(module.parent.filename)+'/'+dir);
  }

  if (configModule) {
    delete require.cache[configModule];
  }
  configModule = null;
  config = null;

  Object.getOwnPropertyNames(configsModules).forEach(configName => {
    delete require.cache[configModules[configName]];
  })
  configs = {};
  configsModules = [];

  if (Array.isArray(files)){
    files.forEach(file => {
      configsModules[file] = require.resolve(dir+'/'+file);
      configs[path.basename(file,path.extname(file))] = require(dir+'/'+file);
    })
  }else{
    configModule = require.resolve(dir+'/'+files);
    config=require(dir+'/'+files);
  }

  fsWatcher = fs.watch(dir,{persistent:true},function(event,fn){
    if (Array.isArray(files)){
      if (files.indexOf(fn)>=0){
        delete require.cache[(configsModules[fn])];
      //  configsModules[fn] = require.resolve(dir+'/'+fn);
        configs[path.basename(fn,path.extname(fn))] = require(dir+'/'+fn);
      }
    }else{
      if (fn==files){
        delete require.cache[configModule];
        config=require(dir+'/'+files);
      }
    }
  })
  return getConfig;
}

getConfig.unwatch = () => {if (fsWatcher) {fsWatcher.close();fsWatcher = null;return getConfig}};
module.exports=getConfig;
