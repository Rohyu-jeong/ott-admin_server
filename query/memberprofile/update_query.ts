// memberprofile에 등록된 회원 정보 수정
export const memberprofilePasswordUpdateQuery = `
  UPDATE MemberProfile 
  SET member_name = ?, member_email = ?, member_password = ?
  WHERE id = ?;
`;