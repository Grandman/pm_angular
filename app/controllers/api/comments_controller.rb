class Api::CommentsController < Api::ApplicationController
  def show
    render json: Comment.find(params[:id], include: :user).to_json(methods: [:subcomments], include: :user)
  end

  def index
    render json: Comment.where(task_id: params[:task_id]).roots.to_json(methods: [:subcomments])
  end

  def create
    if params[:comment][:parent]
      @comment = Comment.find(params[:comment][:parent]).children.create(comment_params)
    else
      @comment = Task.find(params[:task_id]).comments.create(comment_params)
    end
    if @comment.valid?
      render json: @comment, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    comment = Comment.find(params[:id])
    if comment.update(comment_params)
      render json: comment, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def comment_params
    params.require(:comment).permit(:text, :user_id, :task_id)
  end
end
