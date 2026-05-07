module.exports = {
  success: (data) => ({ success: true, data }),
  error: (err) => ({ success: false, error: err })
};