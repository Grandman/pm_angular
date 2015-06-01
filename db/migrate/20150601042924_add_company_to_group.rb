class AddCompanyToGroup < ActiveRecord::Migration
  def change
    add_reference :groups, :company, index: true
    add_foreign_key :groups, :companies
  end
end
