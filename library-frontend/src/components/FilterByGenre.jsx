import { getGenres } from "../utils/books";

const FilterByGenre = ({ books, setGenre }) => {
  const genres = getGenres(books);

  return (
    <div>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button key={"all genres"} onClick={() => setGenre("all genres")}>
        all genres
      </button>
    </div>
  );
};

export default FilterByGenre;
