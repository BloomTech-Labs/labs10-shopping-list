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
    
    
    func getGroupsForUser(user: User, completion: @escaping ([Group]?) -> Void) {
        
        let url = baseURL.appendingPathComponent("groupMember/user").appendingPathComponent(String(user.userID!))
        
        Alamofire.request(url).responseJSON { (response) in
            
            
            switch response.result {
            case .success(let value):
                
                guard let jsonData = value as? Data else { completion(nil); return }
                // TODO: Save these group members somewhere so we don't have to call for them twice
                guard let groupMembers = self.getGroupMembers(fromJSONData: jsonData) else { completion(nil); return }
                
                var groupSet = Set<Int>()
                
                for member in groupMembers {
                    groupSet.insert(member.groupID)
                }
                
                self.getGroups(withIds: Array(groupSet), completion: { (groups) in
                    
                    guard let groups = groups else { completion(nil); return }
                    
                    
                    completion(groups)
                    return
                })
                
            case .failure(let error):
                print(error.localizedDescription)
                completion(nil)
                return
            }
        }
    }
    
    private func getGroups(withIds ids: [Int], completion: @escaping ([Group]?) -> Void) {
        
        var groups: [Group] = []
        
        let dispatchGroup = DispatchGroup()
        
        for id in ids {
            dispatchGroup.enter()
            
            let url = baseURL.appendingPathComponent("group").appendingPathComponent(String(id))
            
            Alamofire.request(url).validate().responseJSON { (response) in
                
                switch response.result {
                case .success(let value):
                    
                    do {
                        guard let jsonData = value as? Data else { return }
                        let decoder = JSONDecoder()
                        let group = try decoder.decode(Group.self, from: jsonData)
                        
                        groups.append(group)
                        
                        dispatchGroup.leave()
                    } catch {
                        dispatchGroup.leave()
                        print("Error decoding json into a group")
                        return
                    }
                    
                    
                case .failure(let error):
                    print(error.localizedDescription)
                    dispatchGroup.leave()
                    completion(nil)
                    return
                }
            }
        }
        
        // Called after network request comes back from every group
        dispatchGroup.notify(queue: .main) {
            completion(groups)
            return
        }
    }
    
    
    
    
    private func getGroupMembers(fromJSONData data: Data) -> [GroupMember]? {
        
        var members: [GroupMember] = []
        
        do {
            let decoder = JSONDecoder()
            let memberList = try decoder.decode(GroupMemberList.self, from: data)
            
            for member in memberList.members {
                members.append(member)
            }
            
        } catch {
            print("Error getting groups from json")
            return nil
        }
        
        return members
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
