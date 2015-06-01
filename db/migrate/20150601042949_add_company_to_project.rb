class AddCompanyToProject < ActiveRecord::Migration
  def change
    add_reference :projects, :company, index: true
    add_foreign_key :projects, :companies
  end
end
