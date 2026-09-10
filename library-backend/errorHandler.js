const { GraphQLError } = require("graphql");

const errorHandler = ({ error, message }) => {
  if (
    error.type === "UserInputError" ||
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.code === 11_000
  ) {
    return new GraphQLError(message, {
      extensions: {
        code: "BAD_USER_INPUT",
        invalidArgs: error.errors ? Object.keys(error.errors) : undefined,
        error,
      },
    });
  }

  if (error.type === "AuthenticationError") {
    return new GraphQLError(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        invalidArgs: error.errors ? Object.keys(error.errors) : undefined,
        error,
      },
    });
  }

  return error;
};

module.exports = errorHandler;
