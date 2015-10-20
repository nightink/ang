'use strict';

const fs = require('fs');
const assert = require('assert');
const coffee = require('coffee');

describe('ant', function() {
  const oriPkg = require(`${__dirname}/futrues/package.json`);
  const coffeeOpt = {
    cwd: `${__dirname}/futrues`
  }
  after(function() {
    fs.writeFileSync(`${__dirname}/futrues/package.json`, JSON.stringify(oriPkg, null, 2));
  });

  it('run success', function(done) {
    coffee.fork(`${process.cwd()}/cli.js`, coffeeOpt)
    .debug()
    .expect('code', 0)
    .end(function() {
      const pkg = JSON.parse(fs.readFileSync(`${__dirname}/futrues/package.json`));
      pkg.spm.should.property('dependencies');
      done();
    });
  });
});
