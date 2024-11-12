// movie 정보 변경
export const movieInfoUpdateQurey = `
    UPDATE MOVIE SET id = ?, title = ?, age_rating = ?, runtime = ?, rating = ?, teaser_url = ?, plot_summary = ?, release_date = ? WHERE id = ?; 
`;

// movie poster image 경로 추가
export const moviePosterImageUpdateQurey = `UPDATE Movie SET poster_img = ? WHERE id = ?;`;
