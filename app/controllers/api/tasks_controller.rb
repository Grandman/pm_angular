class Api::TasksController < Api::ApplicationController
  def show
    render json: Task.find(params[:id])
  end

  def index
    render json: Task.all
  end

  def create
    @task = Task.new(task_params)
    if @task.valid?
      render json: 'ok', status: 200
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
    params.require(:task).permit(:title, :description, :project)
  end
end
