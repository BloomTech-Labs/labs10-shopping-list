//
//  GroupMemberController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/26/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import Auth0


class GroupMemberController {
    
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    
    
    
    func getGroupMembers(forGroup group: Group, completion: @escaping (Group?) -> Void) {
        
        let url = baseURL.appendingPathComponent("groupMember").appendingPathComponent("group").appendingPathComponent(String(group.groupID))
        
        
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        print(request)
        
        
        Alamofire.request(request).validate().response { (response) in
            
            if let error = response.error {
                print(error.localizedDescription)
                completion(nil)
                return
            }
            
            guard let data = response.data else { completion(nil); return }
            
            do {
                
                let groupMembers = try JSONDecoder().decode([GroupMember].self, from: data)
                
                var newGroup = group
                newGroup.members = groupMembers
                completion(newGroup)
                
            } catch {
                print("Could not decode groupMembers")
                completion(nil)
                return
            }

        }
    }
    
    
}
