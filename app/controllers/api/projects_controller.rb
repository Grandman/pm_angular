class Api::ProjectsController < Api::ApplicationController

  def index
    render json: Project.all
  end

  def show
    render json: Project.find(params[:id])
  end

  def create
    @project = Project.new(params[:project].permit('title', 'description'))
    if @project.valid?
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end

  end
end