class WelcomeController < ApplicationController
    #skip_before_filter :verify_authenticity_token
    def index
        render layout: 'general_layout'
    end

    def usertest1
        render layout: 'general_layout'
    end

    def home
    end

    def help
    end

    def about
    end

    def contact
    end

    def save_scratchpad_data
        instring = params[:test] + "instring_teststring"
        eqns = params[:equations]
        render :text => instring + eqns, :layout => false
    end

    def sampleget
        @potatotwo = "This is one way to pass a variable to the view. MAKE SURE IT'S DEFINED BEFORE YOU CALL RENDER"
        @allsamples = SampleModel.all
        render layout: 'general_layout'
    end

    def samplepost
        #@amalgam = params[:say] + " 'The boss' " + params[:to]
        sample = SampleModel.create(username: params[:say], message: params[:to])
        redirect_to "/samplemodel"
        #render layout: 'general_layout', locals: {potato: "This is another way to pass such a variable"}
    end
end