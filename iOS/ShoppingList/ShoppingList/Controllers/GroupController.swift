//
//  GroupController.swift
//  ShoppingList
//
//  Created by Nikita Thomas on 2/14/19.
//  Copyright © 2019 Lambda School Labs. All rights reserved.
//

import Foundation

class GroupController {
    

    func newGroup(withName name: String) {
        
        guard let newGroup = CoreDataManager.shared.new(Group.self) else {
            // TODO: Error creating group
            print("Error creating group")
            return
        }
        
        newGroup.name = name
        newGroup.createdAt = Date()
        newGroup.updatedAt = Date()
        newGroup.groupID = Int32(Int.random(in: Int.min..<Int.max))
        newGroup.token = getToken()
        newGroup.userID = getUserID()
        
        CoreDataManager.shared.save()
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
