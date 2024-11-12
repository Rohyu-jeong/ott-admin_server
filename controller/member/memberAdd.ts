import { Request, Response } from "express";
import { pool } from "../../db";
import {
  memberInsertQuery,
  paymentInsertQuery,
} from "../../query/member/insert_query";
import bcrypt from "bcrypt";

export const memberAdd = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    cardNumber,
    expiryDate,
    paymentDate,
    cardName,
    amount,
  } = req.body;

  const determineMembershipId = (amount: number) => {
    if (amount == 5500) {
      return 1; // 광고형스탠다드(AD) 1080p
    } else if (amount == 13500) {
      return 2; // 스탠다드(Standard) 1080p
    } else if (amount == 17000) {
      return 3; // 프리미엄(Premium) 4K+HDR
    } else {
      throw new Error(
        "유효하지 않은 결제 금액입니다. 올바른 금액을 입력하세요."
      );
    }
  };

  const connection = await pool.getConnection();

  try {
    // 결제 금액에 따른 membership_id 결정
    const membershipId = determineMembershipId(amount);

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // 멤버 추가
    const [memberIdResult]: any = await connection.query(memberInsertQuery, [
      name,
      email,
      hashedPassword,
      membershipId,
    ]);
    const memberId = memberIdResult.insertId;

    await connection.query(paymentInsertQuery, [
      memberId,
      cardNumber,
      expiryDate,
      paymentDate,
      cardName,
      amount,
    ]);

    await connection.commit();

    res
      .status(200)
      .json({ message: "멤버와 결제 정보가 성공적으로 추가되었습니다." });
  } catch (err) {
    await connection.rollback();
    console.error("회원 추가에 실패했습니다:", err);
    res.status(500).json({ message: "회원 추가에 실패했습니다." });
  } finally {
    if (connection) connection.release();
  }
};
