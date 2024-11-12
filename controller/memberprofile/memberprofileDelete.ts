import { Request, Response } from "express";
import { pool } from "../../db";
import {
  memberprofileDeleteQuery,
  memberprofileWishlistDeleteQuery,
} from "../../query/memberprofile/delete_query";

export const memberprofileDelete = async (req: Request, res: Response) => {
  const memberprofileId = parseInt(req.params.id, 10);

  if (!memberprofileId) {
    res.status(400).json({ error: "MemberProfile ID는 필수 항목입니다." });
    return;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 멤버 위시리스트 삭제
    await connection.query(memberprofileWishlistDeleteQuery, [memberprofileId]);

    // 멤버 삭제
    await connection.query(memberprofileDeleteQuery, [memberprofileId]);

    // 트랜잭션 커밋
    await connection.commit();

    res
      .status(200)
      .json({ message: "MemberProfile이 성공적으로 삭제되었습니다." });
  } catch (err) {
    // 오류 발생 시 트랜잭션 롤백
    await connection.rollback();
    console.error("MemberProfile 삭제에 실패했습니다:", err);
    res.status(500).json({ message: "MemberProfile 삭제에 실패했습니다." });
  } finally {
    connection.release(); // 커넥션 해제
  }
};
