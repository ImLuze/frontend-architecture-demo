import { renderHook } from '@testing-library/react-hooks';
import { FunctionComponent } from 'react';
import { ApolloError, ApolloProvider } from '@apollo/client';
import { act } from 'react-dom/test-utils';
import client from '../../client';
import useAlbums, { AlbumsAPI } from './useAlbums';
import { MOCK_ALBUMS } from '../../mocks/handlers';
import { Album } from './models/album';
import * as useCreateAlbum from './models/createAlbum';
import * as useDeleteAlbum from './models/deleteAlbum';
import * as useUpdateAlbum from './models/updateAlbum';
import { CreateAlbumInput, UpdateAlbumInput } from './models/albumInput';

/**
 * This is a Unit Test for an Interaction layer hook.
 * It tests if our Interaction layer enforces the expected behavior.
 *
 * Note: The unit tests here are very excessive. Don't unit test everything. Unit Tests serve as
 * a way to document code. You should only write a Unit Test for a piece of code if:
 * 1. Your hook solves a complex issue that needs to be documented or you notice from PR reviews
 *    that someone doesn't understand what you are trying to do.
 * 2. The issue you are solving is not being covered by an integration test.
 * 3. You need help debugging something that is cumbersome to test in a real life situation.
 */

const MOCK_SUCCESSFUL_ALBUMS: AlbumsAPI = {
	data: { albums: { data: MOCK_ALBUMS } },
	loading: false,
	error: undefined,
};

const MOCK_SUCCESSFUL_ALBUM: AlbumsAPI = {
	data: { album: MOCK_ALBUMS[0] },
	loading: false,
	error: undefined,
};

const MOCK_LOADING: AlbumsAPI = {
	data: undefined,
	loading: true,
	error: undefined,
};

const MOCK_FAILED: AlbumsAPI = {
	data: undefined,
	loading: false,
	error: new ApolloError({}),
};

const EXPECTED_ALBUMS: Album[] = [
	{
		id: '0',
		title: 'title 0',
		url: '/albums/0',
		author: { id: '0', username: 'username 0' },
		photos: [
			{ id: '0', alt: 'title 0', url: '/photo/0' },
			{ id: '1', alt: 'title 1', url: '/photo/1' },
			{ id: '2', alt: 'title 2', url: '/photo/2' },
			{ id: '3', alt: 'title 3', url: '/photo/3' },
			{ id: '4', alt: 'title 4', url: '/photo/4' },
		],
	},
	{
		id: '1',
		title: 'title 1',
		url: '/albums/1',
		author: { id: '1', username: 'username 1' },
		photos: [
			{ id: '0', alt: 'title 0', url: '/photo/0' },
			{ id: '1', alt: 'title 1', url: '/photo/1' },
			{ id: '2', alt: 'title 2', url: '/photo/2' },
			{ id: '3', alt: 'title 3', url: '/photo/3' },
			{ id: '4', alt: 'title 4', url: '/photo/4' },
		],
	},
	{
		id: '2',
		title: 'title 2',
		url: '/albums/2',
		author: { id: '2', username: 'username 2' },
		photos: [
			{ id: '0', alt: 'title 0', url: '/photo/0' },
			{ id: '1', alt: 'title 1', url: '/photo/1' },
			{ id: '2', alt: 'title 2', url: '/photo/2' },
			{ id: '3', alt: 'title 3', url: '/photo/3' },
			{ id: '4', alt: 'title 4', url: '/photo/4' },
		],
	},
	{
		id: '3',
		title: 'title 3',
		url: '/albums/3',
		author: { id: '3', username: 'username 3' },
		photos: [
			{ id: '0', alt: 'title 0', url: '/photo/0' },
			{ id: '1', alt: 'title 1', url: '/photo/1' },
			{ id: '2', alt: 'title 2', url: '/photo/2' },
			{ id: '3', alt: 'title 3', url: '/photo/3' },
			{ id: '4', alt: 'title 4', url: '/photo/4' },
		],
	},
	{
		id: '4',
		title: 'title 4',
		url: '/albums/4',
		author: { id: '4', username: 'username 4' },
		photos: [
			{ id: '0', alt: 'title 0', url: '/photo/0' },
			{ id: '1', alt: 'title 1', url: '/photo/1' },
			{ id: '2', alt: 'title 2', url: '/photo/2' },
			{ id: '3', alt: 'title 3', url: '/photo/3' },
			{ id: '4', alt: 'title 4', url: '/photo/4' },
		],
	},
	{
		id: '5',
		title: 'title 5',
		url: '/albums/5',
		author: { id: '5', username: 'username 5' },
		photos: [
			{ id: '0', alt: 'title 0', url: '/photo/0' },
			{ id: '1', alt: 'title 1', url: '/photo/1' },
			{ id: '2', alt: 'title 2', url: '/photo/2' },
			{ id: '3', alt: 'title 3', url: '/photo/3' },
			{ id: '4', alt: 'title 4', url: '/photo/4' },
		],
	},
];

