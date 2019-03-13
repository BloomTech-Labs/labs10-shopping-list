//
//  InviteController.swift
//  ShoppingList
//
//  Created by Yvette Zhukovsky on 3/7/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import Auth0

private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!

class InviteController {
    
    static let shared = InviteController()
    
    func createInvite(completion: @escaping (Invite?) -> Void) {
        
        guard let accessToken = SessionManager.tokens?.idToken else {
            completion(nil)
            return}
        
        SessionManager.retrieveProfile { (profile, error) in
            if error != nil  {
                completion(nil)
                return
            }
            
            GroupController.shared.getUserID { (id) in
                
                guard let userID = id?.profile.id else {
                    completion(nil)
                    return
                }
                
                guard (profile?.email) != nil else {
                    completion(nil)
                    return
                }
                
                let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
                let url = baseURL.appendingPathComponent("invite").appendingPathComponent("create")
                guard let groupID = selectedGroup?.groupID else {
                    completion(nil)
                    return
                }
                
                let parameters: Parameters = ["userID": userID, "groupID": groupID, "invitee": "default@dummy.com"/* "invitee": invitee */]
                
                Alamofire.request(url, method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: headers).validate().responseData { (response) in
                    
                    
                    switch response.result {
                    case .success(let value):
                        
                        do {
                            let decoder = JSONDecoder()
                            let inviterCode = try decoder.decode(Invite.self, from: value)
                            completion(inviterCode)
                            
                            
                        } catch {
                            print("Could not turn json into messageCode \(error)")
                            completion(nil)
                            return
                        }
                        
                        
                    case .failure(let error):
                        print(error.localizedDescription)
                        completion(nil)
                        return
                    }
                }
            }
        }
    }
    
}
