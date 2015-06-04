class Api::CompaniesController < Api::ApplicationController

  def index
    render json: Company.all
  end

  def show
    render json: Company.find(params[:id])
  end

  def create
    company = Company.create(company_params)
    if company.valid?
      render json: company, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def update
    company = Company.find(params[:id])
    if company.update(company_params)
      render json: company, status: 200
    else
      render json: 'fail', status: 422
    end
  end

  def company_params
    params.require(:company).permit(:name)
  end

  def destroy
    company = Company.find(params[:id])
    if company.destroy
      render json: 'ok', status: 200
    else
      render json: 'fail', status: 422
    end
  end
end