const wrapper: FunctionComponent = ({ children }) => (
	<ApolloProvider client={client}>
		{children}
	</ApolloProvider>
);

describe('useAlbums', () => {
	describe('has a set of models', () => {
		it('returns albums correctly mapped from the API', async () => {
			const { result, rerender } = renderHook((props: AlbumsAPI) => useAlbums(props), { wrapper });
			expect(result.current.models.albums).toStrictEqual([]);

			rerender(MOCK_LOADING);
			expect(result.current.models.albums).toStrictEqual([]);

			rerender(MOCK_SUCCESSFUL_ALBUMS);
			expect(result.current.models.albums).toStrictEqual(EXPECTED_ALBUMS);

			rerender(MOCK_SUCCESSFUL_ALBUM);
			expect(result.current.models.albums).toStrictEqual([EXPECTED_ALBUMS[0]]);

			rerender(MOCK_FAILED);
			expect(result.current.models.albums).toStrictEqual([]);
		});

		it('returns the first album correctly mapped from the API', async () => {
			const { result, rerender } = renderHook((props: AlbumsAPI) => useAlbums(props), { wrapper });
			expect(result.current.models.album).toBeUndefined();

			rerender(MOCK_LOADING);
			expect(result.current.models.album).toBeUndefined();

			rerender(MOCK_SUCCESSFUL_ALBUMS);
			expect(result.current.models.album).toStrictEqual(EXPECTED_ALBUMS[0]);

			rerender(MOCK_SUCCESSFUL_ALBUM);
			expect(result.current.models.album).toStrictEqual(EXPECTED_ALBUMS[0]);

			rerender(MOCK_FAILED);
			expect(result.current.models.album).toBeUndefined();
		});

		it('returns the albums query loading state', () => {
			const { result, rerender } = renderHook((props: AlbumsAPI) => useAlbums(props), { wrapper });
			expect(result.current.models.isLoading).toBe(false);

			rerender(MOCK_LOADING);
			expect(result.current.models.isLoading).toBe(true);

			rerender(MOCK_SUCCESSFUL_ALBUMS);
			expect(result.current.models.isLoading).toBe(false);

			rerender(MOCK_FAILED);
			expect(result.current.models.isLoading).toBe(false);
		});

		it('returns the albums query error response', () => {
			const { result, rerender } = renderHook((props: AlbumsAPI) => useAlbums(props), { wrapper });
			expect(result.current.models.error).toBeUndefined();

			rerender(MOCK_LOADING);
			expect(result.current.models.error).toBeUndefined();

			rerender(MOCK_SUCCESSFUL_ALBUMS);
			expect(result.current.models.error).toBeUndefined();

			rerender(MOCK_FAILED);
			expect(result.current.models.error).toBeDefined();
		});
	});

	describe('has a set of operations', () => {
		describe('validateTitle', () => {
			describe('validates an album title', () => {
				it('does not allow fewer than 5 character', () => {
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });

					expect(result.current.operations.validateTitle('abcd')).toStrictEqual(expect.objectContaining({ isValid: false }));
					expect(result.current.operations.validateTitle('abcde')).toStrictEqual(expect.objectContaining({ isValid: true }));
				});

				it('should include no -', () => {
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });

					expect(result.current.operations.validateTitle('abcd-')).toStrictEqual(expect.objectContaining({ isValid: false }));
					expect(result.current.operations.validateTitle('abcde')).toStrictEqual(expect.objectContaining({ isValid: true }));
				});
			});
		});

		describe('validatePhotos', () => {
			it('does not allow photos to be empty', () => {
				const PHOTOS: CreateAlbumInput['photos'] = [{ alt: 'title 0', url: '/photo/0' }];
				const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });

				expect(result.current.operations.validatePhotos([]))
					.toStrictEqual(expect.objectContaining({ isValid: false }));
				expect(result.current.operations.validatePhotos(PHOTOS))
					.toStrictEqual(expect.objectContaining({ isValid: true }));
			});
		});

		describe('createAlbum', () => {
			describe('when title is valid and has at least 1 photo', () => {
				it('calls the createAlbum mutation', () => {
					const createAlbumMutation = jest.fn();
					jest.spyOn(useCreateAlbum, 'useCreateAlbum').mockReturnValue([createAlbumMutation, {
						called: true, loading: false, data: undefined, error: undefined, client,
					}]);
					const PHOTOS: CreateAlbumInput['photos'] = [{ alt: 'new photo', url: './new-photo' }];
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
					expect(createAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.createAlbum({ title: 'abcde', photos: PHOTOS }));
					expect(createAlbumMutation).toHaveBeenCalledTimes(1);
				});

				describe('when the createAlbum mutation is successful', () => {
					it.todo('goes to the newly created album detail page');
				});

				describe('when the createAlbum mutation is unsuccessful', () => {
					it.todo('does not go to the newly created album detail page');
				});
			});

			describe('when title is invalid or has no photos', () => {
				it('does nothing', () => {
					const createAlbumMutation = jest.fn();
					jest.spyOn(useCreateAlbum, 'useCreateAlbum').mockReturnValue([createAlbumMutation, {
						called: true, loading: false, data: undefined, error: undefined, client,
					}]);
					const PHOTOS: CreateAlbumInput['photos'] = [{ alt: 'new photo', url: './new-photo' }];
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
					expect(createAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.createAlbum({ title: 'abcd', photos: PHOTOS }));
					expect(createAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.createAlbum({ title: 'abcde', photos: [] }));
					expect(createAlbumMutation).toHaveBeenCalledTimes(0);
				});
			});
		});

		describe('updateAlbum', () => {
			describe('when title is valid', () => {
				it('calls the updateAlbum mutation', () => {
					const updateAlbumMutation = jest.fn();
					jest.spyOn(useUpdateAlbum, 'useUpdateAlbum').mockReturnValue([updateAlbumMutation, {
						called: true, loading: false, data: undefined, error: undefined, client,
					}]);
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
					expect(updateAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.updateAlbum('0', { title: 'abcde' }));
					expect(updateAlbumMutation).toHaveBeenCalledTimes(1);
				});
			});

			describe('when title is invalid', () => {
				it('does nothing', () => {
					const updateAlbumMutation = jest.fn();
					jest.spyOn(useUpdateAlbum, 'useUpdateAlbum').mockReturnValue([updateAlbumMutation, {
						called: true, loading: false, data: undefined, error: undefined, client,
					}]);

					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
					expect(updateAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.updateAlbum('0', { title: 'abcd' }));
					expect(updateAlbumMutation).toHaveBeenCalledTimes(0);
				});
			});

			describe('when there is at least 1 photo', () => {
				it('calls the updateAlbum mutation', () => {
					const updateAlbumMutation = jest.fn();
					jest.spyOn(useUpdateAlbum, 'useUpdateAlbum').mockReturnValue([updateAlbumMutation, {
						called: true, loading: false, data: undefined, error: undefined, client,
					}]);
					const PHOTOS: UpdateAlbumInput['photos'] = [{ alt: 'new photo', url: './new-photo' }];
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
					expect(updateAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.updateAlbum('0', { photos: PHOTOS }));
					expect(updateAlbumMutation).toHaveBeenCalledTimes(1);
				});
			});

			describe('when the photos array is empty', () => {
				it('does nothing', () => {
					const updateAlbumMutation = jest.fn();
					jest.spyOn(useUpdateAlbum, 'useUpdateAlbum').mockReturnValue([updateAlbumMutation, {
						called: true, loading: false, data: undefined, error: undefined, client,
					}]);
					const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
					expect(updateAlbumMutation).toHaveBeenCalledTimes(0);

					act(() => result.current.operations.updateAlbum('0', { photos: [] }));
					expect(updateAlbumMutation).toHaveBeenCalledTimes(0);
				});
			});
		});

		describe('deleteAlbum', () => {
			it('calls the deleteAlbum mutation', () => {
				const deleteAlbumMutation = jest.fn();
				jest.spyOn(useDeleteAlbum, 'useDeleteAlbum').mockReturnValue([deleteAlbumMutation, {
					called: true, loading: false, data: undefined, error: undefined, client,
				}]);
				const { result } = renderHook(() => useAlbums(MOCK_SUCCESSFUL_ALBUMS), { wrapper });
				expect(deleteAlbumMutation).toHaveBeenCalledTimes(0);

				act(() => result.current.operations.deleteAlbum('0'));
				expect(deleteAlbumMutation).toHaveBeenCalledTimes(1);
			});
		});
	});
});
