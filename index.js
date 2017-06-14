const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;

let config = null;
let configModule = null;

let configs = {};
let configsModules = {};

let fsWatcher = null;

const getConfig = ()=>config || configs;
const eventEmitter = new EventEmitter();


getConfig.unwatch = () => {if (fsWatcher) {fsWatcher.close();fsWatcher = null;return getConfig}};
getConfig.events = eventEmitter;

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
      const n = path.basename(file,path.extname(file));
      const c = require(dir+'/'+file);
      configs[n] = c;
    })
  }else{
    configModule = require.resolve(dir+'/'+files);
    config=require(dir+'/'+files);
  }

  fsWatcher = fs.watch(dir,{persistent:true},function(event,fn){
    if (Array.isArray(files)){
      if (files.indexOf(fn)>=0){
        delete require.cache[(configsModules[fn])];
        const n = path.basename(fn,path.extname(fn));
        const c = require(dir+'/'+fn);
        configs[n] = c;
        eventEmitter.emit('change',c,n)
      }
    }else{
      if (fn==files){
        delete require.cache[configModule];
        config=require(dir+'/'+files);
        eventEmitter.emit('change',config)
      }
    }
  })
  return getConfig;
}

module.exports=getConfig;
