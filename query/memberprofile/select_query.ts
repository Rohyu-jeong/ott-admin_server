// memberId가 동일한 memberprofile회원 불러오기
export const memberprofileAllQuery = `SELECT * FROM MEMBERPROFILE;`;

// membership_id 찾기
export const membershipIdSelectQuery = `SELECT m.membership_id FROM Member m WHERE m.id = ?;`;

// 등록된 memberprofile 수
export const memberprofileCountQuery = `SELECT COUNT(*) AS memberprofileCount FROM MemberProfile WHERE member_id = ?;`;
