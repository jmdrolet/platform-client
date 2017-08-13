'use strict';
const _ = require('underscore');

let conf = require('./webpack.common.config.js');
conf = _.extend({}, conf, {
    name: 'testing',
    target: 'node',
    entry: {
        'tests': ['./test/Test.ts'],
    },
    output: {
        path: require('path').resolve('./bin/tests'),
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'CoveoClient',
        devtoolModuleFilenameTemplate: '[resource-path]'
    },
    ts: {
        configFileName: 'test.tsconfig.json'
    }
});

module.exports = conf;