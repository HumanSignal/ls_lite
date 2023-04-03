import { flow, getEnv, getParent, getRoot, getSnapshot, types } from 'mobx-state-tree';
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
    get store() {
      return getParent(self);
    },
    get task() {
      return getParent(self).task;
    },
    get annotation() {
      return getParent(self).annotationStore.selected;
    },
    get annotationId() {
      return isNaN(self.annotation?.pk) ? undefined : self.annotation.pk;
    },
    get draftId() {
      if (!self.annotation?.draftId) return null;
      return self.annotation.draftId;
    },
    get currentUser() {
      return getRoot(self).user;
    },
    get sdk() {
      return getEnv(self).events;
    },
    get isListLoading() {
      return self.loading === 'list';
    },
    get taskId() {
      return self.task?.id;
    },
    get canPersist() {
      return true;
    },
    get isCommentable() {
      return !self.annotation || ['annotation'].includes(self.annotation.type);
    },
    get queuedComments() {
      const queued = self.comments.filter(comment => !comment.isPersisted);

      return queued.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    get hasUnsaved() {
      return self.queuedComments.length > 0;
    },
  }))
  .actions(self => {
    function serialize({ commentsFilter, queueComments } = { commentsFilter: 'all', queueComments: false }) {

      const serializedComments = getSnapshot(commentsFilter === 'queued' ? self.queuedComments : self.comments);

      return {
        comments: queueComments ? serializedComments.map(comment => ({ id: comment.id > 0 ? comment.id * -1 : comment.id, ...comment })) : serializedComments,
      };
    }

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

    const addComment = flow(function* (text) {
      if (self.loading === 'addComment') return;

      self.setLoading('addComment');

      const now = Date.now() * -1;

      const comment = {
        id: now,
        text,
        task: self.taskId,
        created_by: self.currentUser.id,
        created_at: Utils.UDate.currentISODate(),
      };

      self.comments.unshift(comment);

      try {
        const [newComment] = yield self.sdk.invoke('comments:create', comment);

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

    const listComments = flow((function* ({ mounted = { current: true }, suppressClearComments } = {}) {

      if (!suppressClearComments) self.setComments([]);
      if (!self.draftId && !self.annotationId) return;

      try {
        if (mounted.current) {
          self.setLoading('list');
        }

        const annotation = self.annotationId;
        const [comments] = yield self.sdk.invoke('comments:list', {
          annotation,
          draft: self.draftId,
        });

        if (mounted.current && annotation === self.annotationId) {
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
      serialize,
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
