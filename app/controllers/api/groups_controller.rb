class Api::GroupsController < Api::ApplicationController
  def index
    render json: Group.all
  end

  def show
    render json: Group.find(params[:id])
  end

  def create
    group = Group.new(group_params)
    if group.valid?
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    group = Group.find(params[:id])
    if group.update(group_params)
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def group_params
    params.require(:group).permit(:name)
  end
end
