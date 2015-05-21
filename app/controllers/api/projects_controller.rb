class Api::ProjectsController < Api::ApplicationController

  def index
    render json: Project.all
  end
end