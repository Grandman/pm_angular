class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :second_name
      t.string :login
      t.string :email
      t.string :password
      t.references :group

      t.timestamps null: false
    end
    add_foreign_key :users, :groups
  end
end
