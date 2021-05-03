import { FunctionComponent } from 'react';
import AlbumFormStyle from './AlbumFormStyle';
import useAlbumForm, { AlbumFormProps } from './useAlbumForm';

/**
 * A Component is split up in 3 variables, wether these 3 variables
 * live in separate files or not is up to the developer.
 *
 * 1. The Layout (this file):
 *    This layer holds no logic, it simply determines the layout of the component and
 *    presents data and allows user events to be triggered.
 *
 * 2. The Styling (<name>Style.ts):
 *    Determines how a component looks.
 *
 * 3. The UI Logic (use<name>.ts):
 *    Determines which specific models and operations this component has access to and
 *    what happens if an operation gets called.
 */

const AlbumForm: FunctionComponent<AlbumFormProps> = (props) => {
  const { operations, models } = useAlbumForm(props);
  const {
    addPhoto, removePhotoAtIndex, saveAlbum, setTitle,
  } = operations;
  const { errorMessage, photos, title } = models;

  const renderPhoto = (photo: typeof photos[number], index: number): JSX.Element => (
    <div className="photo">
      <img src={photo.url} alt={photo.alt} />
      <button type="button" onClick={() => removePhotoAtIndex(index)}>Remove photo</button>
    </div>
  );

  return (
    <AlbumFormStyle>
      <div className="title-input">
        {errorMessage.title && <p>{errorMessage.title}</p>}
        <input
          value={title}
          placeholder="Add a title"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <label htmlFor="upload">
        Add a photo
        <input
          type="file"
          id="upload"
          onChange={(event) => event.target.files && addPhoto(event.target.files[0])}
          multiple={false}
        />
      </label>
      {errorMessage.photos && <p>{errorMessage.photos}</p>}
      <div className="photos">
        {photos.map(renderPhoto)}
      </div>
      <button type="button" onClick={saveAlbum}>Add album</button>
    </AlbumFormStyle>
  );
};

export default AlbumForm;