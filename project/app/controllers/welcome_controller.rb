class WelcomeController < ApplicationController
    #skip_before_filter :verify_authenticity_token
    def scratchpad
        scratchpad = Scratchpad.find_by(id: params[:scratchpad_id])
        if user_signed_in?
            if scratchpad != nil
                render layout: 'scratchpad_layout', locals: {scratchpad_id:  scratchpad.id, 
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

    def about
        render layout: 'general_layout'
    end

    def contact
        render layout: 'general_layout'
    end
    
    def create_scratchpad
        if user_signed_in?
            new_scratchpad = Scratchpad.create(title: "",
                                               owner_id: current_user.id,
                                               public: false,
                                               data: "Comment:Welcome to Algebreezy! Type an equation in the box below and press Enter. A tree-representation of your equation will appear to the right. Click on the circles to manipulate the items in the tree. A sample equation is left for you below. Press ctrl+z to remove the last item on the scratch pad.;Equation:x^2+y^2=z^2",
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
  
    def profile
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
    
    def register
        render layout: 'general_layout'
    end
  
    def team
        render layout: 'general_layout'
    end
  
end