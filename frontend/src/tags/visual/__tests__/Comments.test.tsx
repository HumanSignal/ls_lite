import { act, fireEvent, render, waitFor, within } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import { CommentsModel, CommentsView } from '../Comments';

describe('Comments', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should render correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([
    ]));

    const { getByText } = render(<CommentsView item={CommentsModel.create({})} />);

    await waitFor(() => getByText(/^Comments$/));
  });

  it('should render correctly with comments', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([
      {
        id: 1,
        text: 'Comment 1',
        is_resolved: false,
        resolved_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: { id: 1, username: 'user1', email: 'user1@email.com', first_name: 'User', last_name: 'One', initials: 'UO' },
      },
      {
        id: 2,
        text: 'Comment 2',
        is_resolved: false,
        resolved_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: { id: 2, username: 'user2', email: 'user2@email.com', first_name: 'User', last_name: 'Two', initials: 'UT' },
      },
    ]));

    const { getByText } = render(<CommentsView item={CommentsModel.create({})} />);

    await waitFor(() => getByText('Comment 1'));
    getByText('Comment 2');
  });

  it('should render correctly with resolved comments', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([
      {
        id: 1,
        text: 'Comment 1',
        is_resolved: true,
        resolved_at: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: { id: 1, username: 'user1', email: 'user1@email.com', first_name: 'User', last_name: 'One', initials: 'UO' },
      },
      {
        id: 2,
        text: 'Comment 2',
        is_resolved: false,
        resolved_at: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: { id: 2, username: 'user2', email: 'user2@email.com', first_name: 'User', last_name: 'Two', initials: 'UT' },
      },
    ]));

    const { getByTestId } = render(<CommentsView item={CommentsModel.create({})} />);

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-resolved'));
    within(getByTestId('comment:2')).getByTestId('comment-unresolved');
  });

  it('should add a comment', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({
      id: 1,
      text: 'Comment 1',
      is_resolved: false,
      resolved_at: null,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      created_by: { id: 1, username: 'user1', email: 'user1@email.com', first_name: 'User', last_name: 'One', initials: 'UO' },
    }));

    const { getByText, getByTestId, getByPlaceholderText } = render(<CommentsView item={CommentsModel.create({})} />);

    const input = getByPlaceholderText('Add a comment');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Comment 1' } });
      fireEvent.click(getByText('Add'));
    });

    getByTestId('comment-saving');

    await waitFor(() => {
      getByText('Comment 1');
      within(getByTestId('comment:1')).getByTestId('comment-unresolved');
      within(getByTestId('comment:1')).getByTestId('comment-persisted');
    });
  });

  it('should add a comment', async () => {
    fetchMock.mockResponse((req): any => {
      if (req.url.includes('/api/comments/') && req.method === 'POST') {
        return Promise.resolve(JSON.stringify({
          id: 1,
          text: 'Comment 1',
          is_resolved: false,
          resolved_at: null,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          created_by: { id: 1, username: 'user1', email: 'user1@email.com', first_name: 'User', last_name: 'One', initials: 'UO' },
        }));
      }
    });

    const { getByText, getByTestId, getByPlaceholderText } = render(<CommentsView item={CommentsModel.create({})} />);

    const input = getByPlaceholderText('Add a comment');

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Comment 1' } });
      fireEvent.click(getByText('Add'));
    });

    getByTestId('comment-saving');

    await waitFor(() => {
      getByText('Comment 1');
      within(getByTestId('comment:1')).getByTestId('comment-unresolved');
      within(getByTestId('comment:1')).getByTestId('comment-persisted');
    });
  });

  it('should correctly resolve/unresolve a comment', async () => {
    fetchMock.mockResponse(JSON.stringify([
      {
        id: 1,
        text: 'Comment 1',
        is_resolved: true,
        resolved_at: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        created_by: { id: 1, username: 'user1', email: 'user1@email.com', first_name: 'User', last_name: 'One', initials: 'UO' },
      },
    ]));

    const { getByTestId } = render(<CommentsView item={CommentsModel.create({})} />);

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-resolved'));

    const menu = within(getByTestId('comment:1')).getByTestId('comment-menu');

    await act(async () => {
      fireEvent.click(menu);
      fireEvent.click(within(menu).getByText('Unresolve'));
    });

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-unresolved'));

    await act(async () => {
      fireEvent.click(menu);
      fireEvent.click(within(menu).getByText('Resolve'));
    });

    await waitFor(() => within(getByTestId('comment:1')).getByTestId('comment-resolved'));
  });

  it('should update a comment', async () => {
    // TODO: implement this test
  });

  it('should delete a comment', async () => {
    // TODO: implement this test
  });
});
