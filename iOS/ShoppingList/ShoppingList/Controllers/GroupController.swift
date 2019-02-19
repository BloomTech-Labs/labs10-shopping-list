//
//  GroupController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire

class GroupController {
    
    private var apiRoot = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!

    func newGroup(withName name: String, completion: @escaping (Group?) -> Void) {
        
        guard let newGroup = CoreDataManager.shared.new(Group.self) else {
            // TODO: Error creating group
            print("Error creating group")
            completion(nil)
            return
        }
        
        newGroup.name = name
        newGroup.createdAt = Date()
        newGroup.updatedAt = Date()
        newGroup.groupID = Int32.random(in: Int32.min..<Int32.max)
        newGroup.token = getToken()
        newGroup.userID = getUserID()
        
        
        newGroupOnServer(group: newGroup) { (groupID) in
            
            guard let groupID = groupID else {
                print("Error getting groupID from server")
                completion(nil)
                return
            }
            
            newGroup.groupID = Int32(groupID)
            CoreDataManager.shared.save()
        }
    }
    

    private func newGroupOnServer(group: Group, completion: @escaping (Int?) -> Void){
        
        let endpoint = apiRoot.appendingPathComponent("groups").absoluteString
        guard let jsonDict = group.toJSON() else {
            completion(nil)
            return
        }
        
        Alamofire.request(endpoint, method: .post, parameters: jsonDict, encoding: JSONEncoding.default).responseJSON { (response) in
            
            guard response.result.error == nil else {
                print(response.result.error!)
                completion(nil)
                return
            }
            
            guard let json = response.result.value as? [String: Any] else {
                print("Didn't get JSON from api")
                completion(nil)
                return
            }
            
            guard let groupID = json["id"] as? Int else {
                print("Server did not return groupID")
                completion(nil)
                return
            }
            
            completion(groupID)
        }
    }

    
    
    
    
    // MARK: Temporary Functions
    // TODO: Remove this once we have way to get the real token
    func getToken() -> String {
        return "lalala"
    }
    
    func getUserID() -> Int32 {
        return Int32(123)
    }
    
    
    
    
}
