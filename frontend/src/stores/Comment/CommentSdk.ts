export interface Comment {
  id?: number;
  is_resolved?: boolean;
  text?: string;
}
export interface ListParams {
  ordering?: '-id' | 'id';
}

export class CommentsSdk {
  constructor(private lsf: any) {
    this.bindEventHandlers();
  }

  private bindEventHandlers() {
    const bindings = {
      'comments:create': this.createComment,
      'comments:update': this.updateComment,
      'comments:delete': this.deleteComment,
      'comments:list': this.listComments,
    };

    Object.entries(bindings).forEach(([evt, binding]) => {
      this.lsf.off(evt);
      this.lsf.on(evt, binding);
    });
  }

  createComment = async (comment: Comment) => {
    const body = {
      is_resolved: comment.is_resolved,
      text: comment.text,
    };

    // TODO: Implement create functionality here
    const simulatedResponseTime = Math.random() * 1000 + 100;

    const newComment = await new Promise(resolve =>
      setTimeout(
        () => resolve({ ...body, id: Date.now() - (comment.id || -1) * -1 } as Comment),
        simulatedResponseTime,
      ),
    );
    //

    return newComment;
  };

  listComments = async (_params: ListParams) => {
    // TODO: Implement list functionality here
    const comments: Comment[] = [];
    //

    return comments;
  };

  updateComment = async (comment: Comment) => {
    if (!comment.id || comment.id < 0) return; // Don't allow an update with an incorrect id

    const body = {
      id: comment.id,
      is_resolved: comment.is_resolved,
      text: comment.text,
    };

    // TODO: Implement update functionality here
    const simulatedResponseTime = Math.random() * 1000 + 100;

    const newComment = await new Promise(resolve =>
      setTimeout(() => resolve({ ...body } as Comment), simulatedResponseTime),
    );
    //

    return newComment;
  };

  deleteComment = async (comment: Comment) => {
    if (!comment.id || comment.id < 0) return; // Don't allow an update with an incorrect id

    // TODO: Implement delete functionality here
    const simulatedResponseTime = Math.random() * 1000 + 100;

    const res = await new Promise(resolve => setTimeout(() => resolve({} as Comment), simulatedResponseTime));
    //

    return res;
  };
}
