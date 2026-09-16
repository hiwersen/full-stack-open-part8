export const getGenres = (genres) => {
  return [
    ...new Set(genres.reduce((genres, g) => [...genres, ...g.genres], [])),
  ];
};
