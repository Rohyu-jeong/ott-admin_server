// 멤버 추가
export const memberInsertQuery = `INSERT INTO Member (name, email, password, membership_id) VALUES (?, ?, ?, ?);`;

// 결제 정보 추가
export const paymentInsertQuery = `INSERT INTO Payment (member_id, card_number, expiry_date, payment_date, card_name, amount) VALUES (?, ?, ?, ?, ?, ?);`;