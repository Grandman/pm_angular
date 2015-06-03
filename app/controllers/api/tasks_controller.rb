class Api::TasksController < Api::ApplicationController
  def show
    render json: Task.find(params[:id]).to_json(methods: [:subtasks, :children_count])
  end

  def index
    render json: Task.where(project_id: params[:project_id]).roots.to_json(methods: [:subtasks, :children_count])
  end

  def create
    if params[:task][:parent]
      @task = Task.find(params[:task][:parent]).children.create(task_params)
    else
      @task = Project.find(params[:project_id]).tasks.create(task_params)
    end
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
