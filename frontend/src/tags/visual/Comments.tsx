import React, { FC } from 'react';
import { Instance, types } from 'mobx-state-tree';
import { observer } from 'mobx-react';

import Registry from '../../core/Registry';
import { guidGenerator } from '../../utils/unique';
// eslint-disable-next-line
// @ts-ignore
import { CommentStore } from '../../stores/Comment/CommentStore';

/**
 * The `Comments` tag is used to show inline comments on the labeling interface.
 * @example
 * <View>
 *   <Text name="text-1" />
 *   <Comments for="text-1" collapsed="true"  />
 * </View>
 * @name Comments
 * @meta_title Comments Tag to Show Comments within Label Studio editor stage
 * @meta_description Customize Label Studio with the Comments tag to display inline comments for a labeling task for machine learning and data science projects.
 */
const CommentsModel = types.compose('CommentsModel', CommentStore, types.model({
  id: types.optional(types.identifier, guidGenerator),
  type: 'comments',
  collapsed: types.optional(types.boolean, false),
  for: types.maybeNull(types.string),
}).views(self => ({
  get tagRef() {
    // eslint-disable-next-line
    // @ts-ignore
    if (!self.for || self.annotation) return null;
    // eslint-disable-next-line
    // @ts-ignore
    return self.annotation.names.get(self.for);
  },
})));

type CommentsItem = Instance<typeof CommentsModel>;

const CommentsView: FC<{ item: CommentsItem }> = observer(({ item }) => {
  console.log('CommentsView', item);
  // TODO: implement comments
  return (
    <div>
      <b>TODO: Comments will go here</b>
      <p> Refactor from frontend/src/components/Comments/Comments.tsx</p>
    </div>
  );
});

Registry.addTag('comments', CommentsModel, CommentsView);

export { CommentsView, CommentsModel };
