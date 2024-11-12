import { Router } from "express";
import { movieInfoUpdate } from "../controller/movie/movieInfoUpdate";
import { movieInfoAllGets } from "../controller/movie/movieInfoAllGets";
import { movieInfoDelete } from "../controller/movie/movieInfoDelete";
import { memberInfoUpdate } from "../controller/member/memberInfoUpdate";
import { memberprofileInfoUpdate } from "../controller/memberprofile/memberprofileInfoUpdate";
import { memberprofileGets } from "../controller/memberprofile/memberprofileAllGets";
import { memberAllGets } from "../controller/member/memberAllGets";
import {
  movieInfoAdd,
} from "../controller/movie/movieInfoAdd";
import { memberDelete } from "../controller/member/memberDelete";
import { memberprofileDelete } from "../controller/memberprofile/memberprofileDelete";
import { memberAdd } from "../controller/member/memberAdd";
import { memberprofileAdd } from "../controller/memberprofile/memberprofileAdd";

const router = Router();
const api = "/admin";

// member 전체 가져오기
router.get(`${api}/member`, memberAllGets);

// member 추가
router.post(`${api}/member/add`, memberAdd);

// member 정보 변경
router.post(`${api}/member`, memberInfoUpdate);

// member 삭제
router.delete(`${api}/member/:id`, memberDelete);

// memberprofile 가져오기
router.get(`${api}/memberprofile`, memberprofileGets);

// memberprofile 추가
router.post(`${api}/memberprofile/add`, memberprofileAdd);

// memberprofile 정보 변경
router.post(`${api}/memberprofile`, memberprofileInfoUpdate);

// memberprofile 삭제
router.delete(`${api}/memberprofile/:id`, memberprofileDelete);

// 모든 영화 정보 가져오기
router.get(`${api}/movie`, movieInfoAllGets);

// 영화 추가하기
router.post(`${api}/movie/add`, movieInfoAdd);

// 영화 정보 업데이트
router.post(`${api}/movie`, movieInfoUpdate);

// 영화 삭제
router.delete(`${api}/movie/:id`, movieInfoDelete);

export default router;
