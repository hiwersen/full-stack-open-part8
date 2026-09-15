import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import BookList from "./BookList";
import GenreFilter from "./GenreFilter";

const Books = () => {
  const [genre, setGenre] = useState(null);
  const result = useQuery(ALL_BOOKS, { variables: { genre } });

  if (result.loading) return <div>loading...</div>;

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <b>{genre}</b>
      </div>
      <BookList books={books} />
      <GenreFilter setGenre={setGenre} />
    </div>
  );
};

export default Books;
