import { useQuery } from "@apollo/client/react";
import { getGenres } from "../utils/books";
import { ALL_GENRES } from "../queries";

const GenreFilter = ({ setGenre }) => {
  const result = useQuery(ALL_GENRES);

  if (result.loading) return <div>loading...</div>;

  const genres = getGenres(result.data.allBooks);

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

export default GenreFilter;
