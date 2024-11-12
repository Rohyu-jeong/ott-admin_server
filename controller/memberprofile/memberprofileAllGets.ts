import { Request, Response } from "express";
import { pool } from "../../db";
import { memberprofileAllQuery } from "../../query/memberprofile/select_query";

export const memberprofileGets = async (req: Request, res: Response) => {
  const connection = await pool.getConnection();

  try {
    const [rows]: [any[], any] = await connection.query(memberprofileAllQuery);

    if (rows.length === 0) {
      res.status(404).json({ message: "해당 회원을 찾을 수 없습니다." });
    } else {
      res.status(200).json(rows);
    }
  } catch (error) {
    console.error("회원 프로필을 불러오는 데 실패했습니다:", error);
    res.status(500).json({ error: "회원 프로필을 불러오는 데 실패했습니다." });
  } finally {
    connection.release();
  }
};
