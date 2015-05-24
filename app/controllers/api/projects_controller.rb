class Api::ProjectsController < Api::ApplicationController

  def index
    render json: Project.all
  end

  def show
    render json: Project.find(params[:id])
  end

  def create
    @project = Project.new(project_params)
    if @project.valid?
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    project = Project.find(params[:id])
    if project.update(project_params)
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end

  end

  def project_params
    params.require(:project).permit(:title, :description)
  end
end