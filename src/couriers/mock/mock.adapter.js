class MockCourier {
  async createOrder() {
    return {
      courierOrderId: 'MOCK123',
      awb: 'AWB123',
      status: 'CREATED'
    };
  }

  async trackOrder() {
    return { status: 'DELIVERED' };
  }

  async cancelOrder() {
    return { status: 'CANCELLED' };
  }
}

module.exports = MockCourier;