// member에 등록된 회원 정보 수정
export const memberPasswordUpdateQuery = `
  UPDATE Member 
  SET name = ?, email = ?, password = ?
  WHERE id = ?;
`;
