class Api::ProjectsController < Api::ApplicationController
  skip_before_action :authenticate_user!
  def index
    render json: Project.where(company_id: params[:company_id]).to_json(methods: [:tasks_count, :tasks_finished_count])
  end

  def show
    render json: Project.find(params[:id])
  end

  def create
    @project = Company.find(params[:project][:company_id]).projects.create(project_params)
    if @project.valid?
      render json: @project, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    project = Project.find(params[:id])
    if project.update(project_params)
      render json: project, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def project_params
    params.require(:project).permit(:title, :description, :company_id, :start_date, :end_time)
  end

  def destroy
    project = Project.find(params[:id])
    if project.destroy
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end
end
