// 영화 추가
// 제목, 등급, 상영시간, 평점, 티저 url, 줄거리, 개봉일 - 포스터 이미지는 이미지 추가할 때 삽입
export const movieInsertQurey = `INSERT INTO Movie (id, title, age_rating, runtime, rating, teaser_url, plot_summary, release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

// 장르 추가
export const movieGenreInsertQurey = `INSERT INTO MovieGenre (movie_id, genre_id) VALUES (?, (SELECT id FROM Genre WHERE name = ?));`;

// 새로운 감독 추가
export const newMovieDirectorInsertQurey = `INSERT INTO Director (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM Director WHERE name = ?);`;

// 영화 - 감독
export const movieDirectorInsertQurey = `INSERT INTO MovieDirector (movie_id, director_id) VALUES (?, (SELECT id FROM Director WHERE name = ?));`;

// 새로운 제작사 추가
export const newMovieProductionInsertQurey = `INSERT INTO ProductionCompany (name) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM ProductionCompany WHERE name = ?);`;

// 영화 - 제작사
export const movieProductionInsertQurey = `INSERT INTO MovieProduction (movie_id, production_company_id) VALUES (?, (SELECT id FROM ProductionCompany WHERE name = ?));`;

// 카테고리 추가
export const movieCategoryInsertQurey = `INSERT INTO MovieCategory (movie_id, category_id) VALUES (?, (SELECT id FROM Category WHERE name = ?));`;



