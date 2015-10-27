class UseronlyController < ApplicationController
    before_action :authenticate_user! #This makes users sign in for any age they're trying 
                                      # to access under this controller
    def usertest
    end
end
