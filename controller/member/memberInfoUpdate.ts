import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../../db";
import { memberPasswordUpdateQuery } from "../../query/member/update_query";

// 정보 변경 컨트롤러
export const memberInfoUpdate = async (req: Request, res: Response) => {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email || !password) {
    res.status(400).json({ error: "모든 항목이 필수 항목입니다." });
    return;
  }
  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 모든 정보 업데이트
      await connection.query(memberPasswordUpdateQuery, [
        name,
        email,
        hashedPassword,
        id,
      ]);

      await connection.commit();
      res
        .status(200)
        .json({ message: "회원 정보가 성공적으로 업데이트되었습니다." });
    } catch (error) {
      await connection.rollback();
      console.error("회원 정보 업데이트에 실패했습니다:", error);
      res.status(500).json({ message: "회원 정보 업데이트에 실패했습니다." });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("비밀번호 암호화에 실패했습니다:", error);
    res.status(500).json({ message: "비밀번호 암호화에 실패했습니다." });
  }
};
