class WelcomeController < ApplicationController
    #skip_before_filter :verify_authenticity_token
    def scratchpad
        scratchpad = Scratchpad.find_by(id: params[:scratchpad_id])
        if user_signed_in?
            if scratchpad != nil
                render layout: 'general_layout', locals: {scratchpad_id:  scratchpad.id, 
                                                          title:          scratchpad.title,
                                                          owner:          scratchpad.owner_id,
                                                          isPublic:       scratchpad.public,
                                                          scratch_data:   scratchpad.data,
                                                          shared_users:   scratchpad.sharedto_id,
                                                          creation_date:  scratchpad.created_at
                                                          }
            else
                redirect_to '/'
            end
        else
            redirect_to '/'
        end
    end

    def index
        render layout: 'general_layout'
    end

    def create_scratchpad
        if user_signed_in?
            new_scratchpad = Scratchpad.create(title: "",
                                               owner_id: current_user.id,
                                               public: false,
                                               data: "",
                                               created_at: DateTime.current)
            redirect_to '/scratchpad/'+new_scratchpad.id.to_s
        else
            redirect_to '/users/sign_up'
        end
    end

    def dashboard
        render layout: 'general_layout', locals: {records: Scratchpad.where(owner_id: current_user.id)}
    end

    def usertest1
        render layout: 'general_layout'
    end

    def home
        render layout: 'general_layout'
    end

    def help
        render layout: 'general_layout'
    end

    def about
        render layout: 'general_layout'
    end

    def contact
        render layout: 'general_layout'
    end

    def save_scratchpad_data
        if user_signed_in?
            #title = 
            #isPublic = 
            #scratch_data = 
            #shared_users = params[:shared_users]
            #date = DateTime.current
        
            scratchpad_id = params[:id]
            scratchpad = Scratchpad.find_by(id: scratchpad_id)
            if scratchpad != nil
                scratchpad.update(title:  params[:title],
                                  public: params[:isPublic],
                                  data:   params[:equations],
                                  #sharedto_id:   scratchpad.sharedto_id,
                                  #creation_date:  scratchpad.created_at
                                 )
                render :text => "Save successful!", :layout => false
            else
                render :text => "Save failed; Could not find database record for "+scratchpad_id.to_s, :layout => false
            end
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