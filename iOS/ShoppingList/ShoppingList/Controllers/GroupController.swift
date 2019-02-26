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

class GroupController {
    
    static let shared = GroupController()
    private var baseURL = URL(string: "https://shoptrak-backend.herokuapp.com/api/")!
    
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
    
    func newGroup(withName name: String, byUserID userID: Int, completion: @escaping (Group?) -> Void) {
        
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
                
                var newGroup = Group(name: name, userID: userID, token: token)
                
                newGroup.groupID = groupID
                completion(newGroup)
                
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
        
        myGroup.updatedAt = Date().dateToString()
        
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
    
    
    func getGroupWith(userID: Int, completion: @escaping ([Group]?) -> Void) {
        
        let url = baseURL.appendingPathComponent("group").appendingPathComponent("user").appendingPathComponent(String(userID))
        
        Alamofire.request(url).validate().responseData { (response) in
            print(url)
            switch response.result {
            case .success(let value):
                
                do {
                    
                    let decoder = JSONDecoder()
                    let groups = try decoder.decode(GroupsList.self, from: value)
                    
                    completion(groups.data)
                    
                } catch {
                    print("Error getting groups from API response")
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
