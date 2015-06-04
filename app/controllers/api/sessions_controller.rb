class Api::SessionsController < Api::ApplicationController
  skip_before_action :authenticate_user!

  def create
    user = User.find_by(email: params[:email], password: params[:password])
    if user
      set_user(user,false)
      render json: user, status: 200
    else
      render json: {errors: "Нет такого пользователя"}, status: 402
    end

  end
  # rubocop:enable all
end