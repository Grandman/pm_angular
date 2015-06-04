FactoryGirl.define do
  factory :project do
    title { generate :string }
    description { generate :string }
    company_id 1
  end
end