import { FunctionComponent } from 'react';
import AlbumCard from '../../../../components/albumCard/AlbumCard';
import Loader from '../../../../components/loader/Loader';
import { Album } from '../../../../hooks/albums/models/album';
import { AlbumsOperations } from '../../../../hooks/albums/useAlbumsOperations';
import AlbumsSectionStyle from './AlbumsSectionStyle';

/**
 * There are usually 2 reasons why someone would create a component:
 * 1. A piece of UI is reused on multiple occasions.
 * 2. Split up code to maintain readability/maintainability.
 *
 * This component exists for reason 2. It's a component that is only used on the AlbumsPage.
 * It's located in a `<page>/components` folder to indicate that.
 * It could in theory easily be added the main Page Component,
 * but sometimes it's more comprehensable to separate sections
 * All components in the main `/components` folder are reused on multiple pages.
 */

interface Operations {
  updateAlbum: AlbumsOperations['updateAlbum'];
  validateTitle: AlbumsOperations['validateTitle'];
}

interface Props {
  albums: Album[];
  isLoading: boolean;
  hasError: boolean;
  operations: Operations;
}

const AlbumsSection: FunctionComponent<Props> = ({
  albums, isLoading, hasError, operations,
}) => {
  const renderAlbumCard = (album: Album) => (
    <AlbumCard
      key={album.id}
      album={album}
      author={album.author}
      operations={operations}
    />
  );

  return (
    <AlbumsSectionStyle>
      <Loader isLoading={isLoading}>
        {hasError
          ? <p>Oops something went wrong!</p>
          : albums.map(renderAlbumCard)}
      </Loader>
    </AlbumsSectionStyle>
  );
};

export default AlbumsSection;