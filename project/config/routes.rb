Rails.application.routes.draw do
  devise_for :users, 
              controllers:{sessions: 'users/sessions', 
                           registrations: 'users/registrations', 
                           confirmations: 'users/confirmations', 
                           passwords: 'users/passwords', 
                           unlocks: 'users/unlocks'}
  get 'welcome/index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
   root 'welcome#index'

  get '/help', to: 'welcome#help'

  get '/about', to: 'welcome#about'

  get '/contact', to: 'welcome#contact'

  get '/usertest1', to: 'welcome#usertest1'
  
  get '/usertest2', to: 'useronly#usertest2'
  
  get '/samplemodel', to: 'welcome#sampleget'
  
  post '/samplemodel', to: 'welcome#samplepost'
  
  post '/save_scratchpad_data', to: 'welcome#save_scratchpad_data'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
