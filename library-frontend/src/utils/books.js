export const getGenres = (books) => {
  return [
    ...new Set(books.reduce((genres, b) => [...genres, ...b.genres], [])),
  ];
};
