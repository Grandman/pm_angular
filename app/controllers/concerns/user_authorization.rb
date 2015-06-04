module UserAuthorization
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!
    helper_method :current_user, :signed_in?, :signed_out?
  end

  def sign_out
    cookies.delete :user
  end

  def set_user(user, persistent)
    cookies_params = { value: user.id }
    cookies_params.merge! expires: 1.year.from_now if persistent
    cookies[:user] = cookies_params
  end

  def get_user
    return if cookies[:user].blank?
    id = cookies[:user]
    User.find_by_id id
  end

  def current_user
    get_user
  end

  def signed_in?
    current_user.present?
  end

  def signed_out?
    !signed_in?
  end

  def authenticate_user!
    return if signed_in?
    redirect_to "#/login"
  end
end