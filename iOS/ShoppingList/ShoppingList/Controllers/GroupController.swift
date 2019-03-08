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
import PusherSwift
import PushNotifications

class GroupController {
    
    struct Profile: Codable {
        let profile: User
    }
    
    struct User: Codable {
        let id: Int
        let name: String
    }
    
    static let shared = GroupController()
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
    func getUserID(completion: @escaping (Profile?) -> Void) {
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        let url = baseURL.appendingPathComponent("user").appendingPathComponent("check").appendingPathComponent("getid")
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        Alamofire.request(request).validate().responseData { (response) in
            
            switch response.result {
            case .success(let value):
                
                do {
                    let decoder = JSONDecoder()
                    let user = try decoder.decode(Profile.self, from: value)
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
    
    
    
    
    private func groupToJSON(group: Group) -> [String: Any]? {
        
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
    
    
    func newGroup(withName name: String, completion: @escaping (Group?) -> Void) {
        
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        
        self.getUserID { (id) in
            
            guard let userID = id?.profile.id else { completion(nil); return }
            
            let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
            let url = self.baseURL.appendingPathComponent("group")
            
            let token = "12345"
            
            let parameters: Parameters = ["userID": userID, "name": name, "token": token]
            
            Alamofire.request(url, method: .post, parameters: parameters, encoding: JSONEncoding.default, headers: headers).validate().responseJSON { (response) in
                
                
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
                    
                    completion(newGroup)
                    
                case .failure(let error):
                    print(error.localizedDescription)
                    completion(nil)
                    return
                }
            }
        }
    }
    
    
    // Updates the group and downloads all groups from server. Optional success completion.
    func updateGroup(
        group: Group,
        name: String?,
        userID: Int?,
        pusher: PushNotifications,
        completion: @escaping (Bool) -> Void = {_ in }
    ) {
        
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
        
        let myGroup = group
        
        if let name = name {
            myGroup.name = name
        }
        
        if let userID = userID {
            myGroup.userID = userID
        }
        
        myGroup.updatedAt = Date().dateToString()
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent(String(myGroup.groupID))
        
        guard let groupJSON = groupToJSON(group: myGroup) else { return }
        
        Alamofire.request(url, method: .put, parameters: groupJSON, encoding: JSONEncoding.default, headers: headers).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(_):
                
                // This downloads allGroups from server so we have fresh data
                //TODO: Need current userID here
                self.getGroups(forUserID: userID! /* XXX: is this right? */, pusher: pusher, completion: { (success) in
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
    func getGroups(
        forUserID userID: Int,
        pusher: PushNotifications,
        completion: @escaping (Bool) -> Void = { _ in }
        ) {
        
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent("user").appendingPathComponent(String(userID))
        
        
        var request = URLRequest(url: url)
        
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        Alamofire.request(request).validate().responseData { (response) in
            switch response.result {
            case .success(let value):
                
                do {
                    
                    let decoder = JSONDecoder()
                    let groups = try decoder.decode(GroupsList.self, from: value)
                    
                    allGroups = groups.groups
                    
                    for group in groups.groups {
                        let chan = "group-\(group.groupID)"
                        try! PushNotifications.shared.subscribe(interest:chan)
                    }
                    
                    completion(true)
                    
                } catch {
                    print("Error getting groups from API response\(error)")
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
    
    func delete(group: Group, completion: @escaping (Bool) -> Void) {
        guard let accessToken = SessionManager.tokens?.idToken else {return}
        let headers: HTTPHeaders = [ "Authorization": "Bearer \(accessToken)"]
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent("remove").appendingPathComponent("\(group.groupID)").appendingPathComponent("\(userID)")
        print(url)
        
        Alamofire.request(url, method: .delete, parameters: nil, encoding: JSONEncoding.default, headers: headers).validate().response { (response) in
            
            if let error = response.error {
                print(error.localizedDescription)
                completion(false)
                return
            }
            
            completion(true)
            
        }
        
    }
    
    
}
