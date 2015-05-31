FactoryGirl.define do
  factory :user do
    first_name "MyString"
    second_name "MyString"
    login "MyString"
    email "MyString"
    password "MyString"
    cost_per_hour { generate :integer }
    group { create :group }
  end
end
