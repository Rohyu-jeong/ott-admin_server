import { Request, Response } from "express";
import { pool } from "../../db";
import { memberAllQuery } from "../../query/member/select_query";

export const memberAllGets = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    // 쿼리 실행
    const [rows]: [any[], any] = await connection.query(memberAllQuery);

    if (rows.length === 0) {
      res.status(404).json({ message: "등록된 회원이 없습니다." });
    } else {
      // 결과 응답
      res.status(200).json(rows);
    }
  } catch (error) {
    console.error("회원 프로필을 불러오는 데 실패했습니다:", error);
    res.status(500).json({ error: "회원 프로필을 불러오는 데 실패했습니다." });
  } finally {
    connection.release();
  }
};
