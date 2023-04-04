import { flow, getSnapshot, types } from 'mobx-state-tree';
import Utils from '../../utils';
import { Comment } from './Comment';

export const CommentStore = types
  .model('CommentStore', {
    loading: types.optional(types.maybeNull(types.string), 'list'),
    comments: types.optional(types.array(Comment), []),
  })
  .volatile(() => ({
    addedCommentThisSession: false,
    commentFormSubmit: () => { },
    currentComment: '',
    inputRef: {},
    tooltipMessage: '',
  }))
  .views(self => ({
    get currentUser() {
      return {
        id: 1,
      };
    },
    get isListLoading() {
      return self.loading === 'list';
    },
    get canPersist() {
      return true;
    },
    get isCommentable() {
      return true;
    },
    get hasUnsaved() {
      return self.comments.some(comment => !comment.isPersisted);
    },
  }))
  .actions(self => {
    function setCurrentComment(comment) {
      self.currentComment = comment;
    }

    function setCommentFormSubmit(submitCallback) {
      self.commentFormSubmit = submitCallback;
    }

    function setInputRef(inputRef) {
      self.inputRef = inputRef;
    }

    function setLoading(loading = null) {
      self.loading = loading;
    }

    function setTooltipMessage(tooltipMessage) {
      self.tooltipMessage = tooltipMessage;
    }

    function replaceId(id, newComment) {
      const comments = self.comments;

      const index = comments.findIndex(comment => comment.id === id);

      if (index > -1) {
        const snapshot = getSnapshot(comments[index]);

        comments[index] = { ...snapshot, id: newComment.id || snapshot.id };
      }
    }

    function removeCommentById(id) {
      const comments = self.comments;

      const index = comments.findIndex(comment => comment.id === id);

      if (index > -1) {
        comments.splice(index, 1);
      }
    }

    /**
     * Add a comment to the store
     *
     * @note This uses `yield` instead of `await` because this is a generator function.
     * @param {string} text
     */
    const addComment = flow(function* (text) {
      if (self.loading === 'addComment') return;

      self.setLoading('addComment');

      const now = Date.now() * -1;

      const comment = {
        id: now,
        text,
        created_at: Utils.UDate.currentISODate(),
      };

      self.comments.unshift(comment);

      try {
        // TODO: Implement comment creation
        // POST: /api/comments
        // body: { text: string }
        const newComment = null;

        if (newComment) {
          self.replaceId(now, newComment);
          self.setCurrentComment('');
        }
      } catch (err) {
        self.removeCommentById(now);
        throw err;
      } finally {
        self.setLoading(null);
      }
    });

    const addCurrentComment = flow(function* () {
      if (!self.currentComment) return;

      yield addComment(self.currentComment);
    });

    function setComments(comments) {
      if (comments) {
        self.comments.replace(comments);
      }
    }

    /**
     * List comments
     *
     * @note This uses `yield` instead of `await` because this is a generator function.
     * @param {object} [mounted] - whether the component is mounted
     * @param {boolean} [suppressClearComments] - whether to stop clearing comments prior to loading
     */
    const listComments = flow((function* ({ mounted = { current: true }, suppressClearComments } = {}) {
      if (!suppressClearComments) self.setComments([]);

      try {
        if (mounted.current) {
          self.setLoading('list');
        }

        // TODO: Implement comment listing
        // GET: /api/comments
        const comments = [];

        if (mounted.current) {
          self.setComments(comments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted.current) {
          self.setLoading(null);
        }
      }
    }));

    return {
      setCommentFormSubmit,
      setInputRef,
      setLoading,
      setTooltipMessage,
      replaceId,
      removeCommentById,
      setCurrentComment,
      addCurrentComment,
      addComment,
      setComments,
      listComments,
    };
  });
