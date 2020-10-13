// Solution with HOC instead useGetPhotosQuery

import { withPhotos } from '../hoc/withPhotos';
import { ListOfPhotoCardsComponent } from '../components/ListOfPhotoCards';

export const ListOfPhotoCardsWithHOC = withPhotos(ListOfPhotoCardsComponent);
