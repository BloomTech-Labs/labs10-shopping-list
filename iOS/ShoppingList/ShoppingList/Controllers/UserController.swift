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
import SimpleKeychain

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
        
       guard let accessToken = A0SimpleKeychain(service: "Auth0").string(forKey:"access_token") else {return}
        
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
    
    
    
    func updateUser(user: User, email: String?, profilePicture: String?, name: String?, completion: @escaping (User) -> Void) {
        
        var myUser = user
        
        if let email = email {
            myUser.email = email
        }
        
        
        if let profilePicture = profilePicture {
            myUser.profilePicture = profilePicture
        }
        
        if let name = name {
            myUser.name = name
        }
        
        myUser.updatedAt = Date().dateToString()
        
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
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        let url = baseURL.appendingPathComponent("user").appendingPathComponent(String(id))
         var request = URLRequest(url: url)
       
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
               
        Alamofire.request(request).validate().responseData { (response) in
 
            print(url)
            switch response.result {
            case .success(let value):
               
                let string = String(data: value, encoding: .utf8)
                 print("Data String: \(string!)")
                //guard let data = response.data else { completion(nil); return }
                
                do {
                    let decoder = JSONDecoder()
                    let user = try decoder.decode(User.self, from: value)
                    completion(user)
                    
                } catch {
                    print("Could not turn json into user")
                    completion(nil)
                    return
                }
                
            case .failure(let error):
                NSLog("getUser: \(error.localizedDescription)")
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
