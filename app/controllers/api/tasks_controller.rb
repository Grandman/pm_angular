class Api::TasksController < Api::ApplicationController
  def show
    render json: Task.find(params[:id])
  end

  def index
    render json: Project.find(params[:project_id]).tasks
  end

  def create
    @task = Project.find(params[:project_id]).tasks.create(task_params)
    if @task.valid?
      render json: @task, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    task = Task.find(params[:id])
    if task.update(task_params)
      render json: task, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def task_params
    params.require(:task).permit(:title, :description, :project_id)
  end
end
