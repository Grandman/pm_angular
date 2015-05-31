class Api::UsersController < Api::ApplicationController
  def index
    p params
    if params[:project_id]
      render json: Group.includes(users: :tasks).where( tasks: { project_id: params[:project_id]}).to_json(include: :users)
    else
      render json: Group.all.to_json(include: :users)
    end
  end

  def show
      render json: User.find(params[:id]).to_json(include: :group)
  end

  def create
    user = User.create(user_params)
    if user.valid?
      render json: user, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    user = User.find(params[:id])
    if user.update(user_params)
      render json: user, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def destroy
    user = User.find(params[:id])
    if user.destroy
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def user_params
    params.require(:user).permit(:first_name, :second_name, :login, :email, :password, :group_id, :cost_per_hour, :photo_url)
  end
end
