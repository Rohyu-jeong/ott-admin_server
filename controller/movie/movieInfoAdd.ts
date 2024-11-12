import path from "path";
import fs from "fs";
import multer from "multer";
import { Request, Response } from "express";
import { pool } from "../../db";
import {
  movieInsertQurey,
  movieGenreInsertQurey,
  newMovieDirectorInsertQurey,
  movieDirectorInsertQurey,
  newMovieProductionInsertQurey,
  movieProductionInsertQurey,
  movieCategoryInsertQurey,
} from "../../query/movie/insert_query";
import { moviePosterImageUpdateQurey } from "../../query/movie/update_query";

// Multer 설정
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    console.log("Request body:", req.body);
    // 파일 저장 경로 설정
    const genre = req.body.genre;
    console.log("장르:", genre);
    // 관리자 서버 루트 디렉토리 - post 폴더에 이미지 파일 저장
    const destPath = path.resolve(__dirname, "../../../admin-server/post");

    // 외부 경로 지정 - 실패
    // const destPath = path.join(
    //   __dirname,
    //   `/var/www/html/ott/public/image/post/${genre}/`
    // );

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
      console.log(`경로 생성: ${destPath}`);
    }
    // 이미지를 ott에 저장
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    // 파일 이름
    console.log(`파일 이름: ${file.originalname}`);
    cb(null, file.originalname);
  },
});

// Multer 미들웨어 생성
const upload = multer({ storage });

// 파일 업로드 미들웨어를 설정
export const uploadMiddleware = upload.single("file");

export const movieInfoAdd = async (req: Request, res: Response) => {
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
  } = JSON.parse(req.body.addData);

  const file = req.file;
  console.log(file);

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 영화 추가
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
    await Promise.all(
      genre_names.map(async (genre: string) => {
        await connection.query(movieGenreInsertQurey, [movie_id, genre]);
      })
    );

    // 감독 추가
    await Promise.all(
      director_names.map(async (director: string) => {
        await connection.query(newMovieDirectorInsertQurey, [
          director,
          director,
        ]);
        await connection.query(movieDirectorInsertQurey, [movie_id, director]);
      })
    );

    // 제작사 추가
    await Promise.all(
      production_company_names.map(async (productionCompany: string) => {
        await connection.query(newMovieProductionInsertQurey, [
          productionCompany,
          productionCompany,
        ]);
        await connection.query(movieProductionInsertQurey, [
          movie_id,
          productionCompany,
        ]);
      })
    );

    // 카테고리 추가
    await connection.query(movieCategoryInsertQurey, [
      movie_id,
      category_names,
    ]);

    // 파일 경로 생성
    const genre = req.body.genre;
    const filePath = `/images/post/${genre}/${file.originalname}`;

    // 영화 테이블의 poster_img 경로 업데이트
    await connection.query(moviePosterImageUpdateQurey, [filePath, movie_id]);

    await connection.commit();
    res.status(201).json({
      message: "영화와 이미지가 성공적으로 추가되었습니다.",
      filePath,
    });
  } catch (error) {
    await connection.rollback();
    console.error("영화 추가에 실패했습니다:", error);
    res.status(500).json({ message: "영화 추가에 실패했습니다." });
  } finally {
    connection.release();
  }
};
