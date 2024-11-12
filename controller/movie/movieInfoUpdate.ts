import { Request, Response } from "express";
import { pool } from "../../db";
import {
  movieInfoUpdateQurey,
} from "../../query/movie/update_query";
import {
  movieGenreDeleteQurey,
  movieDirectorDeleteQurey,
  movieCategoryDeleteQurey,
  movieProductionDeleteQurey,
} from "../../query/movie/delete_query";
import {
  newMovieProductionInsertQurey,
  newMovieDirectorInsertQurey,
  movieDirectorInsertQurey,
  movieGenreInsertQurey,
  movieProductionInsertQurey,
  movieCategoryInsertQurey,
} from "../../query/movie/insert_query";

export const movieInfoUpdate = async (req: Request, res: Response) => {
  const {
    movie_id,
    newId,
    movie_title,
    age_rating,
    runtime,
    movie_rating,
    teaser_url,
    plot_summary,
    release_date,
    genre_names,
    director_names,
    production_company_names,
    category_names,
  } = req.body;

  if (!movie_id || !newId) {
    res.status(400).json({ error: "영화 ID는 필수 항목입니다." });
    return;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction(); // 트랜잭션 시작

    // 외래 키로 참조되는 레코드 삭제
    await connection.query(movieCategoryDeleteQurey, [movie_id]); // 카테고리 삭제
    await connection.query(movieGenreDeleteQurey, [movie_id]); // 장르 삭제
    await connection.query(movieDirectorDeleteQurey, [movie_id]); // 감독 삭제
    await connection.query(movieProductionDeleteQurey, [movie_id]); // 제작사 삭제

    // 영화 정보 업데이트
    await connection.query(movieInfoUpdateQurey, [
      newId,
      movie_title,
      age_rating,
      runtime,
      movie_rating,
      teaser_url,
      plot_summary,
      release_date,
      movie_id,
    ]);

    // 영화 장르 변경
    if (genre_names) {
      await Promise.all(
        genre_names.map(async (genre: String) => {
          await connection.query(movieGenreInsertQurey, [newId, genre]); // 장르 재입력
        })
      );
    }

    // 영화 감독 변경
    if (director_names) {
      await Promise.all(
        director_names.map(async (director: string) => {
          await connection.query(newMovieDirectorInsertQurey, [
            director,
            director,
          ]); // 새로운 감독 추가
          await connection.query(movieDirectorInsertQurey, [newId, director]); // 감독 재입력
        })
      );
    }

    // 영화 제작사 변경
    if (production_company_names) {
      await Promise.all(
        production_company_names.map(async (productionCompany: string) => {
          await connection.query(newMovieProductionInsertQurey, [
            productionCompany,
            productionCompany,
          ]); // 새로운 제작사 추가
          await connection.query(movieProductionInsertQurey, [
            newId,
            productionCompany,
          ]); // 제작사 재입력
        })
      );
    }

    // 영화 카테고리 변경
    if (category_names) {
      await connection.query(movieCategoryInsertQurey, [newId, category_names]); // 카테고리 업데이트
    }

    await connection.commit(); // 트랜잭션 커밋
    res.status(200).json({ message: "영화가 성공적으로 업데이트되었습니다." });
  } catch (error: any) {
    await connection.rollback(); // 트랜잭션 롤백
    console.error("영화 업데이트에 실패했습니다.", error.stack);
    res.status(500).send("영화 업데이트에 실패했습니다.");
  } finally {
    connection.release();
  }
};
