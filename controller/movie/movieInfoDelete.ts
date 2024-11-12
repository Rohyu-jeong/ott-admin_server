import { Request, Response } from "express";
import { pool } from "../../db";
import {
  movieGenreDeleteQurey,
  movieDirectorDeleteQurey,
  movieProductionDeleteQurey,
  movieCategoryDeleteQurey,
  movieWishlistDeleteQurey,
  movieDeleteQurey,
} from "../../query/movie/delete_query";
import { moviePosterSelectQuery } from "../../query/movie/select_query";
import path from "path";
import fs from "fs";

// 영화 삭제 컨트롤러
export const movieInfoDelete = async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.id, 10);

  // 영화 ID가 없을 경우 에러 반환
  if (!movieId) {
    res.status(400).json({ error: "영화 ID는 필수 항목입니다." });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 영화의 포스터 이미지 경로를 가져옴
    const [rows]: any = await connection.query(moviePosterSelectQuery, [
      movieId,
    ]);
    const posterPath = rows?.poster_img;

    if (posterPath) {
      // 이미지 파일 삭제
      const filePath = path.join(
        __dirname,
        `/var/www/html/ott/public${posterPath}`
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 파일 삭제
        console.log(`이미지 파일 삭제: ${filePath}`);
      } else {
        console.warn(`이미지 파일을 찾을 수 없습니다: ${filePath}`);
      }
    }

    // 찜목록에서 영화 삭제
    await connection.query(movieWishlistDeleteQurey, [movieId]);

    // 각 테이블에서 영화 관련 정보 삭제
    await connection.query(movieGenreDeleteQurey, [movieId]);
    await connection.query(movieDirectorDeleteQurey, [movieId]);
    await connection.query(movieProductionDeleteQurey, [movieId]);
    await connection.query(movieCategoryDeleteQurey, [movieId]);
    await connection.query(movieDeleteQurey, [movieId]);

    await connection.commit();
    res.status(200).json({ message: "영화가 성공적으로 삭제되었습니다." });
  } catch (err) {
    await connection.rollback();
    console.error("영화 삭제에 실패했습니다:", err);
    res.status(500).json({ message: "영화 삭제에 실패했습니다." });
  } finally {
    connection.release();
  }
};
