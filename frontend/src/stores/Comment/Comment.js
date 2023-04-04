import { flow, types } from 'mobx-state-tree';
import Utils from '../../utils';
import { camelizeKeys } from '../../utils/utilities';
import { UserExtended } from '../UserStore';

export const Comment = types.model('Comment', {
  id: types.identifierNumber,
  text: types.string,
  createdAt: types.optional(types.string, Utils.UDate.currentISODate()),
  updatedAt: types.optional(types.string, Utils.UDate.currentISODate()),
  resolvedAt: types.optional(types.maybeNull(types.string), null),
  // createdBy: types.optional(types.maybeNull(types.safeReference(UserExtended)), null),
  isResolved: false,
  isEditMode: types.optional(types.boolean, false),
  isDeleted: types.optional(types.boolean, false),
  isConfirmDelete: types.optional(types.boolean, false),
})
  .volatile(() => ({
    createdBy: null,
  }))
  .preProcessSnapshot((sn) => {
    const result = camelizeKeys(sn ?? {});

    // NOTE: This is just for testing purposes, in realworld you would have created_by
    // implemented and referenced from the comment model
    if (!result.createdBy) {
      result.createdBy = UserExtended.create(window.APP_SETTINGS.user);
    }
    return result;
  })
  .views(self => ({
    get isPersisted() {
      return self.id > 0;
    },
  }))
  .actions(self => {
    function setEditMode(newMode) {
      self.isEditMode = newMode;
    }

    function setDeleted(newMode) {
      self.isDeleted = newMode;
    }

    function setConfirmMode(newMode) {
      self.isConfirmDelete = newMode;
    }

    /**
     * Resolves the comment.
     *
     * @note This uses `yield` instead of `await` because this is a generator function.
     */
    const toggleResolve = flow(function* () {
      if (!self.isPersisted || self.isDeleted) return;

      self.isResolved = !self.isResolved;

      try {
        // TODO: implement API call for comments update
        // PATCH: /api/comments/:id
        // body: { is_resolved: self.isResolved }

      } catch (err) {
        self.isResolved = !self.isResolved;
        throw err;
      }
    });

    /**
     * Updates the comment text.
     *
     * @note This uses `yield` instead of `await` because this is a generator function.
     * @param {string} comment 
     */
    const updateComment = flow(function* (comment) {
      if (self.isPersisted && !self.isDeleted) {
        // TODO: implement API call for comments update
        // PATCH: /api/comments/:id
        // body: { text: comment }
      }

      self.setEditMode(false);
    });

    /**
     * Deletes the comment.
     *
     * @note This uses `yield` instead of `await` because this is a generator function.
     * @param {string} comment 
     */
    const deleteComment = flow(function* () {
      if (self.isPersisted && !self.isDeleted && self.isConfirmDelete) {
        // TODO: implement API call for comments delete
        // DELETE: /api/comments/:id
      }

      self.setDeleted(true);
      self.setConfirmMode(false);
    });

    return {
      toggleResolve,
      setEditMode,
      setDeleted,
      setConfirmMode,
      updateComment,
      deleteComment,
    };
  });
