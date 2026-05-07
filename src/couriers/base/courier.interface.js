class CourierInterface {
  async authenticate() {}
  async createOrder() {}
  async trackOrder() {}
  async cancelOrder() {}
}

module.exports = CourierInterface;