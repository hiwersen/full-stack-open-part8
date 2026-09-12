import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import FilterByGenre from "./GenreFilter";

const Books = () => {
  const [filter, setFilter] = useState("all genres");
  const result = useQuery(ALL_BOOKS);

  if (result.loading) return <div>loading...</div>;

  const books = result.data.allBooks;
  const filteredBooks =
    filter === "all genres"
      ? books
      : books.filter((b) => b.genres.includes(filter));

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <b>{filter}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <FilterByGenre books={books} setFilter={setFilter} />
    </div>
  );
};

export default Books;
