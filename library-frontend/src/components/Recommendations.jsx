import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "../queries";
import { filterBooks } from "../utils/books";
import BookList from "./BookList";

const Recommendations = () => {
  const meResult = useQuery(ME);
  const allBooksResult = useQuery(ALL_BOOKS);

  if (meResult.loading || allBooksResult.loading) return <div>loading...</div>;

  const { favoriteGenre } = meResult.data.me;
  const books = allBooksResult.data.allBooks;

  const filteredBooks = filterBooks(favoriteGenre, books);

  return (
    <div>
      <h1>recommendations</h1>
      <div>
        books in your favorite genre <b>{favoriteGenre}</b>
      </div>
      <BookList books={filteredBooks} />
    </div>
  );
};

export default Recommendations;
