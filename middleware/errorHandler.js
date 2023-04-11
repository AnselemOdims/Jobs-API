const errorHandler = (err, req, res, next) => {
  let customError = {
    message: err?.message ?? 'Something went wrong, please try again!',
    statusCode: err.statusCode || 500,
  };
  if (err.code && err.code === 11000) {
    customError = {
      message: `Duplicate error for the ${Object.keys(
        err.keyValue
      )} field. Please choose a different value`,
      statusCode: 400,
    };
  }
  if(err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(item => item.message).join(', ')
    // const keys = Object.keys(err.errors).join(', and ')
    // const message = `Please provide ${keys}`
    customError = {
        message,
        statusCode: 400
    }
  }
  if(err.name === 'CastError') {
    customError = {
        message: `No item with id ${err.value} found`,
        statusCode: 404
    }
  }
  res
    .status(customError.statusCode)
    .json({ code: '99', message: customError.message });
};

module.exports = errorHandler;
