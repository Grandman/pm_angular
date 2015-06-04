class Api::GroupsController < Api::ApplicationController
  skip_before_action :authenticate_user!
  def index
    render json: Group.where(company_id: params[:company_id]).to_json(include: :users)
  end

  def show
    render json: Group.find(params[:id]).to_json(include: :company)
  end

  def create
    group = Company.find(params[:group][:company_id]).groups.create(group_params)
    if group.valid?
      render json: group, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    group = Group.find(params[:id])
    if group.update(group_params)
      render json: group, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def destroy
    group = Group.find(params[:id])
    if group.destroy
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def group_params
    params.require(:group).permit(:name, :cost_per_hour, :company_id)
  end
end
