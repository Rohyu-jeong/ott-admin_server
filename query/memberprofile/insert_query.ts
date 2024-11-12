// memberprofile 추가
export const memberprofileInsertQuery = `INSERT INTO MemberProfile (member_id, member_name, member_email, member_password) VALUES (?, ?, ?, ?);`;