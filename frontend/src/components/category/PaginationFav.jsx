import { useDispatch } from 'react-redux';
import { setFavoritePage } from '../../store/features/favoriteSlice';
import { useSelector } from "react-redux"
import { PaginationCompo } from '../PaginationCompo';

export const PaginationFav = ({ totalPage }) => {

  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.favorite.favoritePage);

  const handlePageChange = (event, value) => {
    dispatch(setFavoritePage(value - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <PaginationCompo totalPage={totalPage} currentPage={currentPage} handlePageChange={handlePageChange}/> 
  );
}

