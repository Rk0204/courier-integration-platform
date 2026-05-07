module.exports = {
    toCourier(data) {
        return [
            {
                customerCode: data.customerCode || 'UEBCUS0008',

                orderNumber: data.orderId,

                declaredValue: data.declaredValue || 100,

                itemDescription: data.itemDescription || 'BOOKS',

                collectableValue:
                    data.paymentType === 'COD'
                        ? data.collectableValue || 100
                        : 0,

                height: data.height || 10,
                length: data.length || 10,
                breadth: data.breadth || 10,

                pieces: data.pieces || 1,

                weight: data.weight || 1,

                serviceType: data.serviceType || 'SDD',

                payMode:
                    data.paymentType === 'COD'
                        ? 'COD'
                        : 'Prepaid',

                // Return details
                rtnCity: data.returnCity || 'Bangalore',
                rtnName: data.returnName || 'Roshan',

                rtnEmail:
                    data.returnEmail || 'test@test.com',

                rtnState: data.returnState || 'KA',

                rtnMobile:
                    data.returnMobile || 9999999999,

                rtnAddress:
                    data.returnAddress ||
                    'Bangalore Address',

                rtnAddressType: 'Seller',

                rtnCountry: 'INDIA',

                rtnPincode:
                    data.returnPincode || 560001,

                // Shipper details
                shprCity: data.shipperCity || 'Bangalore',

                shprName:
                    data.shipperName || 'Roshan',

                shprEmail:
                    data.shipperEmail || 'test@test.com',

                shprState:
                    data.shipperState || 'KA',

                shprMobile:
                    data.shipperMobile || 9999999999,

                shprAddress:
                    data.shipperAddress ||
                    'Bangalore Address',

                shprAddressType: 'Seller',

                shprCountry: 'INDIA',

                shprPincode:
                    data.shipperPincode || 560001,

                // Consignee details
                consCity:
                    data.deliveryCity || 'Delhi',

                consName:
                    data.customerName || 'Customer',

                consEmail:
                    data.customerEmail || 'customer@test.com',

                consState:
                    data.deliveryState || 'DL',

                consMobile:
                    data.customerPhone || 9999999999,

                consAddress:
                    data.deliveryAddress,

                consAddressType: 'Home',

                consCountry: 'INDIA',

                consPincode:
                    data.deliveryPincode || 110001,

                // Invoice
                invoiceNumber:
                    data.invoiceNumber || 'INV001',

                invoiceDate:
                    data.invoiceDate ||
                    new Date().toISOString().split('T')[0],

                invoiceValue:
                    data.invoiceValue || 100,

                itemQuantity:
                    data.itemQuantity || 1
            }
        ];
    },

    toInternal(data) {
  const failed =
    data?.errorResponse &&
    data.errorResponse.length > 0;

  return {
    success: !failed,

    rawResponse: data,

    errors: data.errorResponse || [],

    shipment:
      data.successResponse?.[0] || null,

    status:
      failed ? 'FAILED' : 'CREATED'
  };
}
};