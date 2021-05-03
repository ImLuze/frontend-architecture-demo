import { ApolloError } from '@apollo/client';
import { AppLogic } from '../../models/logic';
import {
  Maybe, Photo as PhotoDTO, Album as AlbumDTO, Query, User as UserDTO,
} from '../../models/schema';
import { Album, Author, Photo } from './models/album';
import useAlbumsOperations, { AlbumsOperations } from './useAlbumsOperations';

/**
 * This hook is the decision making layer (Interaction layer).
 * It maps API data to a set of application-specific interfaces.
 * This hook decides which domain specific models and operations the application has access to.
 *
 * This hook can be combined with `useAlbumsOperations` if both are small or easy to manage.
 */

export interface AlbumsAPI {
  data?: Maybe<Pick<Query, 'albums'>>;
  loading: boolean;
  error?: ApolloError;
}

type Operations = AlbumsOperations;

interface Models {
  albums: Album[];
  isLoading: boolean;
  error?: ApolloError;
}

const useAlbums = (albumsAPI: AlbumsAPI): AppLogic<Operations, Models> => {
  const albumsData = albumsAPI.data?.albums?.data || [];

  const userToAuthor = (user: UserDTO): Author => ({
    id: user.id || '',
    username: user.username || 'unknown',
  });

  const photoDataToPhoto = (photo: Maybe<Maybe<PhotoDTO>>): Photo => ({
    id: photo?.id || '',
    alt: photo?.title || 'no title',
    url: photo?.url || '',
  });

  const dataToAlbum = (album: Maybe<AlbumDTO>): Album => ({
    id: album?.id || '',
    title: album?.title || '',
    url: `/albums/${album?.id}`,
    author: userToAuthor(album?.user || {}),
    photos: (album?.photos?.data || []).map(photoDataToPhoto),
  });

  const albums = albumsData.map(dataToAlbum);

  return {
    operations: useAlbumsOperations(),
    models: {
      albums,
      isLoading: albumsAPI.loading,
      error: albumsAPI.error,
    },
  };
};

export default useAlbums;
