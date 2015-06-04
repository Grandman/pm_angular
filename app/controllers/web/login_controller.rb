class Web::LoginController < Web::ApplicationController
  layout 'login'
  skip_before_action :authenticate_user!
  def index
  end
end
