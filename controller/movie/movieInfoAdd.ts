import { Request, Response } from "express";
import pool from "../../db";
import {
  movieInsertQurey,
  movieGenreInsertQurey,
  newMovieDirectorInsertQurey,
  movieDirectorInsertQurey,
  newMovieProductionInsertQurey,
  movieProductionInsertQurey,
  movieCategoryInsertQurey,
} from "../../query/movie/insert_query";

export const movieInfoAdd = async (req: Request, res: Response) => {
  console.log("Received request body:", req.body);

  const {
    movie_id,
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

  // 필수 필드 검증
  if (
    !movie_id ||
    !movie_title ||
    !age_rating ||
    !runtime ||
    !movie_rating ||
    !teaser_url ||
    !plot_summary ||
    !release_date ||
    !genre_names ||
    !director_names ||
    !production_company_names ||
    !category_names
  ) {
    console.error("필수 필드가 누락되었습니다.");
    return res.status(400).json({ message: "필수 필드가 누락되었습니다." });
  }

  console.log("Parsed movie_id:", movie_id);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 영화 추가
    console.log("Adding movie:", movie_id, movie_title);
    await connection.query(movieInsertQurey, [
      movie_id,
      movie_title,
      age_rating,
      runtime,
      movie_rating,
      teaser_url,
      plot_summary,
      release_date,
    ]);

    // 장르 추가
    console.log("Adding genres:", genre_names);
    await Promise.all(
      genre_names.map(async (genre: string) => {
        console.log(`Adding genre ${genre} for movie_id ${movie_id}`);
        await connection.query(movieGenreInsertQurey, [movie_id, genre]);
      })
    );

    // 감독 추가
    console.log("Adding directors:", director_names);
    await Promise.all(
      director_names.map(async (director: string) => {
        console.log(`Adding director ${director} for movie_id ${movie_id}`);
        await connection.query(newMovieDirectorInsertQurey, [director, director]);
        await connection.query(movieDirectorInsertQurey, [movie_id, director]);
      })
    );

    // 제작사 추가
    console.log("Adding production companies:", production_company_names);
    await Promise.all(
      production_company_names.map(async (productionCompany: string) => {
        console.log(`Adding production company ${productionCompany} for movie_id ${movie_id}`);
        await connection.query(newMovieProductionInsertQurey, [productionCompany, productionCompany]);
        await connection.query(movieProductionInsertQurey, [movie_id, productionCompany]);
      })
    );

    // 카테고리 추가
    console.log("Adding categories:", category_names);
    await Promise.all(
      category_names.map(async (category: string) => {
        console.log(`Adding category ${category} for movie_id ${movie_id}`);
        await connection.query(movieCategoryInsertQurey, [movie_id, category]);
      })
    );

    await connection.commit();
    console.log("Transaction committed");
    res.status(201).json({
      message: "영화 정보가 성공적으로 추가되었습니다.",
    });
  } catch (error) {
    await connection.rollback();
    console.error("영화 추가에 실패했습니다:", error);
    res.status(500).json({ message: "영화 추가에 실패했습니다." });
  } finally {
    connection.release();
    console.log("Connection released");
  }
};
