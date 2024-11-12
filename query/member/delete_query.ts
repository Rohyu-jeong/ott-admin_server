// 회원 위시리스트 삭제
export const memberWishlistDeleteQuery = `DELETE FROM Wishlist WHERE member_id = ?;`;

// 멤버 전체 위시리스트 삭제
export const memberprofilesByMemberWishlistDeleteQuery = `DELETE FROM Wishlist WHERE member_profile_id IN (SELECT id FROM MemberProfile WHERE member_id = ?);`;

// 결제 정보 삭제
export const memberPaymentDeleteQuery = `DELETE FROM Payment WHERE member_id = ?;`;

// member id에 등록된 memberprofile 전체 삭제
export const memberprofilesByMemberDeleteQuery = `DELETE FROM MemberProfile WHERE member_id = ?;`;

// 회원 삭제
export const memberDeleteQuery = ` DELETE FROM Member WHERE id = ?;`;
