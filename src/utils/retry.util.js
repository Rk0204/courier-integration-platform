module.exports = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(r => setTimeout(r, delay));
    return module.exports(fn, retries - 1, delay * 2);
  }
};