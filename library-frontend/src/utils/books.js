export const filterBooks = (filter, books) => {
  return filter === "all genres"
    ? books
    : books.filter((b) => b.genres.includes(filter));
};

export const getGenres = (books) => {
  return [
    ...new Set(books.reduce((genres, b) => [...genres, ...b.genres], [])),
  ];
};
