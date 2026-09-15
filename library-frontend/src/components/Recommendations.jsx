import { useQuery } from "@apollo/client/react";
import { ME, ALL_BOOKS } from "../queries";
import BookList from "./BookList";

const Recommendations = () => {
  const meResult = useQuery(ME);
  const favoriteGenre = meResult.data?.me?.favoriteGenre;

  const allBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  });

  if (meResult.loading || allBooksResult.loading) return <div>loading...</div>;

  const books = allBooksResult.data.allBooks;

  return (
    <div>
      <h1>recommendations</h1>
      <div>
        books in your favorite genre <b>{favoriteGenre}</b>
      </div>
      <BookList books={books} />
    </div>
  );
};

export default Recommendations;
