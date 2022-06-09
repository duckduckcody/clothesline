const apify = {
  openRequestQueue: jest.fn(() => ({ addRequest: jest.fn() })),
};

module.exports = apify;
