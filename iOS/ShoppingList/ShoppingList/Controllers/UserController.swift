//
//  UserController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/20/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import SwiftKeychainWrapper


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
        
        guard let accessToken =  KeychainWrapper.standard.string(forKey: "accessToken") else {return}
        
        let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
        
        
        Alamofire.request(url, method: .post, parameters: userJSON, encoding: JSONEncoding.default, headers: headers).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(let value):
                
                // TODO: API needs to be updated to return the userID in the Content
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
    
    
    
    func updateUser(user: User, email: String?, emailNotification: Bool?, role: String?, textNotification: Bool?, profilePicture: String?, name: String?, completion: @escaping (User) -> Void) {
        
        var myUser = user
        
        if let email = email {
            myUser.email = email
        }
        
        if let emailNotification = emailNotification {
            myUser.emailNotification = emailNotification
        }
        
        if let role = role {
            myUser.role = role
        }
        
        if let textNotification = textNotification {
            myUser.textNotification = textNotification
        }
        
        if let profilePicture = profilePicture {
            myUser.profilePicture = profilePicture
        }
        
        if let name = name {
            myUser.name = name
        }
        
        myUser.updatedAt = Date()
        
        let url = baseURL.appendingPathComponent("user").appendingPathComponent(String(myUser.userID!))
        
        guard let userJSON = userToJSON(user: myUser) else { return }
        
        Alamofire.request(url, method: .put, parameters: userJSON, encoding: JSONEncoding.default).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(_):
                
                completion(myUser)
                return
            case .failure(let error):
                print(error.localizedDescription)
                completion(myUser)
                return
            }
        }
    }
    
    func getUser(forID id: Int, completion: @escaping (User?) -> Void) {
        
        let url = baseURL.appendingPathComponent("user").appendingPathComponent(String(id))
        
        guard let accessToken =  KeychainWrapper.standard.string(forKey: "accessToken") else {return}
        
        let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
        
        Alamofire.request(url, method: .get, headers: headers).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(let value):
                
                let decoder = JSONDecoder()
                guard let data = response.data else { completion(nil); return }
                
                do {
                    let user = try decoder.decode(User.self, from: data)
                    completion(user)
                    
                } catch {
                    print("Could not turn json into user")
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
    
    
    // MARK: Temporary Functions
    // TODO: Remove this once we have way to get the real token
    func getToken() -> String {
        return "lalala"
    }
    
    func getUserID() -> Int32 {
        return Int32(123)
    }
    
}
