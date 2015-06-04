FactoryGirl.define do
  factory :group do
    name "MyString"
    cost_per_hour { generate :integer }
    company_id 1
  end
end
