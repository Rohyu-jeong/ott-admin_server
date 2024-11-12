import { Request, Response } from "express";
import { pool } from "../../db";
import { memberprofileInsertQuery } from "../../query/memberprofile/insert_query";
import {
  memberprofileCountQuery,
  membershipIdSelectQuery,
} from "../../query/memberprofile/select_query";

export const memberprofileAdd = async (req: Request, res: Response) => {
  const { memberId, name, email, password } = req.body;

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 멤버의 멤버십 등급 가져오기
    const [membershipResult]: any = await connection.query(
      membershipIdSelectQuery,
      [memberId]
    );
    const membershipId = membershipResult[0].membership_id;

    // 해당 멤버십 등급에 따른 최대 프로필 수 정의
    let maxProfiles;
    if (membershipId === 1 || membershipId === 2) {
      maxProfiles = 2;
    } else if (membershipId === 3) {
      maxProfiles = 4;
    } else {
      throw new Error("유효하지 않은 멤버십 등급입니다.");
    }

    // 현재 등록된 프로필 수 가져오기
    const [profileCountResult]: any = await connection.query(
      memberprofileCountQuery,
      [memberId]
    );
    const profileCount = profileCountResult[0].memberprofileCount;

    // 프로필 수가 최대치를 넘지 않았는지 확인
    if (profileCount >= maxProfiles) {
      throw new Error(
        `이 멤버십 등급에서는 최대 ${maxProfiles}개의 프로필만 등록할 수 있습니다.`
      );
    }

    // MemberProfile 추가
    await connection.query(memberprofileInsertQuery, [
      memberId,
      name,
      email,
      password,
    ]);

    await connection.commit();

    res
      .status(200)
      .json({ message: "MemberProfile이 성공적으로 추가되었습니다." });
  } catch (err) {
    await connection.rollback();
    console.error("MemberProfile 추가에 실패했습니다:", err);
    res.status(500).json({ message: "MemberProfile 추가에 실패했습니다." });
  } finally {
    if (connection) connection.release();
  }
};
