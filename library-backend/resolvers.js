const errorHandler = require("./errorHandler");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const resolvers = {
  Author: {
    bookCount: async ({ _id }) => Book.countDocuments({ author: _id }),
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (_, { author, genre }) => {
      const filter = {};

      if (author) {
        const authorDoc = await Author.findOne({ name: author });
        if (!authorDoc) return [];

        filter.author = authorDoc._id;
      }

      if (genre) filter.genres = { $in: [genre] };

      return Book.find(filter).populate("author");
    },
    allAuthors: async () => Author.find({}),
    me: async (_, __, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        return null;
      }

      return currentUser;
    },
  },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw errorHandler({
          error: { type: "AuthenticationError" },
          message: "User not authenticated",
        });
      }

      const bookExists = await Book.exists({ title: args.title });

      if (bookExists) {
        throw errorHandler({
          error: { type: "UserInputError" },
          message: `Title must be unique: ${args.title}`,
        });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          throw errorHandler({
            error,
            message: `Saving author failed: ${error.message}`,
          });
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        await book.save();
      } catch (error) {
        throw errorHandler({
          error,
          message: `Saving book failed: ${error.message}`,
        });
      }

      return book.populate("author");
    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw errorHandler({
          error: { type: "AuthenticationError" },
          message: "User not authenticated",
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw errorHandler({
          error,
          message: `Saving author failed: ${error.message}`,
        });
      }

      return author;
    },
    createUser: async (_, args) => {
      const userExists = await User.exists({ username: args.username });

      if (userExists) {
        throw errorHandler({
          error: { type: "UserInputError" },
          message: `User must be unique: ${args.username} already exists`,
        });
      }

      const user = new User({ ...args });

      try {
        await user.save();
      } catch (error) {
        throw errorHandler({
          error,
          message: `Creating user ${args.username} failed: ${error.message}`,
        });
      }

      return user;
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw errorHandler({
          error: { type: "AuthenticationError" },
          message: "Wrong credentials",
        });
      }

      const userForToken = { username: user.username, id: user._id };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET);

      return { value: token };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }

      await Author.deleteMany({});

      await Book.deleteMany({});

      await User.deleteMany({});

      return true;
    },
  },
};

module.exports = resolvers;
