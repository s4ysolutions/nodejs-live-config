# NodeJS Live Config

A module to watch for the config files changes made outside the app and apply the changes without 
the application restart.

## Getting Started

Put a config or configs to a som directory and start watch for them. Since then
the each invocation of the LiveConfig() will return the most fresh state of a config/configs

Use:
```
const LiveConfig = require ('live-config');
...
config.watch('./etc','config1.json');
...
console.log(LiveConfig().prop1)
...
config.unwatch();
```


Sampe JSON configs:

_etc/config1.json_
```
{
  "prop11":11,
  "prop12":12
}
```

_etc/config2.json_
```
{
  "prop21":21,
  "prop22":2w
}
```
One config file 

```
const LiveConfig = require ('live-config');
...
config.watch('../etc','config1.json');
...
console.log(LiveConfig());
/* outputs
{
  "prop11":11,
  "prop12":12
}

 */
...
config.unwatch();

```

Few configs 

```
const LiveConfig = require ('live-config');
...
// one config file is simple
config.watch('../etc',['config1.json','config2.json']);
...
console.log(LiveConfig());
/* outputs
{
 "config1":
	{
		"prop11":11,
		"prop12":12
	},
 "config2":
	{
		"prop21":21,
		"prop22":22
	}

 */
...
config.unwatch();

```

The configs are "required" so they may be any valid JS/JSON script.

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
npm install nodejs-live-config
```


