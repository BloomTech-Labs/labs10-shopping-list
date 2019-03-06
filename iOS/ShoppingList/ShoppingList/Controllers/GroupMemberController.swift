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
    
    
    
    
    func getGroupMembers(completion: @escaping (Bool) -> Void) {
        guard let group = selectedGroup else { completion(false); return }
        
        let url = baseURL.appendingPathComponent("groupMember").appendingPathComponent("group").appendingPathComponent(String(group.groupID))
        
        
        guard let accessToken = SessionManager.tokens?.idToken else { completion(false); return }
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        
        Alamofire.request(request).validate().response { (response) in
            
            if let error = response.error {
                print(error.localizedDescription)
                completion(false)
                return
            }
            
            guard let data = response.data else { completion(false); return }
            
            let dataString = String(data: data, encoding: .utf8)
            print(dataString)
            
            do {
                
                let members = try JSONDecoder().decode([GroupMember].self, from: data)
                
                groupMembers = members
                completion(true)
                return
                
            } catch {
                print("Could not decode groupMembers")
                completion(false)
                return
            }

        }
    }
    
    
}
