import { useEffect, useState } from 'react';
import { Author, Album } from '../../hooks/albums/models/album';
import { UpdateAlbumInput } from '../../hooks/albums/models/albumInput';
import { ValidationResult } from '../../hooks/validator/models/ValidationResult';
import { UILogic } from '../../models/logic';

/**
 * This is the UI Logic of the component.
 * It determines which specific models and operations this component has access too and what happens
 * if an operation gets called.
 *
 * Splitting the UI Logic from the main component has the added benefit that we can write more
 * concise and clear Unit Tests. The Unit Tests are more reliable because a change in the
 * Presentation layer does not break a UI Logic test.
 *
 * In here we never refer to an Interaction layer hook. Apart from its types. It's the concern of
 * the Page Component to pass interaction layer models and operations to these components.
 */

export interface AlbumCardProps {
	// Try to keep your types as specific as possible.
	album: Pick<Album, 'id' | 'title' | 'url'>;
	author: Pick<Author, 'id' | 'username'>;
	operations: {
		updateAlbum: (albumId: Album['id'], input: UpdateAlbumInput) => void;
		validateTitle: (title: Album['title']) => ValidationResult;
	};
}

interface Models {
	// While 'string' would be correct, this is more precise.
	title: AlbumCardProps['album']['title'];
	url: AlbumCardProps['album']['url'];
	username: AlbumCardProps['author']['username'];
	isEditing: boolean;
	errorMessage?: string;
}

interface Operations {
	setIsEditing: (isEditing: Models['isEditing']) => void;
	setTitle: (title: Models['title']) => void;
}

const useAlbumCard = (props: AlbumCardProps): UILogic<Operations, Models> => {
	const { album, author, operations } = props;
	const { updateAlbum, validateTitle } = operations;

	const { url } = album;
	const { username } = author;

	const [title, setTitle] = useState<Models['title']>(album.title);
	const [isEditing, setIsEditing] = useState<Models['isEditing']>(false);
	const { isValid: isTitleValid, errorMessage } = validateTitle(title);

	// This hook might be a good example of logic that would be good to document in a Unit Test.
	useEffect(() => {
		const onEnterClick = (event: KeyboardEvent): void => {
			if (event.key === 'Enter' && isTitleValid) {
				updateAlbum(album.id, { title });
				setIsEditing(false);
			}
		};

		window.addEventListener('keydown', onEnterClick);

		return (): void => {
			window.removeEventListener('keydown', onEnterClick);
		};
	}, [title]);

	return {
		operations: { setIsEditing, setTitle },
		models: {
			title, url, username, isEditing, errorMessage,
		},
	};
};

export default useAlbumCard;
