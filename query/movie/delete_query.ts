// movie 정보 삭제
// 장르
export const movieGenreDeleteQurey = `DELETE FROM MovieGenre WHERE movie_id = ?;`;

// 영화감독
export const movieDirectorDeleteQurey = `DELETE FROM MovieDirector WHERE movie_id = ?;`;

// 제작사
export const movieProductionDeleteQurey = `DELETE FROM MovieProduction WHERE movie_id = ?;`;

// 영화카테고리
export const movieCategoryDeleteQurey = `DELETE FROM MovieCategory WHERE movie_id = ?;`;

// 찜목록에 등록된 영화
export const movieWishlistDeleteQurey = `DELETE FROM Wishlist WHERE movie_id = ?;`;

// 영화 정보 삭제
export const movieDeleteQurey = `DELETE FROM Movie WHERE id = ?;`;
