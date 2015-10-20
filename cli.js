#!/usr/bin/env node
'use strict';

const fs = require('fs');
const co = require('co');
const wspider = require('wspider').requestToYield;

const debug = require('debug')('ant');
const pkgPath = `${process.cwd()}/package.json`

const RE = /^([a-z]\w*)\/\w*/i;
co(function* () {
  const pkg = JSON.parse(fs.readFileSync(pkgPath));
  const alias = pkg.spm.alias;
  const getComponentList = [];

  debug('package spm alias', alias);
  for(const componentName in alias) {
    const componentPath = alias[componentName];
    const prefix = (RE.exec(componentPath))[1];
    debug('prefix %s', prefix);
    getComponentList.push(wspider(`http://spmjs.io/repository/${prefix}-${componentName}/`));
  }

  const componentList = yield getComponentList;
  debug('component list %o', componentList);
  const dependencies = {};
  for(const component of componentList) {
    const componentPkg = component.json;
    dependencies[componentPkg.name] = componentPkg.version
  }
  // debug('spm dependencies %s', JSON.stringify(dependencies, null, 2));

  pkg.spm.dependencies = dependencies;
  pkg.name = `${pkg.family}-${pkg.name}`;
  pkg.version = '1.0.0';

  delete pkg.spm.alias;
  delete pkg.family;

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}).catch(function(err) {
  console.log('co error %s', err, err.stack);
});
