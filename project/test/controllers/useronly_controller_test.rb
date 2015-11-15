require 'test_helper'

class UseronlyControllerTest < ActionController::TestCase
  test "should get usertest" do
    get :usertest
    assert_response :success
  end

end
