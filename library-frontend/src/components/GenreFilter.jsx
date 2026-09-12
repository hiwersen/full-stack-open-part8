const FilterByGenre = ({ books, setFilter }) => {
  const genres = [
    ...new Set(books.reduce((genres, b) => [...genres, ...b.genres], [])),
  ];

  return (
    <div>
      {genres.map((g) => (
        <button key={g} onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
      <button key={"all genres"} onClick={() => setFilter("all genres")}>
        all genres
      </button>
    </div>
  );
};

export default FilterByGenre;
