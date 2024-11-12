import { Request, Response } from "express";
import { pool } from "../../db";
import {
  memberDeleteQuery,
  memberPaymentDeleteQuery,
  memberprofilesByMemberDeleteQuery,
  memberprofilesByMemberWishlistDeleteQuery,
  memberWishlistDeleteQuery,
} from "../../query/member/delete_query";

// member 삭제 컨트롤러
export const memberDelete = async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id, 10);

  if (!memberId) {
    res.status(400).json({ error: "Member ID는 필수 항목입니다." });
    return;
  }

  const connection = await pool.getConnection();

  try {
    // 트랜잭션 시작
    await connection.beginTransaction();

    // 회원 위시리스트 삭제
    await connection.query(memberWishlistDeleteQuery, [memberId]);

    // 멤버 전체 위시리스트 삭제
    await connection.query(memberprofilesByMemberWishlistDeleteQuery, [
      memberId,
    ]);

    // 멤버 결제 정보 삭제
    await connection.query(memberPaymentDeleteQuery, [memberId]);

    // 멤버 전체 삭제
    await connection.query(memberprofilesByMemberDeleteQuery, [memberId]);

    // 회원 삭제
    await connection.query(memberDeleteQuery, [memberId]);

    // 트랜잭션 커밋
    await connection.commit();

    res.status(200).json({ message: "회원이 성공적으로 삭제되었습니다." });
  } catch (err) {
    await connection.rollback();
    console.error("회원 삭제에 실패했습니다:", err);
    res.status(500).json({ message: "회원 삭제에 실패했습니다." });
  } finally {
    connection.release();
  }
};
