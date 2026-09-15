import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { filterBooks } from "../utils/books";
import BookList from "./BookList";
import FilterByGenre from "./FilterByGenre";

const Books = () => {
  const [genre, setGenre] = useState("all genres");
  const result = useQuery(ALL_BOOKS);

  if (result.loading) return <div>loading...</div>;

  const books = result.data.allBooks;
  const filteredBooks = filterBooks(genre, books);

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <b>{genre}</b>
      </div>
      <BookList books={filteredBooks} />
      <FilterByGenre books={books} setGenre={setGenre} />
    </div>
  );
};

export default Books;
