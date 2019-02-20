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
    
     let accessToken: String? = KeychainWrapper.standard.string(forKey: "accessToken")
    
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
        
        var newGroup = Group(name: name, userID: userID)
        let url = baseURL.appendingPathComponent("group")
        
        guard let groupJSON = groupToJSON(group: newGroup) else { return }
        
        
        Alamofire.request(url, method: .post, parameters: groupJSON, encoding: JSONEncoding.default).validate().responseJSON { (response) in
            
            switch response.result {
            case .success(let value):
                
                guard let jsonDict = value as? [String: Any], let groupID = jsonDict["groupID"] as? Int else {
                    print("Could not get groupID from API response")
                    completion(nil)
                    return
                }
                
                newGroup.groupID = groupID
                completion(newGroup)
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(nil)
                return
            }
        }
    }
    
    
    
    
    
    //    func newGroup(withName name: String, completion: @escaping (Group?) -> Void) {
    //
    //        guard let newGroup = CoreDataManager.shared.new(Group.self) else {
    //            // TODO: Error creating group
    //            print("Error creating group")
    //            completion(nil)
    //            return
    //        }
    //
    //        newGroup.name = name
    //        newGroup.createdAt = Date()
    //        newGroup.updatedAt = Date()
    //        newGroup.groupID = Int32.random(in: Int32.min..<Int32.max)
    //        newGroup.token = getToken()
    //        newGroup.userID = getUserID()
    //
    //
    //        newGroupOnServer(group: newGroup) { (groupID) in
    //
    //            guard let groupID = groupID else {
    //                print("Error getting groupID from server")
    //                completion(nil)
    //                return
    //            }
    //
    //            newGroup.groupID = Int32(groupID)
    //            CoreDataManager.shared.save()
    //
    //            completion(newGroup)
    //        }
    //    }
    //
    //
    //    private func newGroupOnServer(group: Group, completion: @escaping (Int?) -> Void){
    //
    //        let endpoint = apiRoot.appendingPathComponent("groups").absoluteString
    //        guard let jsonDict = group.toJSON() else {
    //            completion(nil)
    //            return
    //        }
    //
    //        Alamofire.request(endpoint, method: .post, parameters: jsonDict, encoding: JSONEncoding.default).responseJSON { (response) in
    //
    //            guard response.result.error == nil else {
    //                print(response.result.error!)
    //                completion(nil)
    //                return
    //            }
    //
    //            guard let json = response.result.value as? [String: Any] else {
    //                print("Didn't get JSON from api")
    //                completion(nil)
    //                return
    //            }
    //
    //            guard let groupID = json["id"] as? Int else {
    //                print("Server did not return groupID")
    //                completion(nil)
    //                return
    //            }
    //
    //            completion(groupID)
    //        }
    //    }
    
    
    
    
    
    // MARK: Temporary Functions
    // TODO: Remove this once we have way to get the real token
    func getToken() -> String {
        return "lalala"
    }
    
    func getUserID() -> Int32 {
        return Int32(123)
    }
    
    
    
    
}
