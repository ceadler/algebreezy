class WelcomeController < ApplicationController
    #skip_before_filter :verify_authenticity_token
    def index
        scratchpad = Scratchpad.find_by(id: 1)
        if scratchpad != nil
            render layout: 'general_layout', locals: {scratchpad_id:  scratchpad.id, 
                                                      title:          scratchpad.title,
                                                      owner:          scratchpad.owner,
                                                      isPublic:       scratchpad.public,
                                                      scratch_data:   scratchpad.data,
                                                      shared_users:   scratchpad.shared_to,
                                                      creation_date:  scratchpad.created_at
                                                      }
        else
            render layout: 'general_layout', locals: {scratchpad_id:  1}
        end
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
        if user_signed_in?
            scratchpad_id = params[:scratchpad_id]
            title = params[:title]
            owner = current_user.id
            isPublic = params[:isPublic]
            scratch_data = params[:equations]
            shared_users = params[:shared_users]
            date = DateTime.current
        
        
            scratchpad = Scratchpad.find_by(id: scratchpad_id)
            
            
            render :text => "Got data!" + title + isPublic + scratch_data + shared_users, :layout => false
        else
            render :nothing => true
        end
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