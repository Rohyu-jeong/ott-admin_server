import { Request, Response } from "express";
import { pool } from "../../db";
import { moviesAllGetQuery } from "../../query/movie/select_query";

export const movieInfoAllGets = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(moviesAllGetQuery);

    if (!Array.isArray(rows)) {
      throw new Error("Unexpected result format");
    }

    // 각 영화에 대한 이미지 경로를 생성
    const movieImages = rows.map((movie: any) => {
      // 이미지 경로를 서버의 public 폴더 기준으로 설정
      const posterUrl = `${req.protocol}://${req.get("host")}/image/post${
        movie.poster_img
      }`;
      return { ...movie, poster_img: posterUrl };
    });

    res.status(200).json(movieImages);
  } catch (error) {
    console.error("영화 목록을 가져오는 데 실패했습니다:", error);
    res.status(500).json({ message: "영화 목록을 가져오는 데 실패했습니다." });
  } finally {
    connection.release();
  }
};
