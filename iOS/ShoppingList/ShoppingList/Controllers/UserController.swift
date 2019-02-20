//
//  UserController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/20/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire

class UserController {
    
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    private func userToJSON(user: User) -> [String: Any]? {
        
        guard let jsonData = try? JSONEncoder().encode(user) else {
            return nil
        }
        
        do {
            let jsonDict = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any]
            return jsonDict
        } catch {
            return nil
        }
    }
    
    func newUser(withName name: String, email: String, profilePicture: String, completion: @escaping (User?) -> Void) {
        
        var newUser = User(email: email, name: name, profilePicture: profilePicture)
        let url = baseURL.appendingPathComponent("user")
        
        guard let userJSON = userToJSON(user: newUser) else { return }
        
        
        Alamofire.request(url, method: .post, parameters: userJSON, encoding: JSONEncoding.default).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(let value):
                
                guard let jsonDict = value as? [String: Any], let userID = jsonDict["userID"] as? Int else {
                    print("Could not get userID from API response")
                    completion(nil)
                    return
                }
                
                newUser.userID = userID
                completion(newUser)
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(nil)
                return
            }
        }
    }
    
    
    
    func updateGroup(group: Group, name: String?, userID: Int?, completion: @escaping (Group) -> Void) {
        
        var myGroup = group
        
        if let name = name {
            myGroup.name = name
        }
        
        if let userID = userID {
            myGroup.userID = userID
        }
        
        myGroup.updatedAt = Date()
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent(String(myGroup.groupID!))
        
        guard let groupJSON = groupToJSON(group: myGroup) else { return }
        
        Alamofire.request(url, method: .put, parameters: groupJSON, encoding: JSONEncoding.default).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(_):
                
                completion(myGroup)
                return
            case .failure(let error):
                print(error.localizedDescription)
                completion(myGroup)
                return
            }
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
