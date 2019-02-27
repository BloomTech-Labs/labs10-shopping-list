//
//  GroupController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation
import Alamofire
import SwiftKeychainWrapper
import Auth0

class GroupController {
    
    struct UserID: Codable {
        let id: Int
    }
    
    static let shared = GroupController()
   static private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    static func getUserID(completion: @escaping (UserID?) -> Void) {
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        let url = baseURL.appendingPathComponent("user").appendingPathComponent("check").appendingPathComponent("getid")
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        Alamofire.request(request).validate().responseData { (response) in
            
            print(url)
            switch response.result {
            case .success(let value):
                
                let string = String(data: value, encoding: .utf8)
                print("Data String: \(string!)")
                
 
                do {
                    let decoder = JSONDecoder()
                    let user = try decoder.decode(UserID.self, from: value)
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
    
    
    
   static private func groupToJSON(group: Group) -> [String: Any]? {
        
        guard let jsonData = try? JSONEncoder().encode(group) else {
            return nil
        }
        
        do {
            let jsonDict = try JSONSerialization.jsonObject(with: jsonData, options: []) as? [String: Any]
            return jsonDict
        } catch {
            return nil
        }
    }
    
   static func newGroup(withName name: String, byUserID userID: Int, completion: @escaping (Group?) -> Void) {
        
        let url = baseURL.appendingPathComponent("group")
        
        //guard let accessToken =  KeychainWrapper.standard.string(forKey: "accessToken") else {return}
        
      //  let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
        
        // TODO: Generate unique token
        let token = "12345"
        
        let parameters: Parameters = ["userID": userID, "name": name, "token": token]
        
        Alamofire.request(url, method: .post, parameters: parameters, encoding: JSONEncoding.default).validate().responseJSON { (response) in

            
            switch response.result {
            case .success(let value):
                
                guard let jsonDict = value as? [String: Any],
                let group = jsonDict["group"] as? [String: Any],
                let groupID = group["id"] as? Int
                
                else {
                    print("Could not get groupID from API response")
                    completion(nil)
                    return
                }
                
                let newGroup = Group(name: name, userID: userID, token: token, groupID: groupID)
                
//                newGroup.groupID = groupID
                completion(newGroup)
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(nil)
                return
            }
        }
    }
    
    
    // Updates the group and downloads all groups from server. Optional success completion.
   static func updateGroup(group: Group, name: String?, userID: Int?, completion: @escaping (Bool) -> Void = {_ in }) {
        
        var myGroup = group
        
        if let name = name {
            myGroup.name = name
        }
        
        if let userID = userID {
            myGroup.userID = userID
        }
        
        myGroup.updatedAt = Date().dateToString()
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent(String(myGroup.groupID))
        
        guard let groupJSON = groupToJSON(group: myGroup) else { return }
        
        Alamofire.request(url, method: .put, parameters: groupJSON, encoding: JSONEncoding.default).validate().responseJSON { (response) in

            switch response.result {
            case .success(_):
                
                // This downloads allGroups from server so we have fresh data
                //TODO: Need current userID here
                self.getGroups(forUserID: userID! /* XXX: is this right? */, completion: { (success) in
                    if success {
                        completion(true)
                    } else {
                        completion(false)
                    }
                })
                return
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(false)
                return
            }
        }
    }
    
    // Gets groups from server and updates the singleton. Optional success completion
    static func getGroups(forUserID userID: Int, completion: @escaping (Bool) -> Void = { _ in }) {
       guard let accessToken = SessionManager.tokens?.idToken else {return}
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent("user").appendingPathComponent(String(userID))
        
        
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        print(request)
        
        Alamofire.request(request).validate().responseData { (response) in
            switch response.result {
            case .success(let value):
                let string = String(data: value, encoding: .utf8)
                print("Data String: \(string!)")
                
                do {
                    
                    let decoder = JSONDecoder()
                    let groups = try decoder.decode(GroupsList.self, from: value)
                    
                    allGroups = groups.data
                    
                    completion(true)
                    
                } catch {
                    print("Error getting groups from API response\(response)")
                    completion(false)
                    return
                }
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(false)
                return
            }
        }
    }
    
    static func delete(group: Group, userID: Int,  completion: @escaping (Bool) -> Void) {
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent("remove")
        
        let parameters: Parameters = ["userID": userID, "groupID": group.groupID]
        
        Alamofire.request(url, parameters: parameters).validate().response { (response) in
            
            if let error = response.error {
                print(error.localizedDescription)
                completion(false)
                return
            }
            
            print("reponse.reponse: \(String(describing: response.response))")
            print("reponse.request: \(String(describing: response.request))")
            
            completion(true)
        }
    }
    
    
}
