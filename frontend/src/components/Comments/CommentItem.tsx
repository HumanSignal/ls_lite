import { observer } from 'mobx-react';
import { FC, useState } from 'react';
import { Tooltip } from 'antd';
import { IconCheck, IconEllipsis } from '../../assets/icons';
import { Space } from '../../common/Space/Space';
import { Userpic } from '../../common/Userpic/Userpic';
import { Dropdown } from '../../common/Dropdown/Dropdown';
import { Menu } from '../../common/Menu/Menu';
import { Block, Elem } from '../../utils/bem';
import { humanDateDiff, userDisplayName } from '../../utils/utilities';
import { CommentFormBase } from './CommentFormBase';

import './CommentItem.styl';
import { Button } from '../../common/Button/Button';

interface Comment {
  comment: {
    id: number,
    isEditMode: boolean,
    isConfirmDelete: boolean,
    createdAt: string,
    updatedAt: string,
    isPersisted: boolean,
    isDeleted: boolean,
    createdBy: any,
    text: string,
    isResolved: boolean,
    updateComment: (comment: string) => Promise<void>,
    deleteComment: () => Promise<void>,
    setConfirmMode: (confirmMode: boolean) => void,
    setEditMode: (isGoingIntoEditMode: boolean) => void,
    toggleResolve: () => void,
  };
  listComments: ({ suppressClearComments }: { suppressClearComments: boolean }) => Promise<void>;
}

export const CommentItem: FC<any> = observer(
  ({
    comment: {
      id,
      updatedAt,
      isEditMode,
      isConfirmDelete,
      createdAt,
      isPersisted,
      isDeleted,
      createdBy: _createdBy,
      text: initialComment,
      isResolved: resolved,
      updateComment,
      deleteComment,
      setConfirmMode,
      setEditMode,
      toggleResolve,
    },
    listComments,
  }: Comment) => {
    const currentUser = window.APP_SETTINGS?.user;
    // NOTE: this is for test purposes
    const createdBy = _createdBy ?? currentUser;

    const [currentComment, setCurrentComment] = useState(initialComment);

    if (isDeleted) return null;

    const TimeTracker = () => {
      const editedTimeAchondritic = new Date(updatedAt);
      const createdTimeAchondritic = new Date(createdAt);

      editedTimeAchondritic.setMilliseconds(0);
      createdTimeAchondritic.setMilliseconds(0);

      const isEdited = editedTimeAchondritic > createdTimeAchondritic;
      const time = isEdited ? updatedAt : createdAt;

      if (isPersisted && time)
        return (
          <Elem name="date">
            <Tooltip placement="topRight" title={new Date(time).toLocaleString()}>
              {`${isEdited ? 'updated' : ''} ${humanDateDiff(time)}`}
            </Tooltip>
          </Elem>
        );
      return null;
    };

    return (
      <Block name="comment-item" mod={{ resolved }} data-testid={`comment:${id}`}>
        <Space spread size="medium" truncated>
          <Space size="small" truncated>
            <Elem tag={Userpic} user={createdBy} name="userpic" showUsername username={createdBy}></Elem>
            <Elem name="name" tag="span">
              {userDisplayName(createdBy)}
            </Elem>
          </Space>

          <Space size="small">
            <Elem name="resolved" component={IconCheck} data-testid={resolved ? 'comment-resolved': 'comment-unresolved'} />
            <Elem name="saving" mod={{ hide: isPersisted }} data-testid={isPersisted ? 'comment-persisted': 'comment-saving'}>
              <Elem name="dot" />
            </Elem>
            <TimeTracker />
          </Space>
        </Space>

        <Elem name="content">
          <Elem name="text">
            {isEditMode ? (
              <CommentFormBase
                value={currentComment}
                onSubmit={async value => {
                  await updateComment(value);
                  setCurrentComment(value);
                  await listComments({ suppressClearComments: true });
                }}
              />
            ) : isConfirmDelete ? (
              <Elem name="confirmForm">
                <Elem name="question">Are you sure?</Elem>
                <Elem name="controls">
                  <Button onClick={() => deleteComment()} size="compact" look="danger" autoFocus>
                    Yes
                  </Button>
                  <Button onClick={() => setConfirmMode(false)} size="compact">
                    No
                  </Button>
                </Elem>
              </Elem>
            ) : (
              <>{currentComment}</>
            )}
          </Elem>

          <Elem
            name="actions"
            onClick={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {isPersisted && (
              <Dropdown.Trigger
                content={(
                  <Menu size="auto">
                    <Menu.Item onClick={toggleResolve}>{resolved ? 'Unresolve' : 'Resolve'}</Menu.Item>
                    {createdBy?.id && currentUser?.id === createdBy?.id && (
                      <>
                        <Menu.Item
                          onClick={() => {
                            const isGoingIntoEditMode = !isEditMode;

                            setEditMode(isGoingIntoEditMode);
                            if (!isGoingIntoEditMode) {
                              setCurrentComment(initialComment);
                            }
                          }}
                        >
                          {isEditMode ? 'Cancel edit' : 'Edit'}
                        </Menu.Item>
                        {!isConfirmDelete && (
                          <Menu.Item
                            onClick={() => {
                              setConfirmMode(true);
                            }}
                          >
                            Delete
                          </Menu.Item>
                        )}
                      </>
                    )}
                  </Menu>
                )}
              >
                <Button size="small" type="text" icon={<IconEllipsis />} data-testid="comment-menu" />
              </Dropdown.Trigger>
            )}
          </Elem>
        </Elem>
      </Block>
    );
  },
);
