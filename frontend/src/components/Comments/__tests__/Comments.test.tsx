import { act, fireEvent, render, waitFor, within } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
// eslint-disable-next-line
// @ts-ignore
import { CommentStore } from '../../../stores/Comment/CommentStore';
import { Comments as CommentsView } from '../Comments';

const json = (value: Record<string, any> | Array<any>): Promise<string> => 
  Promise.resolve(JSON.stringify(value));

describe('Comments', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should render correctly without comments', async () => {
    fetchMock.mockResponseOnce(() => json([]));

    const { getByPlaceholderText } = render(<CommentsView commentStore={CommentStore.create({})} />);

    await waitFor(() => getByPlaceholderText('Add a comment'));
  });

  it('should render correctly with comments', async () => {
    fetchMock.mockResponseOnce(() => json([
      {
        id: 1,
        text: 'Comment 1',
        is_resolved: false,
        resolved_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        text: 'Comment 2',
        is_resolved: false,
        resolved_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ]));

    const { getByText } = render(<CommentsView commentStore={CommentStore.create({})} />);

    await waitFor(() => getByText('Comment 1'));
    getByText('Comment 2');
  });

  it('should render correctly with resolved comments', async () => {
    fetchMock.mockResponseOnce(() => json([
      {
        id: 1,
        text: 'Comment 1',
        is_resolved: true,
        resolved_at: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        text: 'Comment 2',
        is_resolved: false,
        resolved_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ]));

    const { getByTestId } = render(<CommentsView commentStore={CommentStore.create({})} />);

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-resolved'));
    within(getByTestId('comment:2')).getByTestId('comment-unresolved');
  });

  it('should add a comment', async () => {
    fetchMock.mockResponse((req): any => {
      if (req.url.includes('/api/comments/')) {
        if (req.method === 'POST') {
          return json({
            id: 1,
            text: 'Comment 1',
            is_resolved: false,
            resolved_at: null,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          });
        }

        if (req.method === 'GET') {
          return json([{
            id: 1,
            text: 'Comment 1',
            is_resolved: false,
            resolved_at: null,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          }]);
        }
      }
    });

    const { getByText, getByLabelText, getByTestId, getByPlaceholderText } = render(<CommentsView commentStore={CommentStore.create({})} />);

    const input = getByPlaceholderText('Add a comment');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Comment 1' } });
      fireEvent.click(getByLabelText('Add'));
    });

    await waitFor(() => {
      getByText('Comment 1');
      within(getByTestId('comment:1')).getByTestId('comment-unresolved');
      within(getByTestId('comment:1')).getByTestId('comment-persisted');
    });
  });

  it('should correctly resolve/unresolve a comment', async () => {
    fetchMock.mockResponse((req): any => {
      if (req.url.includes('/api/comments/')) {
        if (req.method === 'PATCH') {
          return json({
            id: 1,
            text: 'Comment 1',
            is_resolved: false,
            resolved_at: null,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          });
        }

        if (req.method === 'GET') {
          return json([{
            id: 1,
            text: 'Comment 1',
            is_resolved: false,
            resolved_at: null,
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z',
          }]);
        }
      }
    });

    const { getByTestId, getByText } = render(<CommentsView commentStore={CommentStore.create({})} />);

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-unresolved'));

    const menu = within(getByTestId('comment:1')).getByTestId('comment-menu');

    await act(async () => {
      fireEvent.click(menu);
      fireEvent.click(getByText('Resolve'));
    });

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-resolved'));

    await act(async () => {
      fireEvent.click(menu);
      fireEvent.click(getByText('Unresolve'));
    });

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-unresolved'));
  });

  it.skip('should update a comment', async () => {
    // TODO: implement this test
  });

  it.skip('should delete a comment', async () => {
    // TODO: implement this test
  });
});
