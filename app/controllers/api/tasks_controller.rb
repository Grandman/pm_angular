class Api::TasksController < Api::ApplicationController
  skip_before_action :authenticate_user!
  def show
    render json: Task.find(params[:id]).to_json(methods: [:subtasks, :users, :children_count])
  end

  def index
    render json: Task.where(project_id: params[:project_id]).roots.to_json(methods: [:subtasks, :children_count], include: :comments )
  end

  def create
    if params[:task][:parent]
      @task = Task.find(params[:task][:parent]).children.create(task_params)
    else
      @task = Project.find(params[:project_id]).tasks.create(task_params)
    end
    if @task.valid?
      if params[:task][:user_id]
        all_plan_hours = @task.project.plan_hours
        all_plan_hours = 0 if all_plan_hours.nil?
        all_plan_cost = @task.project.plan_cost
        all_plan_cost = 0 if all_plan_cost.nil?

        @task.users << User.find(params[:task][:user_id])
        user_per_hour = @task.users.first.cost_per_hour
        @task.project.update(plan_hours: all_plan_hours+@task.plan_hours, plan_cost: all_plan_hours+(@task.plan_hours*user_per_hour))
      end
      render json: @task, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    task = Task.find(params[:id])
    if task.update(task_params)
      if params[:task][:finished]
        task_count = task.users.first.finished_task_count
        task.users.first.update(finished_task_count: task_count+1)
        all_actual_hours = task.project.actual_hours
        all_actual_hours = 0 if all_actual_hours.nil?
        all_actual_cost = task.project.actual_cost
        all_actual_cost = 0 if all_actual_cost.nil?
        user_per_hour = task.users.first.cost_per_hour
        task.project.update(actual_hours: all_actual_hours+task.actual_hours, actual_cost: all_actual_cost+(task.actual_hours*user_per_hour))
      end
      render json: task, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def task_params
    params.require(:task).permit(:title, :description, :project_id, :plan_hours, :actual_hours, :finished)
  end
end
