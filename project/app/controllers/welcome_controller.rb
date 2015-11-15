class WelcomeController < ApplicationController
    #skip_before_filter :verify_authenticity_token
    def index
        render layout: 'general_layout'
    end

    def about
        render layout: 'general_layout'
    end

    def contact
        render layout: 'general_layout'
    end
    
    def help
        render layout: 'general_layout'
    end
  
    def login
        render layout: 'general_layout'
    end
  
    def logout
        render layout: 'general_layout'
    end
  
    def profile
        render layout: 'general_layout'
    end
    
    def register
        render layout: 'general_layout'
    end
  
    def team
        render layout: 'general_layout'
    end
  
    def tutorial
        render layout: 'general_layout'
    end

end
   

