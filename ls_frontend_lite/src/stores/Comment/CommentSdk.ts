export type Comment = any;
export interface ListParams {
  ordering?: "-id" | "id";
}

export class CommentsSdk {
  constructor(private lsf: any) {
    this.bindEventHandlers();
  }

  bindEventHandlers() {
    [
      'comments:create',
      'comments:update',
      'comments:delete',
      'comments:list',
    ].forEach((evt) => this.lsf.off(evt));

    this.lsf.on("comments:create", this.createComment);
    this.lsf.on("comments:update", this.updateComment);
    this.lsf.on("comments:delete", this.deleteComment);
    this.lsf.on("comments:list", this.listComments);
  }

  createComment = async (comment: Comment) => {

    const body = {
      is_resolved: comment.is_resolved,
      text: comment.text,
    };

    let newComment = body;

    return newComment;
  }

  updateComment = async (comment: Comment) => {
    if (!comment.id || comment.id < 0) return; // Don't allow an update with an incorrect id

    const res = {}

    return res;
  }

  listComments = async (params: ListParams) => {
    const comments: Comment[] = [];

    return comments;
  }

  deleteComment = async (comment: Comment) => {
    if (!comment.id || comment.id < 0) return; // Don't allow an update with an incorrect id

    const res =  {}

    return res;
  }
}

