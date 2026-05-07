const UrbaneBolt = require('./urbanbolt/urbanbolt.adapter');
const Mock = require('./mock/mock.adapter');

class Factory {
  static getCourier(name) {
    if (name === 'urbanebolt') return new UrbaneBolt();
    if (name === 'mock') return new Mock();
    throw new Error('Unsupported courier');
  }
}

module.exports = Factory;