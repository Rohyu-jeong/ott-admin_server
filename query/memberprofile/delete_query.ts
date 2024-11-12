// 멤버 삭제
export const memberprofileDeleteQuery = `DELETE FROM MemberProfile WHERE id = ?;`;

// 위시리스트 삭제
export const memberprofileWishlistDeleteQuery = `DELETE FROM Wishlist WHERE member_profile_id = ?;`;
