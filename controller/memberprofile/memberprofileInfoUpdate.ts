import { Request, Response } from "express";
import { pool } from "../../db";
import { memberprofilePasswordUpdateQuery } from "../../query/memberprofile/update_query";

export const memberprofileInfoUpdate = async (req: Request, res: Response) => {
  const { id, member_id, member_name, member_email, member_password } = req.body;

  if (!member_id || !member_password || !member_name || !member_email) {
    res.status(400).json({ error: "모든 항목이 필수 항목입니다." });
    return;
  }
  const connection = await pool.getConnection();

  try {
    // 비밀번호 업데이트
    await connection.query(memberprofilePasswordUpdateQuery, [
      member_name,
      member_email,
      member_password,
      member_id,
    ]);

    res
      .status(200)
      .json({ message: "회원 정보가 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("회원 정보 업데이트에 실패했습니다:", error);
    res.status(500).json({ error: "회원 정보 업데이트에 실패했습니다." });
  } finally {
    connection.release();
  }
};
